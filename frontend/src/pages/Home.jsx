import { Link } from "react-router-dom";
import { useContext } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ScanSearch, Sparkles, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TiltCard from "../components/ui/TiltCard";
import MagneticButton from "../components/ui/MagneticButton";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload your resume",
    description: "Drop in your PDF — no formatting or setup needed.",
  },
  {
    icon: ScanSearch,
    title: "AI scans it like an ATS",
    description:
      "We analyze structure, keywords, and skills the way real hiring systems do.",
  },
  {
    icon: Sparkles,
    title: "Get your score & fixes",
    description:
      "See your ATS score, missing skills, and exact improvements to make.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="bg-ink-950">
      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 text-center"
      >
        <motion.span
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 bg-brand-600/15 text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-600/30"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-ink-50 mt-6 leading-tight"
        >
          Beat the ATS.
          <br />
          Land the interview.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg text-ink-400 max-w-2xl mx-auto"
        >
          Upload your resume and get an instant AI-powered ATS score,
          missing skills, strengths, and personalized improvement suggestions.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <MagneticButton>
            <Link to={isAuthenticated ? "/upload" : "/register"}>
              <Button size="lg" className="w-full sm:w-auto">
                {isAuthenticated ? "Upload Resume" : "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </MagneticButton>

          {!isAuthenticated && (
            <MagneticButton>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </MagneticButton>
          )}
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-20"
      >
        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold text-ink-50 text-center mb-10"
        >
          How it works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TiltCard className="rounded-card">
                <Card className="p-6 h-full">
                  <div className="w-11 h-11 rounded-lg bg-brand-600/15 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-ink-50">{step.title}</h3>
                  <p className="text-sm text-ink-400 mt-2">{step.description}</p>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default Home;