import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  FileText,
  BriefcaseBusiness,
  BarChart3,
  Upload,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    r: 0,
    j: 0,
    m: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/resumes"),
      api.get("/jobs"),
      api.get("/matches"),
    ])
      .then(([r, j, m]) =>
        setStats({
          r: r.data.length,
          j: j.data.length,
          m: m.data.length,
        })
      )
      .catch((error) => {
        console.error("Failed to load dashboard stats:", error);
      });
  }, []);

  const statCards = [
    {
      label: "Resumes",
      value: stats.r,
      description: "Uploaded resumes",
      icon: FileText,
    },
    {
      label: "Saved Jobs",
      value: stats.j,
      description: "Jobs you're tracking",
      icon: BriefcaseBusiness,
    },
    {
      label: "Analyses",
      value: stats.m,
      description: "Match analyses completed",
      icon: BarChart3,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">

      {/* ================= HEADER ================= */}
      <section className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#F5C2B2] bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#C63E21]">
              <Sparkles size={14} />
              AI-powered career intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#1E1E1E] md:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#756B66] md:text-base">
              Turn your resume into a stronger job match with
              explainable AI insights and personalized improvement paths.
            </p>
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid gap-4 md:grid-cols-3">

        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="
                group rounded-2xl border border-[#E8D8D0]
                bg-white p-5
                shadow-sm
                transition-all duration-200
                hover:-translate-y-1
                hover:border-[#F2B6A3]
                hover:shadow-lg
              "
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-[#756B66]">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-4xl font-bold tracking-tight text-[#1E1E1E]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-[#9A8F89]">
                    {stat.description}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl
                    bg-[#FFF0EA]
                    text-[#F4512C]
                    transition-colors
                    group-hover:bg-[#FFD6C3]
                  "
                >
                  <Icon size={21} />
                </div>

              </div>
            </div>
          );
        })}

      </section>

      {/* ================= START ANALYSIS ================= */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[#F2B6A3] bg-white shadow-sm">

        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">

          {/* Main content */}
          <div className="p-6 md:p-8">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4512C] text-white shadow-md shadow-[#F4512C]/20">
              <Target size={24} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4512C]">
              Start a new analysis
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#1E1E1E] md:text-3xl">
              Find out how strong your resume match is.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756B66] md:text-base">
              Upload your resume, choose a job description, and HireSense
              will analyze your skills, experience, projects and semantic
              relevance.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <Link
                to="/resumes"
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-[#F4512C]
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  shadow-md shadow-[#F4512C]/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#FF6A3D]
                  hover:shadow-lg
                "
              >
                <Upload size={17} />
                Upload Resume
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/jobs"
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  border border-[#E1CCC3]
                  bg-white
                  px-5 py-3
                  text-sm font-semibold
                  text-[#403934]
                  transition-all
                  hover:border-[#F2B6A3]
                  hover:bg-[#FFF7F3]
                  hover:text-[#F4512C]
                "
              >
                <Plus size={17} />
                Add Job
              </Link>

            </div>

          </div>

          {/* Workflow panel */}
          <div className="border-t border-[#E8D8D0] bg-[#FFF7F3] p-6 lg:border-l lg:border-t-0 md:p-8">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A8F89]">
              Your workflow
            </p>

            <div className="mt-5 space-y-5">

              <WorkflowStep
                number="01"
                title="Upload"
                description="Add your PDF or DOCX resume."
                icon={<Upload size={17} />}
              />

              <WorkflowStep
                number="02"
                title="Add a job"
                description="Choose the role you want to target."
                icon={<BriefcaseBusiness size={17} />}
              />

              <WorkflowStep
                number="03"
                title="Analyze"
                description="Discover matches and skill gaps."
                icon={<BarChart3 size={17} />}
                last
              />

            </div>

          </div>

        </div>

      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="mt-6">

        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E1E1E]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#756B66]">
              Continue building your job-ready profile.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <QuickAction
            to="/resumes"
            icon={<FileText size={20} />}
            title="Manage Resumes"
            description="Upload and manage your resume versions."
          />

          <QuickAction
            to="/jobs"
            icon={<BriefcaseBusiness size={20} />}
            title="Browse Jobs"
            description="Add job descriptions you want to target."
          />

          <QuickAction
            to="/history"
            icon={<TrendingUp size={20} />}
            title="View History"
            description="Review your previous resume analyses."
          />

        </div>

      </section>

      {/* ================= INSIGHT CARD ================= */}
      <section className="mt-6 mb-8 rounded-2xl border border-[#E8D8D0] bg-[#FFD6C3] p-5 md:p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#F4512C] shadow-sm">
              <Search size={20} />
            </div>

            <div>
              <h3 className="font-bold text-[#1E1E1E]">
                Make your next application count.
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-[#675A54]">
                HireSense focuses on explainable relevance—not hiring
                probabilities—so you can see exactly where your resume
                can improve.
              </p>
            </div>

          </div>

          <Link
            to="/resumes"
            className="
              inline-flex shrink-0 items-center justify-center gap-2
              rounded-xl
              bg-[#1E1E1E]
              px-4 py-2.5
              text-sm font-semibold
              text-white
              transition-all
              hover:bg-[#34302E]
            "
          >
            Get started
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>

    </div>
  );
}


/* ================================
   Workflow Step
   ================================ */

function WorkflowStep({
  number,
  title,
  description,
  icon,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-3">

      {!last && (
        <div className="absolute left-[17px] top-9 h-7 w-px bg-[#E8B9A7]" />
      )}

      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4512C] text-white">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-[#B5A8A2]">
            {number}
          </span>

          <h3 className="text-sm font-bold text-[#302B28]">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-xs leading-5 text-[#756B66]">
          {description}
        </p>
      </div>

    </div>
  );
}


/* ================================
   Quick Action
   ================================ */

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="
        group rounded-2xl
        border border-[#E8D8D0]
        bg-white
        p-5
        shadow-sm
        transition-all duration-200
        hover:-translate-y-1
        hover:border-[#F2B6A3]
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C] transition-colors group-hover:bg-[#FFD6C3]">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-[#B5A8A2] transition-all group-hover:translate-x-1 group-hover:text-[#F4512C]"
        />

      </div>

      <h3 className="mt-4 font-bold text-[#302B28]">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-[#756B66]">
        {description}
      </p>

    </Link>
  );
}