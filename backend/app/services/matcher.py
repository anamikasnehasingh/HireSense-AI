import math, re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .skills import extract_skills
from app.core.config import settings

WEIGHTS = {"semantic": 0.40, "skills": 0.35, "projects": 0.15, "experience": 0.10}
_model = None

def semantic_similarity(a: str, b: str) -> float:
    global _model
    if settings.use_sentence_transformers:
        try:
            if _model is None:
                from sentence_transformers import SentenceTransformer
                _model = SentenceTransformer("all-MiniLM-L6-v2")
            emb = _model.encode([a, b], normalize_embeddings=True)
            return float(max(0, min(1, emb[0] @ emb[1])) * 100)
        except Exception:
            pass
    try:
        matrix = TfidfVectorizer(stop_words="english", ngram_range=(1, 2)).fit_transform([a, b])
        return float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0] * 100)
    except ValueError:
        return 0.0

def section_relevance(resume: str, job: str, keywords: list[str]) -> float:
    lines = [x.strip() for x in resume.splitlines() if x.strip()]
    chosen = " ".join(l for l in lines if any(k in l.lower() for k in keywords))
    if not chosen:
        return min(semantic_similarity(resume, job) * 0.55, 100)
    return semantic_similarity(chosen, job)

def analyze(resume_text: str, job_text: str, required: list[str], preferred: list[str]) -> dict:
    resume_skills = set(extract_skills(resume_text))
    target = list(dict.fromkeys(required + preferred))
    matched = [s for s in target if s in resume_skills]
    missing = [s for s in required if s not in resume_skills]
    skill_score = (sum(1 for s in required if s in resume_skills) / len(required) * 100) if required else (len(matched) / len(target) * 100 if target else 0)
    preferred_score = (sum(1 for s in preferred if s in resume_skills) / len(preferred) * 100) if preferred else 100.0
    semantic = semantic_similarity(resume_text, job_text)
    project = section_relevance(resume_text, job_text, ["project", "built", "developed", "implemented"])
    experience = section_relevance(resume_text, job_text, ["experience", "intern", "worked", "employment"])
    overall = semantic*WEIGHTS["semantic"] + skill_score*WEIGHTS["skills"] + project*WEIGHTS["projects"] + experience*WEIGHTS["experience"]
    strengths = matched[:5]
    suggestions = [f"Add verified evidence of {s} if you genuinely have this skill." for s in missing[:5]]
    if semantic < 55:
        suggestions.append("Use job-relevant wording in existing project and experience bullets where it is factually accurate.")
    return {
        "overall_score": round(overall, 1), "semantic_score": round(semantic, 1), "skill_score": round(skill_score, 1),
        "preferred_skill_score": round(preferred_score, 1), "project_score": round(project, 1), "experience_score": round(experience, 1),
        "matched_skills": matched, "missing_skills": missing, "resume_skills": sorted(resume_skills),
        "strengths": strengths, "suggestions": suggestions,
        "explanation": {"weights": WEIGHTS, "note": "This is an explainable relevance score, not a hiring probability."}
    }
