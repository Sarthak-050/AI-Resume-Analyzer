import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, FileText, X, Sparkles } from "lucide-react";

import { uploadResume } from "../services/resumeService";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/Loader";

const MAX_SIZE_MB = 5;

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadResume() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const versionOf = searchParams.get("versionOf");

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_SIZE_MB}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadResume(file, versionOf);

      toast.success(
        versionOf ? "New version uploaded successfully" : "Resume analyzed successfully"
      );

      navigate(`/resume/${data.resume._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex justify-center items-center px-4 py-10">
      <Card className="w-full max-w-lg p-5 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-600/15 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-50">
            {versionOf ? "Upload New Version" : "Upload Your Resume"}
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {versionOf
              ? "This will be linked to the original resume's version history."
              : "Get an instant ATS score and AI-powered feedback."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center cursor-pointer
                transition-colors duration-150
                ${
                  isDragging
                    ? "border-brand-500 bg-brand-600/10"
                    : "border-ink-700 hover:border-brand-500 hover:bg-ink-800/50"
                }`}
            >
              <UploadCloud className="w-10 h-10 text-ink-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-ink-200">
                Drag & drop your resume here
              </p>
              <p className="text-xs text-ink-400 mt-1">
                or click to browse — PDF only, up to {MAX_SIZE_MB}MB
              </p>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-ink-700 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-600/15 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-brand-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-ink-400">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {!uploading && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-ink-500 hover:text-rose-soft transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={!file || uploading}
            className="w-full mt-6"
          >
            {uploading ? (
              <>
                <Loader size={18} className="border-white/40 border-t-white" />
                Analyzing your resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>

          {uploading && (
            <p className="text-xs text-ink-400 text-center mt-3">
              This can take up to 10 seconds while our AI reads your resume.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}

export default UploadResume;