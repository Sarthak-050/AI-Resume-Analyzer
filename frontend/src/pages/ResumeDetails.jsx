import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  FileWarning,
  Eye,
  Download,
  FileDown,
  ExternalLink,
} from "lucide-react";

import { getResumeById } from "../services/resumeService";
import { API_ORIGIN } from "../services/api";
import { generateAIReport } from "../utils/generateReport";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ScoreGauge from "../components/ui/ScoreGauge";
import EmptyState from "../components/ui/EmptyState";
import ResumeDetailsSkeleton from "../components/ResumeDetailsSkeleton";
import ResumePreviewModal from "../components/ResumePreviewModal";
import JDMatchSection from "../components/JDMatchSection";
import RewriteSection from "../components/RewriteSection";
import HiringPanelSection from "../components/HiringPanelSection";
import AutoFixResumeSection from "../components/AutoFixResumeSection";
import VersionHistorySection from "../components/VersionHistorySection";
import Loader from "../components/Loader";

function getScoreMessage(score) {
  if (score >= 75) return { text: "Excellent Match", tone: "scan" };
  if (score >= 50) return { text: "Good, but room to improve", tone: "amber" };
  return { text: "Needs significant work", tone: "danger" };
}

function buildFileUrl(resumeUrl) {
  if (!resumeUrl) return null;
  if (/^https?:\/\//i.test(resumeUrl)) return resumeUrl;
  const cleanPath = resumeUrl.replace(/\\/g, "/").replace(/^\/?/, "/");
  return `${API_ORIGIN}${cleanPath}`;
}

function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getResumeById(id);
        setResume(data.resume);
      } catch (error) {
        console.log(error);
        setNotFound(true);
        toast.error(
          error.response?.data?.message || "Could not load this resume"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const handleDownload = async () => {
    const fileUrl = buildFileUrl(resume.resumeUrl);
    if (!fileUrl) return;

    try {
      setDownloading(true);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("File not found on server");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const fileName = resume.resumeName?.toLowerCase().endsWith(".pdf")
        ? resume.resumeName
        : `${resume.resumeName || "resume"}.pdf`;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      toast.error("Could not download resume");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadReport = () => {
    try {
      generateAIReport(resume);
      toast.success("Report downloaded");
    } catch (error) {
      console.log(error);
      toast.error("Could not generate report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 p-4 sm:p-6 md:p-10">
        <ResumeDetailsSkeleton />
      </div>
    );
  }

  if (notFound || !resume) {
    return (
      <div className="min-h-screen bg-ink-950 p-4 sm:p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <Card className="p-4">
            <EmptyState
              icon={FileWarning}
              title="Resume not found"
              description="This resume may have been deleted, or you may not have access to it."
              action={
                <Button onClick={() => navigate("/dashboard")}>
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  const score = resume.analysis?.atsScore ?? 0;
  const scoreMsg = getScoreMessage(score);
  const strongSkills = resume.analysis?.strongSkills || [];
  const missingSkills = resume.analysis?.missingSkills || [];
  const improvements = resume.analysis?.resumeImprovements || [];
  const fileUrl = buildFileUrl(resume.resumeUrl);

  return (
    <div className="min-h-screen bg-ink-950 p-4 sm:p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {fileUrl && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <Loader size={16} className="border-ink-500 border-t-ink-100" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download
                </Button>
              </>
            )}

            <Button size="sm" onClick={handleDownloadReport}>
              <FileDown className="w-4 h-4" />
              AI Report
            </Button>
          </div>
        </div>

        {/* Split view: PDF (left, desktop only) + Analysis (right) */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {fileUrl && (
            <div className="hidden lg:block lg:sticky lg:top-6">
              <Card className="p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-ink-800">
                  <p className="text-sm font-medium text-ink-200 truncate">
                    {resume.resumeName}
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-400 hover:text-brand-400 transition-colors shrink-0"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <iframe
                  src={fileUrl}
                  title={resume.resumeName}
                  className="w-full"
                  style={{ height: "calc(100vh - 180px)", minHeight: 500 }}
                />
              </Card>
            </div>
          )}

          <div className="space-y-6">
            <Card className="p-5 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-ink-50 truncate lg:hidden">
                {resume.resumeName}
              </h1>
              <p className="text-sm text-ink-400 mt-1 lg:hidden">
                Uploaded on{" "}
                {new Date(resume.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-col items-center py-8 border-y border-ink-800 my-8 lg:mt-0 lg:border-t-0">
                <ScoreGauge score={score} size={140} label="out of 100" />

                <Badge tone={scoreMsg.tone} className="mt-4 text-center">
                  {scoreMsg.text}
                </Badge>

                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-6 text-center">
                  <div>
                    <p className="font-numeric text-xl font-bold text-scan-400">
                      {strongSkills.length}
                    </p>
                    <p className="text-xs text-ink-400">Strong Skills</p>
                  </div>
                  <div>
                    <p className="font-numeric text-xl font-bold text-rose-soft">
                      {missingSkills.length}
                    </p>
                    <p className="text-xs text-ink-400">Missing Skills</p>
                  </div>
                  <div>
                    <p className="font-numeric text-xl font-bold text-brand-400">
                      {improvements.length}
                    </p>
                    <p className="text-xs text-ink-400">Suggestions</p>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-4">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  AI Resume Improvements
                </h2>

                {improvements.length > 0 ? (
                  <div className="space-y-2.5">
                    {improvements.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-brand-600/10 border border-brand-600/20 rounded-lg p-4"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-200">
                          {typeof item === "string" ? item : JSON.stringify(item)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-400">No suggestions available.</p>
                )}
              </section>

              <section className="mb-8">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-4">
                  <ThumbsUp className="w-5 h-5 text-scan-400" />
                  Strong Skills
                </h2>

                {strongSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {strongSkills.map((skill, index) => (
                      <Badge key={index} tone="success">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-400">No strong skills detected.</p>
                )}
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-4">
                  <AlertTriangle className="w-5 h-5 text-rose-soft" />
                  Missing Skills
                </h2>

                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, index) => (
                      <Badge key={index} tone="danger">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-400">No missing skills detected.</p>
                )}
              </section>
            </Card>
          </div>

        </div>

        <JDMatchSection resumeId={resume._id} />

        <RewriteSection resumeId={resume._id} />

        <HiringPanelSection resumeId={resume._id} />

        <AutoFixResumeSection resumeId={resume._id} />

        <VersionHistorySection resumeId={resume._id} />

      </div>

      {fileUrl && (
        <ResumePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          fileUrl={fileUrl}
          resumeName={resume.resumeName}
        />
      )}
    </div>
  );
}

export default ResumeDetails;
