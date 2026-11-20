import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Award, Plus, Inbox } from "lucide-react";

import { getMyResumes, deleteResume } from "../services/resumeService";
import { AuthContext } from "../context/AuthContext";

import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ResumeCard from "../components/ResumeCard";
import StatCard from "../components/StatCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import TiltCard from "../components/ui/TiltCard";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getMyResumes();
      setResumes(data.resumes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResume(id);
      toast.success("Resume deleted");
      fetchResumes();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const totalResumes = resumes.length;

  const scores = resumes
    .map((r) => r.analysis?.atsScore)
    .filter((s) => typeof s === "number");

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const bestScore = scores.length ? Math.max(...scores) : 0;

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-ink-50">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-ink-400 mt-1">
              Here's an overview of your resume performance.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" onClick={() => navigate("/upload")}>
              <Plus className="w-5 h-5" />
              Upload Resume
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid sm:grid-cols-3 gap-5 mb-8"
        >
          <motion.div variants={itemVariants}>
            <TiltCard maxTilt={6} className="rounded-card">
              <StatCard
                icon={FileText}
                label="Total Resumes"
                value={totalResumes}
                tone="brand"
              />
            </TiltCard>
          </motion.div>
          <motion.div variants={itemVariants}>
            <TiltCard maxTilt={6} className="rounded-card">
              <StatCard
                icon={TrendingUp}
                label="Average ATS Score"
                value={avgScore}
                tone="scan"
              />
            </TiltCard>
          </motion.div>
          <motion.div variants={itemVariants}>
            <TiltCard maxTilt={6} className="rounded-card">
              <StatCard
                icon={Award}
                label="Best Score"
                value={bestScore}
                tone="amber"
              />
            </TiltCard>
          </motion.div>
        </motion.div>

        <h2 className="text-xl font-bold text-ink-50 mb-4">
          My Resumes
        </h2>

        {loading ? (
          <DashboardSkeleton />
        ) : resumes.length === 0 ? (
          <div className="bg-ink-900 border border-ink-800 rounded-card">
            <EmptyState
              icon={Inbox}
              title="No resumes uploaded yet"
              description="Upload your first resume to get an instant ATS score, skill gaps, and AI-powered improvement suggestions."
              action={
                <Button onClick={() => navigate("/upload")}>
                  <Plus className="w-4 h-4" />
                  Upload your first resume
                </Button>
              }
            />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-5"
          >
            {resumes.map((resume) => (
              <motion.div key={resume._id} variants={itemVariants}>
                <TiltCard maxTilt={4} className="rounded-card">
                  <ResumeCard
                    resume={resume}
                    onView={(id) => navigate(`/resume/${id}`)}
                    onDelete={handleDelete}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;