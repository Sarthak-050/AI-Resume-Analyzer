import { ExternalLink } from "lucide-react";
import Modal from "./ui/Modal";

function ResumePreviewModal({ isOpen, onClose, fileUrl, resumeName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={resumeName} size="xl">
      <div className="flex flex-col gap-3">
        <div className="rounded-lg overflow-hidden border border-ink-800 bg-ink-950">
          <iframe src={fileUrl} title={resumeName} className="w-full h-[70vh]" />
        </div>

        <p className="text-xs text-ink-400">
          Not loading?{" "}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline inline-flex items-center gap-1">
            Open in a new tab <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </Modal>
  );
}

export default ResumePreviewModal;