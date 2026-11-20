const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-120b";

const analyzeResume = async (resumeText) => {

const prompt = `
You are an ATS (Applicant Tracking System) resume analyzer used by a
resume-improvement product. You evaluate resumes fairly and calibrate
scores realistically — most real resumes from working professionals or
capable students should NOT score in single digits or as failing unless
the resume is genuinely broken, empty, or unrelated to any job.

FIRST, determine whether the document below is actually a resume/CV
(a document describing a person's work experience, education, and
skills for job-seeking purposes). It is NOT a resume if it is something
else entirely — e.g. a test/assessment score report, an invoice, an
article, a certificate, a random form, or any other non-resume document.

If it is NOT a resume, return ONLY this JSON and nothing else:

{
  "isResume": false,
  "atsScore": 0,
  "strongSkills": [],
  "missingSkills": [],
  "resumeImprovements": []
}

If it IS a resume, silently identify (do not output this):
- The candidate's field/domain and apparent seniority level.

Then evaluate and return ONLY valid JSON. Do not write markdown. Do not
write explanations. Do not use \`\`\`json.

Return exactly in this format:

{
  "isResume": true,
  "atsScore": 0,
  "strongSkills": [],
  "missingSkills": [],
  "resumeImprovements": []
}

atsScore calibration (use this rubric, do not default to extreme low scores):
- 85-100: Strong, well-structured resume with clear skills, quantified
  achievements, and good formatting for this candidate's field.
- 65-84: Solid resume, covers the basics well, has some room to improve
  (e.g. missing metrics, could use stronger action verbs).
- 40-64: Average resume — has real content but noticeable gaps in
  structure, clarity, or relevant skills for its field.
- 15-39: Weak resume — sparse content, unclear structure, or missing most
  expected elements for its field.
- 0-14: Reserved ONLY for resumes that are essentially empty, unreadable,
  or completely unrelated to any professional role.
A resume with several identified strong skills and real work/project
experience should almost never score below 40. Score the resume on its
own merits — do not let a strict tone bias you toward low scores.

missingSkills rules:
- Every item must be derived ONLY from this specific resume's own field,
  target role, and existing content — never reused from any external
  example or template.
- Do not default to generic trending buzzwords (Cloud Computing, DevOps,
  Cyber Security, Data Engineering, NLP, AI/ML, Kubernetes, Machine
  Learning) unless the resume's own content or clearly stated target role
  concretely supports that specific skill for that specific candidate.
- Phrase each item as a specific, named skill or tool relevant to this
  candidate's actual field (not a vague category), but the specific skill
  named must vary resume-to-resume based on what that resume is missing —
  never reuse the same phrase across different candidates' resumes.
- It's fine for this list to be short (0-2 items) for a strong resume —
  don't pad it to look more thorough.

Other rules:
- "strongSkills" must be explicitly evidenced in the resume text.
- "resumeImprovements" must reference specifics from THIS resume, not
  generic advice that could apply to any resume.
- Base every judgment strictly on the resume text below. Do not invent
  facts, companies, or experience that isn't there.

Document:

${resumeText}
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  return chatCompletion.choices[0].message.content;
};

const matchResumeWithJD = async (resumeText, jobDescription) => {

const prompt = `
You are an ATS matching engine that compares a resume against a job description.

Analyze both and return ONLY valid JSON.

Do not write markdown.
Do not write explanations.
Do not use \`\`\`json.

Return exactly in this format:

{
  "matchScore": 0,
  "verdict": "",
  "matchedKeywords": [],
  "missingKeywords": []
}

Rules:
- "matchScore" is 0-100, how well the resume matches the job description.
- "verdict" is one short sentence (max 15 words) summarizing the match quality.
- "matchedKeywords" are skills/keywords from the job description that ARE present in the resume.
- "missingKeywords" are important skills/keywords from the job description that are NOT present in the resume.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return chatCompletion.choices[0].message.content;
};

const rewriteResumeText = async (originalText, resumeContext) => {

const prompt = `
You are an expert resume writer who improves resume bullet points to be
ATS-friendly, action-oriented, and results-focused.

Rewrite the given text into 3 improved alternative versions.

Return ONLY valid JSON.
Do not write markdown.
Do not write explanations.
Do not use \`\`\`json.

Return exactly in this format:

{
  "rewrites": ["", "", ""]
}

Rules:
- Each rewrite should start with a strong action verb.
- Keep each rewrite to a single line, under 30 words.
- Where reasonable, hint at measurable impact (numbers, %, scale) without inventing false facts.
- Do not add skills or claims that are not implied by the original text.
- Use the resume context only to understand tone/domain, not to copy from it directly.

Resume context (for tone/domain reference only):
${resumeContext?.slice(0, 1500) || "N/A"}

Text to rewrite:
"${originalText}"
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  return chatCompletion.choices[0].message.content;
};

// ===== Multi-Agent Hiring Panel =====

const runPersonaReview = async ({ systemPersona, focusInstructions, resumeText, temperature }) => {
  const prompt = `
${systemPersona}

${focusInstructions}

Return ONLY valid JSON. Do not write markdown. Do not use \`\`\`json.

Return exactly in this format:

{
  "verdict": "",
  "score": 0,
  "feedback": ""
}

Rules:
- "verdict" is a short label (2-4 words), e.g. "Strong Candidate", "Needs Work", "Red Flags Present".
- "score" is 0-100, scored strictly from YOUR persona's perspective and priorities only.
- "feedback" is 2-3 sentences, specific to THIS resume, written in your persona's voice and priorities.
- Base everything strictly on the resume text below. Do not invent facts.

Resume:
${resumeText}
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature,
  });

  return JSON.parse(chatCompletion.choices[0].message.content);
};

const runATSBotReview = (resumeText) =>
  runPersonaReview({
    systemPersona:
      "You are 'The ATS Bot' — a purely mechanical applicant tracking system. You have no emotion or opinion about career narrative. You only care about parseable structure, keyword presence, formatting consistency, and whether a machine could correctly extract sections (contact info, experience, education, skills).",
    focusInstructions:
      "Evaluate ONLY structure, formatting, and keyword/skill presence for this resume's field. Ignore soft factors like 'impressiveness' or career story entirely.",
    resumeText,
    temperature: 0.2,
  });

const runSkepticalRecruiterReview = (resumeText) =>
  runPersonaReview({
    systemPersona:
      "You are 'The Skeptical Recruiter' — you screen hundreds of resumes and give each one roughly 6-8 seconds. You are blunt, time-pressured, and quick to flag anything unclear, generic, or unquantified. You are not cruel, but you do not give benefit of the doubt.",
    focusInstructions:
      "Evaluate this resume the way a busy recruiter skimming quickly would: clarity at a glance, obvious red flags (unexplained gaps, vague titles, no measurable outcomes), and whether it would survive a 6-second skim.",
    resumeText,
    temperature: 0.5,
  });

const runHiringManagerReview = (resumeText) =>
  runPersonaReview({
    systemPersona:
      "You are 'The Hiring Manager' — you actually have to work with whoever gets hired. You care about depth of real experience, project impact, problem-solving ability, and whether this person could genuinely do the job well, regardless of how polished the resume looks.",
    focusInstructions:
      "Evaluate the substance behind this resume: depth of projects/experience, evidence of real impact or ownership, and whether the candidate seems genuinely capable — not just well-formatted.",
    resumeText,
    temperature: 0.4,
  });

const synthesizePanelReviews = async (resumeText, atsReview, recruiterReview, managerReview) => {
  const prompt = `
You are synthesizing feedback from three independent resume reviewers who
each evaluated the same resume from a different perspective, without
seeing each other's opinions.

ATS Bot said: ${JSON.stringify(atsReview)}
Skeptical Recruiter said: ${JSON.stringify(recruiterReview)}
Hiring Manager said: ${JSON.stringify(managerReview)}

Return ONLY valid JSON. Do not write markdown. Do not use \`\`\`json.

Return exactly in this format:

{
  "agreements": [],
  "disagreements": [],
  "summary": ""
}

Rules:
- "agreements" are specific points where at least two of the three reviewers
  effectively agree (even if worded differently). Phrase each as a single
  clear sentence.
- "disagreements" are specific points where the reviewers meaningfully
  conflict (e.g. one sees strength where another sees weakness). Phrase
  each as a single sentence naming which perspectives disagree and why.
  If there are genuinely no meaningful disagreements, return an empty array.
- "summary" is 2-3 sentences giving the candidate one clear, actionable
  takeaway from the panel as a whole.
- Do not invent facts about the resume beyond what the three reviews state.
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return JSON.parse(chatCompletion.choices[0].message.content);
};

const runHiringPanel = async (resumeText) => {
  const [atsReview, recruiterReview, managerReview] = await Promise.all([
    runATSBotReview(resumeText),
    runSkepticalRecruiterReview(resumeText),
    runHiringManagerReview(resumeText),
  ]);

  const synthesis = await synthesizePanelReviews(
    resumeText,
    atsReview,
    recruiterReview,
    managerReview
  );

  return {
    panel: [
      { persona: "ATS Bot", ...atsReview },
      { persona: "Skeptical Recruiter", ...recruiterReview },
      { persona: "Hiring Manager", ...managerReview },
    ],
    synthesis,
  };
};

// ===== Auto-Fix: AI directly rewrites resume into a fixed, structured version =====

const generateStructuredResume = async (resumeText) => {

const prompt = `
You are an expert resume writer. Read the resume below, identify its
weaknesses (weak phrasing, unclear structure, unquantified achievements,
missing summary), and rewrite it into an IMPROVED, well-structured,
corrected version — as if you were personally fixing this candidate's
resume for them.

Do NOT invent companies, job titles, dates, degrees, or skills that are
not implied by the original resume. If a field genuinely cannot be found
(e.g. no phone number), return an empty string for it — never make one up.

Return ONLY valid JSON. Do not write markdown. Do not use \`\`\`json.

Return exactly in this format:

{
  "fullName": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ]
}

Rules:
- "summary" is a 2-3 sentence professional summary — write one even if the
  original resume didn't have one, based on the candidate's actual experience.
- "skills" is a flat array of skill names found in the resume.
- Each experience "bullets" array should be IMPROVED versions of the
  original bullets: stronger action verbs, clearer impact, tighter wording.
  Fix weak or vague bullets, but keep them truthful to the original meaning.
- Correct any awkward phrasing, redundant wording, or unclear structure
  found in the original resume text.
- Keep all facts truthful — this is a fix and rewrite for clarity and
  impact, not a fabrication of new experience.

Resume:
${resumeText}
`;

  const chatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return JSON.parse(chatCompletion.choices[0].message.content);
};

module.exports = {
  analyzeResume,
  matchResumeWithJD,
  rewriteResumeText,
  runHiringPanel,
  generateStructuredResume,
};