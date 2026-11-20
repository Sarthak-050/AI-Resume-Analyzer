import { useState } from "react";
import toast from "react-hot-toast";
import { Target, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { matchResumeWithJD } from "../services/resumeService";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import ScoreGauge from "./ui/ScoreGauge";

function JDMatchSection({ resumeId }) {
  const [jobDescription, setJobDescription] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (jobDescription.trim().length < 30) {
      toast.error("Please paste a fuller job description (min. 30 characters)");
      return;
    }

    try {
      setChecking(true);
      setResult(null);

      const data = await matchResumeWithJD(resumeId, jobDescription);
      setResult(data.match);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not compare with job description"
      );
    } finally {
      setChecking(false);
    }
  };

  const getVerdictTone = (score) => {
    if (score >= 75) return "success";
    if (score >= 50) return "brand";
    return "danger";
  };

  const matchedKeywords = result?.matchedKeywords || [];
  const missingKeywords = result?.missingKeywords || [];

  return (
    <Card className="p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-1">
        <Target className="w-5 h-5 text-brand-400" />
        Match Against a Job Description
      </h2>
      <p className="text-sm text-ink-400 mb-5">
        Paste a job description to see how well this resume matches.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        rows={6}
        className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
          rounded-lg p-4 text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />

      <Button
        onClick={handleCheck}
        disabled={checking}
        className="mt-4"
      >
        {checking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing match...
          </>
        ) : (
          <>
            <Target className="w-4 h-4" />
            Check Match
          </>
        )}
      </Button>

      {result && (
        <div className="mt-8 pt-8 border-t border-ink-800 space-y-8">

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreGauge score={result.matchScore} size={110} label="Match" />

            <div className="flex-1 text-center sm:text-left">
              <Badge tone={getVerdictTone(result.matchScore)}>
                {result.verdict}
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-100 mb-3">
                <CheckCircle2 className="w-4 h-4 text-scan-400" />
                Matched Keywords
                <span className="text-ink-500 font-normal">
                  ({matchedKeywords.length})
                </span>
              </h3>

              {matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, index) => (
                    <Badge key={index} tone="success">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-500">No matches found.</p>
              )}
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-100 mb-3">
                <XCircle className="w-4 h-4 text-rose-soft" />
                Missing Keywords
                <span className="text-ink-500 font-normal">
                  ({missingKeywords.length})
                </span>
              </h3>

              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, index) => (
                    <Badge key={index} tone="danger">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-500">Nothing missing — great fit!</p>
              )}
            </div>
          </div>

        </div>
      )}
    </Card>
  );
}

export default JDMatchSection;