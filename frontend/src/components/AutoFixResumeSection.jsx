import { useState } from "react";
import toast from "react-hot-toast";
import { Wand2, Loader2, Download, CheckCircle2 } from "lucide-react";

import { generateFixedResume } from "../services/resumeService";
import { generateEditedResumePDF } from "../utils/generateEditedResumePDF";
import Card from "./ui/Card";
import Button from "./ui/Button";

function AutoFixResumeSection({ resumeId }) {
  const [loading, setLoading] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  const handleAutoFix = async () => {
    try {
      setLoading(true);
      const res = await generateFixedResume(resumeId);
      setFixedData(res.structuredResume);
      toast.success("Resume fixed! Preview it below.");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not auto-fix this resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      generateEditedResumePDF(fixedData);
      toast.success("Fixed resume downloaded");
    } catch (error) {
      console.log(error);
      toast.error("Could not generate PDF");
    }
  };

  return (
    <Card className="p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-1">
        <Wand2 className="w-5 h-5 text-brand-400" />
        Auto-Fix My Resume
      </h2>
      <p className="text-sm text-ink-400 mb-5">
        One click — AI finds the weak spots in your resume and fixes them
        automatically. Preview the result, then download it as a ready-to-send PDF.
      </p>

      {!fixedData ? (
        <Button onClick={handleAutoFix} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fixing your resume...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Auto-Fix My Resume
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-5">

          {/* Read-only preview of the fixed resume */}
          <div className="bg-ink-800 border border-ink-700 rounded-lg p-5 max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-bold text-ink-50">
              {fixedData.fullName}
            </h3>
            <p className="text-xs text-ink-400 mt-0.5">
              {[fixedData.email, fixedData.phone].filter(Boolean).join("  •  ")}
            </p>

            {fixedData.summary && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-1.5">
                  Summary
                </p>
                <p className="text-sm text-ink-200 leading-relaxed">
                  {fixedData.summary}
                </p>
              </div>
            )}

            {fixedData.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-1.5">
                  Skills
                </p>
                <p className="text-sm text-ink-200">
                  {fixedData.skills.join("  •  ")}
                </p>
              </div>
            )}

            {fixedData.experience?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-2">
                  Experience
                </p>
                <div className="space-y-3">
                  {fixedData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-ink-100">
                          {exp.title}
                        </p>
                        <p className="text-xs text-ink-500 shrink-0">
                          {exp.duration}
                        </p>
                      </div>
                      {exp.company && (
                        <p className="text-xs text-ink-400 italic">{exp.company}</p>
                      )}
                      <ul className="mt-1.5 space-y-1">
                        {(exp.bullets || []).map((bullet, bi) => (
                          <li key={bi} className="text-sm text-ink-200 flex gap-2">
                            <span className="text-brand-400">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fixedData.education?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-2">
                  Education
                </p>
                <div className="space-y-2">
                  {fixedData.education.map((edu, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink-100">
                          {edu.degree}
                        </p>
                        <p className="text-xs text-ink-400">{edu.institution}</p>
                      </div>
                      <p className="text-xs text-ink-500 shrink-0">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download Fixed PDF
            </Button>
            <Button variant="secondary" onClick={handleAutoFix} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Re-run Auto-Fix
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AutoFixResumeSection;