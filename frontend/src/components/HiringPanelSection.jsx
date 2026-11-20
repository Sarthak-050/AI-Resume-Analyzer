import { useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Bot,
  Eye,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { getPanelReview } from "../services/resumeService";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const PERSONA_ICONS = {
  "ATS Bot": Bot,
  "Skeptical Recruiter": Eye,
  "Hiring Manager": Briefcase,
};

function getScoreTone(score) {
  if (score >= 75) return "success";
  if (score >= 50) return "brand";
  return "danger";
}

function HiringPanelSection({ resumeId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunPanel = async () => {
    try {
      setLoading(true);
      setResult(null);

      const data = await getPanelReview(resumeId);
      setResult(data);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not run the hiring panel"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-1">
        <Users className="w-5 h-5 text-brand-400" />
        Multi-Agent Hiring Panel
      </h2>
      <p className="text-sm text-ink-400 mb-5">
        Three independent AI reviewers — an ATS Bot, a Skeptical Recruiter,
        and a Hiring Manager — evaluate your resume separately, then a
        synthesis highlights where they agree and disagree.
      </p>

      <Button onClick={handleRunPanel} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Convening the panel...
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            Run Hiring Panel
          </>
        )}
      </Button>

      {result && (
        <div className="mt-8 space-y-8">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.panel.map((review) => {
              const Icon = PERSONA_ICONS[review.persona] || Bot;

              return (
                <div
                  key={review.persona}
                  className="bg-ink-800 border border-ink-700 rounded-lg p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-600/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-brand-400" />
                    </div>
                    <p className="text-sm font-semibold text-ink-100">
                      {review.persona}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-numeric text-2xl font-bold text-ink-50">
                      {review.score}
                    </span>
                    <Badge tone={getScoreTone(review.score)}>
                      {review.verdict}
                    </Badge>
                  </div>

                  <p className="text-xs text-ink-400 leading-relaxed">
                    {review.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-ink-800 pt-6">
            <h3 className="text-base font-bold text-ink-50 mb-4">
              Panel Consensus
            </h3>

            {result.synthesis.agreements?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-scan-400 mb-2 uppercase tracking-wide">
                  Where the panel agrees
                </p>
                <div className="space-y-2">
                  {result.synthesis.agreements.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-ink-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-scan-400 shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.synthesis.disagreements?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-amber-signal mb-2 uppercase tracking-wide">
                  Where the panel disagrees
                </p>
                <div className="space-y-2">
                  {result.synthesis.disagreements.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-ink-200"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-signal shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-600/10 border border-brand-600/20 rounded-lg p-4">
              <p className="text-sm text-ink-100">{result.synthesis.summary}</p>
            </div>
          </div>

        </div>
      )}
    </Card>
  );
}

export default HiringPanelSection;