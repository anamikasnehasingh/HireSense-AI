import { useEffect, useState } from "react";
import api from "../services/api";
import type { Resume } from "../types";
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileUp,
} from "lucide-react";

export default function Resumes() {
  const [items, setItems] = useState<Resume[]>([]);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () =>
    api.get("/resumes").then((r) => setItems(r.data));

  useEffect(() => {
    load();
  }, []);

  async function upload(f: File) {
    const fd = new FormData();
    fd.append("file", f);

    try {
      setUploading(true);
      setMsg("Uploading and parsing...");

      await api.post("/resumes/upload", fd);

      setMsg("Resume parsed successfully.");
      await load();
    } catch (e: any) {
      setMsg(e.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function deleteResume(id: string | number) {
    try {
      await api.delete(`/resumes/${id}`);
      await load();
    } catch (e) {
      console.error("Failed to delete resume:", e);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* ================= HEADER ================= */}
      <section className="mb-8">

        <div className="inline-flex items-center gap-2 rounded-full border border-[#F5C2B2] bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#C63E21]">
          <Sparkles size={14} />
          Resume intelligence
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1E1E1E] md:text-4xl">
          Resume Library
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756B66] md:text-base">
          Upload your resumes and let HireSense extract the skills,
          experience and information needed for job matching.
        </p>

      </section>

      {/* ================= UPLOAD AREA ================= */}
      <section
        className="
          rounded-3xl
          border border-[#F2B6A3]
          bg-white
          p-6
          shadow-sm
          md:p-8
        "
      >

        <div className="flex flex-col items-center text-center">

          <div
            className="
              flex h-16 w-16
              items-center justify-center
              rounded-2xl
              bg-[#FFF0EA]
              text-[#F4512C]
            "
          >
            <FileUp size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#1E1E1E]">
            Upload a resume
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#756B66]">
            Select a PDF or DOCX resume. HireSense will automatically
            parse it and extract relevant information.
          </p>

          <label
            className="
              mt-6
              inline-flex cursor-pointer
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
              hover:shadow-lg
            "
          >
            <Upload size={18} />

            {uploading ? "Uploading..." : "Choose Resume"}

            <input
              className="hidden"
              type="file"
              accept=".pdf,.docx"
              disabled={uploading}
              onChange={(e) =>
                e.target.files?.[0] &&
                upload(e.target.files[0])
              }
            />
          </label>

          <p className="mt-3 text-xs text-[#9A8F89]">
            PDF or DOCX • Maximum 5 MB
          </p>

        </div>

      </section>

      {/* ================= STATUS ================= */}
      {msg && (
        <div
          className={`
            mt-4
            flex items-center gap-3
            rounded-xl
            border
            px-4 py-3
            text-sm
            ${
              msg.includes("successfully")
                ? "border-[#BBDCC8] bg-[#F0FAF3] text-[#287044]"
                : msg.includes("Uploading")
                ? "border-[#F5C2B2] bg-[#FFF7F3] text-[#8B5A4B]"
                : "border-[#F2B6A3] bg-[#FFF0EA] text-[#C63E21]"
            }
          `}
        >
          {msg.includes("successfully") ? (
            <CheckCircle2 size={18} />
          ) : msg.includes("Uploading") ? (
            <FileText size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{msg}</span>
        </div>
      )}

      {/* ================= RESUME COUNT ================= */}
      <div className="mt-8 flex items-end justify-between">

        <div>
          <h2 className="text-xl font-bold text-[#1E1E1E]">
            Your resumes
          </h2>

          <p className="mt-1 text-sm text-[#756B66]">
            {items.length === 0
              ? "No resumes uploaded yet."
              : `${items.length} resume${
                  items.length === 1 ? "" : "s"
                } in your library.`}
          </p>
        </div>

        <div className="hidden rounded-full bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#C63E21] sm:block">
          {items.length} saved
        </div>

      </div>

      {/* ================= RESUME LIST ================= */}
      <div className="mt-4 grid gap-4">

        {items.length === 0 ? (
          <div
            className="
              rounded-2xl
              border border-dashed border-[#E8C8BC]
              bg-[#FFF7F3]
              px-6 py-12
              text-center
            "
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#F4512C] shadow-sm">
              <FileText size={22} />
            </div>

            <h3 className="mt-4 font-bold text-[#302B28]">
              Your resume library is empty
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[#756B66]">
              Upload your first resume above to start analyzing
              your job matches.
            </p>
          </div>
        ) : (
          items.map((r) => (
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
              key={r.id}
            >

              {/* Resume header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div
                    className="
                      flex h-11 w-11
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#FFF0EA]
                      text-[#F4512C]
                    "
                  >
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#302B28]">
                      {r.filename}
                    </h3>

                    <p className="mt-1 text-xs text-[#9A8F89]">
                      Parsed resume
                    </p>
                  </div>

                </div>

                <button
                  className="
                    inline-flex shrink-0
                    items-center justify-center gap-2
                    rounded-lg
                    border border-[#F0D6CE]
                    px-3 py-2
                    text-xs font-semibold
                    text-[#9A5A4B]
                    transition-colors
                    hover:border-[#F2B6A3]
                    hover:bg-[#FFF0EA]
                    hover:text-[#D6452A]
                  "
                  onClick={() => deleteResume(r.id)}
                >
                  <Trash2 size={15} />
                  Delete
                </button>

              </div>

              {/* Skills */}
              <div className="mt-5 border-t border-[#F0E3DE] pt-4">

                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9A8F89]">
                    Extracted skills
                  </span>

                  <span className="rounded-full bg-[#FFF0EA] px-2 py-0.5 text-[10px] font-semibold text-[#C63E21]">
                    {r.skills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">

                  {r.skills.length > 0 ? (
                    r.skills.map((s) => (
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
                      No skills detected.
                    </span>
                  )}

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}