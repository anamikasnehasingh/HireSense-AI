import { FormEvent, useEffect, useState } from "react";
import api from "../services/api";
import type { Job, Resume } from "../types";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Link as LinkIcon,
  Sparkles,
  Plus,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Jobs() {
  const nav = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selected, setSelected] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    url: "",
    description: "",
  });

  const load = () =>
    Promise.all([api.get("/jobs"), api.get("/resumes")]).then(
      ([j, r]) => {
        setJobs(j.data);
        setResumes(r.data);

        if (r.data[0] && !selected) {
          setSelected(r.data[0].id);
        }
      }
    );

  useEffect(() => {
    load();
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await api.post("/jobs", form);

      setForm({
        title: "",
        company: "",
        location: "",
        url: "",
        description: "",
      });

      setMessage("Job saved successfully.");
      await load();
    } catch (e: any) {
      setMessage(
        e.response?.data?.detail || "Unable to save job."
      );
    } finally {
      setLoading(false);
    }
  }

  async function analyze(jobId: number) {
    if (!selected) {
      setMessage("Upload a resume first to analyze this job.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/matches/analyze", {
        resume_id: selected,
        job_id: jobId,
      });

      nav(`/results/${data.id}`);
    } catch (e: any) {
      setMessage(
        e.response?.data?.detail || "Unable to analyze this job."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* ================= HEADER ================= */}
      <section className="mb-8">

        <div className="inline-flex items-center gap-2 rounded-full border border-[#F5C2B2] bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#C63E21]">
          <Sparkles size={14} />
          AI job matching
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1E1E1E] md:text-4xl">
          Jobs & Matching
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756B66] md:text-base">
          Save job descriptions and compare them with your resume
          to discover relevant skills and improvement opportunities.
        </p>

      </section>

      {/* ================= ADD JOB ================= */}
      <section className="rounded-3xl border border-[#F2B6A3] bg-white p-6 shadow-sm md:p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C]">
            <Plus size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#302B28]">
              Add a job
            </h2>

            <p className="mt-1 text-sm text-[#756B66]">
              Add the role you are targeting and analyze your resume
              against its requirements.
            </p>
          </div>

        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={add}
        >

          {/* Job title + company */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4D4541]">
                Job title
              </label>

              <div className="relative">
                <BriefcaseBusiness
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A95]"
                />

                <input
                  required
                  className="input pl-10 !border-[#E8D8D0] !bg-[#FFFCFA] !text-[#302B28] placeholder:!text-[#A59A95] focus:!border-[#F4512C]"
                  placeholder="e.g. Frontend Developer"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4D4541]">
                Company
              </label>

              <div className="relative">
                <Building2
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A95]"
                />

                <input
                  className="input pl-10 !border-[#E8D8D0] !bg-[#FFFCFA] !text-[#302B28] placeholder:!text-[#A59A95] focus:!border-[#F4512C]"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                />
              </div>
            </div>

          </div>

          {/* Location + URL */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4D4541]">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A95]"
                />

                <input
                  className="input pl-10 !border-[#E8D8D0] !bg-[#FFFCFA] !text-[#302B28] placeholder:!text-[#A59A95] focus:!border-[#F4512C]"
                  placeholder="e.g. Bangalore / Remote"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4D4541]">
                Job URL
              </label>

              <div className="relative">
                <LinkIcon
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A95]"
                />

                <input
                  type="url"
                  className="input pl-10 !border-[#E8D8D0] !bg-[#FFFCFA] !text-[#302B28] placeholder:!text-[#A59A95] focus:!border-[#F4512C]"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      url: e.target.value,
                    })
                  }
                />
              </div>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#4D4541]">
              Job description
            </label>

            <textarea
              required
              minLength={30}
              rows={8}
              className="input !border-[#E8D8D0] !bg-[#FFFCFA] !text-[#302B28] placeholder:!text-[#A59A95] focus:!border-[#F4512C]"
              placeholder="Paste the complete job description here..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <p className="mt-1 text-xs text-[#9A8F89]">
              Minimum 30 characters
            </p>
          </div>

          <button
            disabled={loading}
            className="
              inline-flex w-fit
              items-center gap-2
              rounded-xl
              bg-[#F4512C]
              px-5 py-3
              text-sm font-semibold
              text-white
              shadow-md shadow-[#F4512C]/20
              transition-all
              hover:-translate-y-0.5
              hover:bg-[#FF6A3D]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Plus size={18} />

            {loading ? "Saving..." : "Save Job"}
          </button>

        </form>

      </section>

      {/* ================= MESSAGE ================= */}
      {message && (
        <div
          className={`
            mt-4
            flex items-center gap-3
            rounded-xl
            border
            px-4 py-3
            text-sm
            ${
              message.includes("successfully")
                ? "border-[#BBDCC8] bg-[#F0FAF3] text-[#287044]"
                : "border-[#F2B6A3] bg-[#FFF0EA] text-[#C63E21]"
            }
          `}
        >
          {message.includes("successfully") ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* ================= RESUME SELECTOR ================= */}
      <section className="mt-8 rounded-2xl border border-[#E8D8D0] bg-[#FFF7F3] p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#F4512C] shadow-sm">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#302B28]">
                Resume for analysis
              </p>

              <p className="text-xs text-[#9A8F89]">
                Select the resume you want to compare against jobs.
              </p>
            </div>

          </div>

          <select
            className="input max-w-md !border-[#E8D8D0] !bg-white !text-[#302B28] focus:!border-[#F4512C]"
            value={selected}
            onChange={(e) =>
              setSelected(
                e.target.value
                  ? Number(e.target.value)
                  : ""
              )
            }
          >
            <option value="">Choose resume</option>

            {resumes.map((r) => (
              <option value={r.id} key={r.id}>
                {r.filename}
              </option>
            ))}
          </select>

        </div>

      </section>

      {/* ================= JOBS HEADER ================= */}
      <div className="mt-9 flex items-end justify-between">

        <div>
          <h2 className="text-xl font-bold text-[#302B28]">
            Saved jobs
          </h2>

          <p className="mt-1 text-sm text-[#756B66]">
            {jobs.length} saved job
            {jobs.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="hidden rounded-full bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#C63E21] sm:block">
          {jobs.length} tracked
        </div>

      </div>

      {/* ================= JOB LIST ================= */}
      <div className="mt-4 grid gap-4">

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8C8BC] bg-[#FFF7F3] px-6 py-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#F4512C] shadow-sm">
              <BriefcaseBusiness size={22} />
            </div>

            <h3 className="mt-4 font-bold text-[#302B28]">
              No jobs saved yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[#756B66]">
              Add your first job description above to start
              analyzing resume matches.
            </p>

          </div>
        ) : (
          jobs.map((j) => (
            <div
              className="
                group
                rounded-2xl
                border border-[#E8D8D0]
                bg-white
                p-5
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-[#F2B6A3]
                hover:shadow-md
              "
              key={j.id}
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                {/* Job info */}
                <div className="min-w-0">

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C]">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="text-xl font-bold text-[#302B28]">
                        {j.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#756B66]">

                        {j.company && (
                          <span className="flex items-center gap-1">
                            <Building2 size={14} />
                            {j.company}
                          </span>
                        )}

                        {j.location && (
                          <>
                            <span className="text-[#C9BBB5]">
                              •
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {j.location}
                            </span>
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* Skills */}
                  <div className="mt-5">

                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9A8F89]">
                      Required skills
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {j.required_skills.length > 0 ? (
                        j.required_skills.map((s) => (
                          <span
                            className="
                              inline-flex
                              rounded-full
                              border border-[#F5C2B2]
                              bg-[#FFF7F3]
                              px-3 py-1.5
                              text-xs font-medium
                              text-[#B8462D]
                            "
                            key={s}
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#9A8F89]">
                          No required skills detected.
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* Analyze */}
                <div className="shrink-0">

                  <button
                    disabled={loading}
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#F4512C]
                      px-5 py-3
                      text-sm font-semibold
                      text-white
                      shadow-md shadow-[#F4512C]/20
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-[#FF6A3D]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      lg:w-auto
                    "
                    onClick={() => analyze(j.id)}
                  >
                    <Sparkles size={17} />
                    Analyze Match
                  </button>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}