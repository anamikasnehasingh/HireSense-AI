import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import {
  History as HistoryIcon,
  ArrowRight,
  BarChart3,
  FileText,
  BriefcaseBusiness,
  Sparkles,
} from 'lucide-react'

export default function History() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.get('/matches').then((r) => setItems(r.data))
  }, [])

  return (
    <div className="min-h-full">

      {/* Header */}
      <div className="mb-8">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFB8A4] bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#E84522]">
          <Sparkles size={14} />
          AI match history
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#FF4B26]">
            <HistoryIcon size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#171717]">
              Match History
            </h1>

            <p className="mt-2 text-[#806E67]">
              Review your previous resume-to-job analyses and revisit
              your improvement insights.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="rounded-3xl border border-[#F2D7CD] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(72,36,24,0.06)]">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#FF4B26]">
            <BarChart3 size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#171717]">
            No analyses yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806E67]">
            Upload a resume, add a job and analyze the match.
            Your results will appear here.
          </p>
        </div>
      )}

      {/* History cards */}
      <div className="grid gap-4">

        {items.map((x) => {
          const score = Number(x.overall_score ?? 0)

          return (
            <Link
              to={`/results/${x.id}`}
              key={x.id}
              className="group block rounded-2xl border border-[#F0DCD4] bg-white p-5 shadow-[0_8px_30px_rgba(72,36,24,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[#FFB39D] hover:shadow-[0_14px_35px_rgba(255,75,38,0.10)]"
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* Left */}
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#FF4B26] transition group-hover:bg-[#FF4B26] group-hover:text-white">
                    <BarChart3 size={21} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-[#171717]">
                        Analysis #{x.id}
                      </h2>

                      <span className="rounded-full bg-[#FFF0EA] px-2.5 py-1 text-xs font-semibold text-[#E84522]">
                        Match analysis
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#806E67]">

                      <span className="flex items-center gap-1.5">
                        <FileText size={15} />
                        Resume #{x.resume_id}
                      </span>

                      <span className="hidden text-[#D9C4BC] sm:inline">
                        →
                      </span>

                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness size={15} />
                        Job #{x.job_id}
                      </span>

                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between gap-5 sm:justify-end">

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#9B8178]">
                      Overall Match
                    </p>

                    <p
                      className={`mt-1 text-3xl font-bold ${
                        score >= 70
                          ? 'text-[#2E8B57]'
                          : score >= 40
                            ? 'text-[#E58A00]'
                            : 'text-[#FF4B26]'
                      }`}
                    >
                      {score}%
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0DCD4] text-[#9B8178] transition group-hover:border-[#FFB8A4] group-hover:bg-[#FFF0EA] group-hover:text-[#FF4B26]">
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </div>

                </div>

              </div>

              {/* Progress */}
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F8E9E3]">
                <div
                  className={`h-full rounded-full transition-all ${
                    score >= 70
                      ? 'bg-[#4CAF50]'
                      : score >= 40
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#FF4B26]'
                  }`}
                  style={{
                    width: `${Math.min(Math.max(score, 0), 100)}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-[#A28D85]">
                <span>Resume relevance</span>
                <span>{score}% match</span>
              </div>

            </Link>
          )
        })}

      </div>
    </div>
  )
}