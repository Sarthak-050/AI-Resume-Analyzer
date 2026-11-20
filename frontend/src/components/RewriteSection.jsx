import { useState } from "react";
import toast from "react-hot-toast";
import { Wand2, Loader2, Copy, Check } from "lucide-react";

import { rewriteResumeText } from "../services/resumeService";
import Card from "./ui/Card";
import Button from "./ui/Button";

function RewriteSection({ resumeId }) {
  const [inputText, setInputText] = useState("");
  const [rewrites, setRewrites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleRewrite = async () => {
    if (inputText.trim().length < 5) {
      toast.error("Please enter a longer sentence to rewrite");
      return;
    }

    try {
      setLoading(true);
      setRewrites([]);

      const data = await rewriteResumeText(resumeId, inputText);
      setRewrites(data.rewrites || []);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not rewrite this text"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("Could not copy text");
    }
  };

  return (
    <Card className="p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-1">
        <Wand2 className="w-5 h-5 text-brand-400" />
        AI Resume Rewrite
      </h2>
      <p className="text-sm text-ink-400 mb-5">
        Paste a weak bullet point and get 3 stronger, ATS-friendly rewrites.
      </p>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder='e.g. "Worked on backend development for a web app"'
        rows={3}
        className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
          rounded-lg p-4 text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />

      <Button onClick={handleRewrite} disabled={loading} className="mt-4">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Rewriting...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Rewrite with AI
          </>
        )}
      </Button>

      {rewrites.length > 0 && (
        <div className="mt-6 space-y-3">
          {rewrites.map((line, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-ink-800 border border-ink-700 rounded-lg p-4"
            >
              <p className="text-sm text-ink-100 flex-1">{line}</p>

              <button
                onClick={() => handleCopy(line, index)}
                className="text-ink-400 hover:text-brand-400 transition-colors shrink-0"
                aria-label="Copy this rewrite"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-scan-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RewriteSection;