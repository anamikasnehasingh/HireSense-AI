import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { Match } from "../types";
import ScoreCard from "../components/ScoreCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RoadmapItem = {
  skill: string;
  priority: "High" | "Medium" | "Low";
  why: string;
  sequence: string[];
  exercise: string;
  project: string;
  estimated_effort: string;
  resource?: string | null;
  completed: boolean;
};

export default function Results() {
  const { id } = useParams();

  const [match, setMatch] = useState<Match | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD MATCH
  // =====================================================

  useEffect(() => {
    if (!id) return;

    api
      .get(`/matches/${id}`)
      .then((response) => {
        const data = response.data;

        setMatch(data);

        // If roadmap already exists in database,
        // load it automatically.
        if (
          Array.isArray(data.roadmap) &&
          data.roadmap.length > 0
        ) {
          setRoadmap(data.roadmap);
          setRoadmapGenerated(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load match results.");
      });
  }, [id]);

  // =====================================================
  // ROADMAP PROGRESS
  // =====================================================

  const progress = useMemo(() => {
    if (!roadmap.length) return 0;

    const completed = roadmap.filter(
      (item) => item.completed
    ).length;

    return Math.round(
      (completed / roadmap.length) * 100
    );
  }, [roadmap]);

  // =====================================================
  // GENERATE / LOAD ROADMAP
  // =====================================================

  const generateRoadmap = async () => {
    if (!id) return;

    try {
      setLoadingRoadmap(true);
      setError("");

      const response = await api.post(
        "/ai/learning-roadmap",
        {
          match_id: Number(id),
        }
      );

      const items = response.data.items || [];

      setRoadmap(items);
      setRoadmapGenerated(true);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to generate learning roadmap."
      );
    } finally {
      setLoadingRoadmap(false);
    }
  };

  // =====================================================
  // SAVE ROADMAP TO DATABASE
  // =====================================================

  const saveRoadmap = async (
    updatedRoadmap: RoadmapItem[]
  ) => {
    if (!id) return;

    try {
      setSavingRoadmap(true);

      await api.put(
        `/ai/learning-roadmap/${Number(id)}`,
        updatedRoadmap
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to save roadmap progress."
      );
    } finally {
      setSavingRoadmap(false);
    }
  };

  // =====================================================
  // TOGGLE COMPLETED
  // =====================================================

  const toggleCompleted = async (index: number) => {
    const updatedRoadmap = roadmap.map(
      (item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
    );

    // Update UI immediately
    setRoadmap(updatedRoadmap);

    // Save to SQLite
    await saveRoadmap(updatedRoadmap);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!match) {
    return (
      <div className="p-8">
        <p className="muted">
          Loading analysis...
        </p>
      </div>
    );
  }

  // =====================================================
  // CHART DATA
  // =====================================================

  const data = [
    ["Semantic", match.semantic_score],
    ["Skills", match.skill_score],
    ["Projects", match.project_score],
    ["Experience", match.experience_score],
  ].map(([name, value]) => ({
    name,
    value,
  }));

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-[#302B28]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-2">

        <div className="mb-3 inline-flex items-center rounded-full border border-[#F4512C]/25 bg-[#FFF0EA] px-4 py-2 text-sm font-medium text-[#F4512C]">
          ✨ AI match analysis
        </div>

        <h1 className="text-3xl font-bold">
          Match Results
        </h1>

        <p className="mt-2 text-[#756B66]">
          Understand how strongly your resume matches
          the selected job — with transparent,
          explainable scoring.
        </p>

      </div>

      {/* =================================================
          SCORE CARDS
      ================================================= */}

      <div className="mt-6 grid gap-4 md:grid-cols-5">

        <ScoreCard
          label="Overall"
          value={match.overall_score}
        />

        <ScoreCard
          label="Semantic"
          value={match.semantic_score}
        />

        <ScoreCard
          label="Required skills"
          value={match.skill_score}
        />

        <ScoreCard
          label="Projects"
          value={match.project_score}
        />

        <ScoreCard
          label="Experience"
          value={match.experience_score}
        />

      </div>

      {/* =================================================
          CHART
      ================================================= */}

      <div className="mt-6 rounded-2xl border border-[#E8D8D0] bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C]">
            ◎
          </div>

          <div>

            <h2 className="text-lg font-semibold">
              Match breakdown
            </h2>

            <p className="text-sm text-[#9A8F89]">
              How different areas contribute to your
              match
            </p>

          </div>

        </div>

        <div className="h-72">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={data}>

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#756B66",
                  fontSize: 13,
                }}
                axisLine={{
                  stroke: "#E8D8D0",
                }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fill: "#9A8F89",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: "#E8D8D0",
                }}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8D8D0",
                  borderRadius: "12px",
                  color: "#302B28",
                }}
                cursor={{
                  fill: "#FFF8F5",
                }}
              />

              <Bar
                dataKey="value"
                fill="#F4512C"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      </div>

      {/* =================================================
          SKILLS
      ================================================= */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        {/* MATCHED */}

        <div className="rounded-2xl border border-[#E8D8D0] bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C]">
              ✓
            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Matched skills
              </h2>

              <p className="text-sm text-[#9A8F89]">
                Skills found in your resume
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            {match.matched_skills.map(
              (skill) => (

                <span
                  className="inline-flex items-center rounded-full border border-[#F4512C]/25 bg-[#FFF8F5] px-3 py-1.5 text-sm font-medium text-[#F4512C]"
                  key={skill}
                >
                  ✓ {skill}
                </span>

              )
            )}

          </div>

        </div>

        {/* MISSING */}

        <div className="rounded-2xl border border-[#E8D8D0] bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512C]">
              !
            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Missing / unverified
              </h2>

              <p className="text-sm text-[#9A8F89]">
                Skills you should strengthen
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            {match.missing_skills.map(
              (skill) => (

                <span
                  key={skill}
                  className="inline-flex rounded-full border border-[#F4512C]/25 bg-[#FFF8F5] px-3 py-1.5 text-sm font-medium text-[#F4512C]"
                >
                  {skill}
                </span>

              )
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          IMPROVEMENTS
      ================================================= */}

      <div className="mt-4 rounded-2xl border border-[#E8D8D0] bg-white p-5 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-xl text-[#F4512C]">
            💡
          </div>

          <div>

            <h2 className="text-lg font-semibold">
              Grounded improvement suggestions
            </h2>

            <p className="text-sm text-[#9A8F89]">
              Practical improvements based on your
              match
            </p>

          </div>

        </div>

        <ul className="mt-5 space-y-3">

          {match.suggestions.map(
            (suggestion, index) => (

              <li
                key={index}
                className="flex gap-3 rounded-xl bg-[#FFF8F5] p-4 text-[#756B66]"
              >

                <span className="font-bold text-[#F4512C]">
                  {index + 1}.
                </span>

                <span>
                  {suggestion}
                </span>

              </li>

            )
          )}

        </ul>

      </div>

      {/* =================================================
          ROADMAP BUTTON
      ================================================= */}

      <div className="mt-6 flex items-center gap-4">

        <button
          className="rounded-xl bg-[#F4512C] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#E94322] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={generateRoadmap}
          disabled={loadingRoadmap}
        >

          {loadingRoadmap
            ? "Loading Roadmap..."
            : roadmapGenerated
            ? "Load Saved Roadmap"
            : "Generate Learning Roadmap"}

        </button>

        {savingRoadmap && (

          <span className="text-sm text-[#756B66]">
            Saving progress...
          </span>

        )}

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>

      )}

      {/* =================================================
          ROADMAP
      ================================================= */}

      {roadmapGenerated && (

        <section className="mt-8">

          {/* ROADMAP HEADER */}

          <div className="rounded-2xl border border-[#E8D8D0] bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <div className="mb-2 inline-flex rounded-full bg-[#FFF0EA] px-3 py-1 text-xs font-semibold text-[#F4512C]">
                  PERSONALIZED ROADMAP
                </div>

                <h2 className="text-2xl font-bold">
                  Personalized Learning Roadmap
                </h2>

                <p className="mt-1 text-[#756B66]">
                  Focused on the skills missing or
                  unverified for this job.
                </p>

              </div>

              <div className="text-right">

                <div className="text-3xl font-bold text-[#F4512C]">
                  {progress}%
                </div>

                <p className="text-sm text-[#9A8F89]">
                  Roadmap progress
                </p>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F6E5DE]">

              <div
                className="h-full rounded-full bg-[#F4512C] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-2 text-sm text-[#9A8F89]">
              {
                roadmap.filter(
                  (item) => item.completed
                ).length
              }{" "}
              of {roadmap.length} skills completed
            </p>

          </div>

          {/* ROADMAP CARDS */}

          <div className="mt-5 grid gap-5">

            {roadmap.map(
              (item, index) => (

                <div
                  className={`rounded-2xl border border-[#E8D8D0] bg-white p-6 shadow-sm transition ${
                    item.completed
                      ? "border-[#F4512C]/30 bg-[#FFF8F5]"
                      : ""
                  }`}
                  key={`${item.skill}-${index}`}
                >

                  {/* TITLE */}

                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl font-bold">
                          {item.skill}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.priority === "High"
                              ? "bg-[#FFF0EA] text-[#F4512C]"
                              : item.priority === "Medium"
                              ? "bg-[#FFF5E8] text-[#C77A00]"
                              : "bg-[#F5F1EF] text-[#756B66]"
                          }`}
                        >
                          {item.priority} Priority
                        </span>

                      </div>

                      <p className="mt-2 text-[#756B66]">
                        {item.why}
                      </p>

                    </div>

                    {item.completed && (

                      <span className="rounded-full bg-[#FFF0EA] px-3 py-1 text-sm font-medium text-[#F4512C]">
                        ✓ Completed
                      </span>

                    )}

                  </div>

                  {/* LEARNING SEQUENCE */}

                  <div className="mt-6">

                    <h4 className="font-semibold">
                      Learning Sequence
                    </h4>

                    <ol className="mt-3 space-y-3">

                      {item.sequence.map(
                        (step, stepIndex) => (

                          <li
                            key={step}
                            className="flex gap-3 text-[#756B66]"
                          >

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF0EA] text-sm font-semibold text-[#F4512C]">
                              {stepIndex + 1}
                            </span>

                            <span>
                              {step}
                            </span>

                          </li>

                        )
                      )}

                    </ol>

                  </div>

                  {/* EXERCISE */}

                  <div className="mt-6 rounded-xl border border-[#E8D8D0] bg-[#FFF8F5] p-4">

                    <h4 className="font-semibold">
                      🧪 Practice Exercise
                    </h4>

                    <p className="mt-2 text-[#756B66]">
                      {item.exercise}
                    </p>

                  </div>

                  {/* PROJECT */}

                  <div className="mt-4 rounded-xl border border-[#E8D8D0] bg-[#FFF8F5] p-4">

                    <h4 className="font-semibold">
                      🚀 Suggested Portfolio Project
                    </h4>

                    <p className="mt-2 text-[#756B66]">
                      {item.project}
                    </p>

                  </div>

                  {/* TIME + RESOURCE */}

                  <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>

                      <span className="text-sm font-medium text-[#F4512C]">
                        ⏱ {item.estimated_effort}
                      </span>

                    </div>

                    {item.resource && (

                      <a
                        href={item.resource}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-[#F4512C] hover:text-[#E94322]"
                      >
                        📚 Official Learning Resource →
                      </a>

                    )}

                  </div>

                  {/* COMPLETE BUTTON */}

                  <button
                    className={`mt-5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      item.completed
                        ? "bg-[#FFF0EA] text-[#F4512C]"
                        : "bg-[#F4512C] text-white hover:bg-[#E94322]"
                    }`}
                    onClick={() =>
                      toggleCompleted(index)
                    }
                    disabled={savingRoadmap}
                  >

                    {item.completed
                      ? "✓ Skill Learned"
                      : "Mark Skill as Learned"}

                  </button>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </div>
  );
}