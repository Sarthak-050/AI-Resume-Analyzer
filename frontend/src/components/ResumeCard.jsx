import { Eye, Trash2, Calendar } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import ScoreGauge from "./ui/ScoreGauge";

function ResumeCard({ resume, onView, onDelete }) {
  const score = resume.analysis?.atsScore ?? 0;

  return (
    <Card hover className="p-5 flex items-center gap-5">
      <ScoreGauge score={score} size={72} label="" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink-50 truncate">
          {resume.resumeName}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-ink-400">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(resume.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => onView(resume._id)}>
            <Eye className="w-4 h-4" />
            View
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(resume._id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ResumeCard;