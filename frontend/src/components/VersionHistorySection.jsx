import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Plus } from "lucide-react";

import { getVersionHistory } from "../services/resumeService";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

function VersionHistorySection({ resumeId }) {
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const data = await getVersionHistory(resumeId);
        setVersions(data.versions || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [resumeId]);

  if (loading) return null;

  return (
    <Card className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50">
          <History className="w-5 h-5 text-brand-400" />
          Version History
        </h2>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/upload?versionOf=${resumeId}`)}
        >
          <Plus className="w-4 h-4" />
          Upload New Version
        </Button>
      </div>

      {versions.length <= 1 ? (
        <p className="text-sm text-ink-400">
          No previous versions yet. Upload an updated resume to start tracking
          your progress over time.
        </p>
      ) : (
        <div className="space-y-2">
          {versions.map((version, index) => {
            const isCurrent = version._id === resumeId;

            return (
              <div
                key={version._id}
                onClick={() => !isCurrent && navigate(`/resume/${version._id}`)}
                className={`flex items-center justify-between gap-3 rounded-lg border p-4
                  transition-colors
                  ${
                    isCurrent
                      ? "bg-brand-600/10 border-brand-600/30"
                      : "bg-ink-800 border-ink-700 hover:border-brand-500 cursor-pointer"
                  }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-100 truncate">
                    Version {index + 1}
                    {isCurrent && (
                      <span className="text-brand-400"> (current)</span>
                    )}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {new Date(version.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <Badge tone="brand">
                  {version.analysis?.atsScore ?? "N/A"} / 100
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default VersionHistorySection;