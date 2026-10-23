import json

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models import User, Resume, Job, MatchAnalysis
from app.schemas.common import (
    RegisterIn,
    LoginIn,
    TokenOut,
    JobIn,
    MatchIn,
    BulletRewriteIn,
    RoadmapIn,
)
from app.api.deps import current_user
from app.services.parser import extract_text, structured_resume
from app.services.skills import split_job_skills
from app.services.matcher import analyze
from app.services.assistant import rewrite_bullet, roadmap_for

router = APIRouter()


# =========================================================
# HELPERS
# =========================================================

def csv_list(value: str) -> list[str]:
    return [x for x in value.split("|") if x]


def owned(db, model, object_id, user_id):
    obj = (
        db.query(model)
        .filter(
            model.id == object_id,
            model.user_id == user_id,
        )
        .first()
    )

    if not obj:
        raise HTTPException(404, "Resource not found")

    return obj


# =========================================================
# AUTH
# =========================================================

@router.post("/auth/register", response_model=TokenOut)
def register(
    data: RegisterIn,
    db: Session = Depends(get_db),
):
    if db.query(User).filter(
        User.email == data.email.lower()
    ).first():
        raise HTTPException(
            409,
            "Email already registered",
        )

    user = User(
        email=data.email.lower(),
        full_name=data.full_name,
        password_hash=hash_password(data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_access_token(str(user.id))
    }


@router.post("/auth/login", response_model=TokenOut)
def login(
    data: LoginIn,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.email == data.email.lower()
    ).first()

    if not user or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            401,
            "Invalid email or password",
        )

    return {
        "access_token": create_access_token(str(user.id))
    }


@router.get("/auth/me")
def me(
    user: User = Depends(current_user),
):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


# =========================================================
# RESUMES
# =========================================================

@router.post("/resumes/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    content = await file.read()

    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(
            413,
            f"Maximum upload size is {settings.max_upload_mb} MB",
        )

    try:
        text = extract_text(
            file.filename or "resume",
            content,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))

    structured = structured_resume(text)

    resume = Resume(
        user_id=user.id,
        filename=file.filename or "resume",
        text=text,
        skills_csv="|".join(structured["skills"]),
        structured_json=json.dumps(structured),
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "skills": structured["skills"],
        "structured": structured,
    }


@router.get("/resumes")
def resumes(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.id.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "filename": r.filename,
            "skills": csv_list(r.skills_csv),
            "created_at": r.created_at,
        }
        for r in rows
    ]


@router.get("/resumes/{resume_id}")
def resume_detail(
    resume_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    r = owned(
        db,
        Resume,
        resume_id,
        user.id,
    )

    return {
        "id": r.id,
        "filename": r.filename,
        "text": r.text,
        "skills": csv_list(r.skills_csv),
        "structured": json.loads(r.structured_json),
    }


@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    r = owned(
        db,
        Resume,
        resume_id,
        user.id,
    )

    db.delete(r)
    db.commit()

    return {
        "deleted": True
    }


# =========================================================
# JOBS
# =========================================================

@router.post("/jobs")
def create_job(
    data: JobIn,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    req, pref = split_job_skills(data.description)

    j = Job(
        user_id=user.id,
        **data.model_dump(),
        required_skills_csv="|".join(req),
        preferred_skills_csv="|".join(pref),
    )

    db.add(j)
    db.commit()
    db.refresh(j)

    return {
        "id": j.id,
        "required_skills": req,
        "preferred_skills": pref,
    }


@router.get("/jobs")
def jobs(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Job)
        .filter(Job.user_id == user.id)
        .order_by(Job.id.desc())
        .all()
    )

    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "required_skills": csv_list(j.required_skills_csv),
        }
        for j in rows
    ]


@router.get("/jobs/{job_id}")
def job_detail(
    job_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    j = owned(
        db,
        Job,
        job_id,
        user.id,
    )

    return {
        "id": j.id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "url": j.url,
        "description": j.description,
        "required_skills": csv_list(j.required_skills_csv),
        "preferred_skills": csv_list(j.preferred_skills_csv),
    }


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    j = owned(
        db,
        Job,
        job_id,
        user.id,
    )

    db.delete(j)
    db.commit()

    return {
        "deleted": True
    }


# =========================================================
# MATCH ANALYSIS
# =========================================================

@router.post("/matches/analyze")
def match(
    data: MatchIn,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    r = owned(
        db,
        Resume,
        data.resume_id,
        user.id,
    )

    j = owned(
        db,
        Job,
        data.job_id,
        user.id,
    )

    result = analyze(
        r.text,
        j.description,
        csv_list(j.required_skills_csv),
        csv_list(j.preferred_skills_csv),
    )

    m = MatchAnalysis(
        user_id=user.id,
        resume_id=r.id,
        job_id=j.id,
        overall_score=result["overall_score"],
        semantic_score=result["semantic_score"],
        skill_score=result["skill_score"],
        project_score=result["project_score"],
        experience_score=result["experience_score"],
        matched_skills_csv="|".join(
            result["matched_skills"]
        ),
        missing_skills_csv="|".join(
            result["missing_skills"]
        ),
        explanation_json=json.dumps(result),

        # New roadmap storage
        roadmap_json="[]",
    )

    db.add(m)
    db.commit()
    db.refresh(m)

    return {
        "id": m.id,
        **result,
    }


@router.get("/matches")
def matches(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(MatchAnalysis)
        .filter(MatchAnalysis.user_id == user.id)
        .order_by(MatchAnalysis.id.desc())
        .all()
    )

    return [
        {
            "id": m.id,
            "resume_id": m.resume_id,
            "job_id": m.job_id,
            "overall_score": m.overall_score,
            "matched_skills": csv_list(
                m.matched_skills_csv
            ),
            "missing_skills": csv_list(
                m.missing_skills_csv
            ),
            "created_at": m.created_at,
        }
        for m in rows
    ]


@router.get("/matches/{match_id}")
def match_detail(
    match_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    m = owned(
        db,
        MatchAnalysis,
        match_id,
        user.id,
    )

    result = json.loads(m.explanation_json)

    # Include saved roadmap with match details
    try:
        roadmap = json.loads(m.roadmap_json or "[]")
    except (TypeError, json.JSONDecodeError):
        roadmap = []

    result["roadmap"] = roadmap

    return {
        "id": m.id,
        **result,
    }


# =========================================================
# AI
# =========================================================

@router.post("/ai/rewrite-bullet")
def bullet(
    data: BulletRewriteIn,
    user: User = Depends(current_user),
):
    return rewrite_bullet(data.bullet)


@router.post("/ai/resume-feedback")
def resume_feedback(
    data: MatchIn,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    r = owned(
        db,
        Resume,
        data.resume_id,
        user.id,
    )

    j = owned(
        db,
        Job,
        data.job_id,
        user.id,
    )

    result = analyze(
        r.text,
        j.description,
        csv_list(j.required_skills_csv),
        csv_list(j.preferred_skills_csv),
    )

    return {
        "strengths": result["strengths"],
        "suggestions": result["suggestions"],
        "grounding": (
            "Suggestions are based only on submitted "
            "resume/job text."
        ),
    }


# =========================================================
# LEARNING ROADMAP
# =========================================================

@router.post("/ai/learning-roadmap")
def learning_roadmap(
    data: RoadmapIn,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    m = owned(
        db,
        MatchAnalysis,
        data.match_id,
        user.id,
    )

    # -----------------------------------------------------
    # If roadmap already exists, return the saved roadmap.
    # This prevents regeneration and losing completion state.
    # -----------------------------------------------------
    try:
        saved_items = json.loads(
            m.roadmap_json or "[]"
        )
    except (TypeError, json.JSONDecodeError):
        saved_items = []

    if saved_items:
        return {
            "match_id": m.id,
            "items": saved_items,
        }

    # -----------------------------------------------------
    # Generate roadmap for the first time
    # -----------------------------------------------------
    items = roadmap_for(
        csv_list(m.missing_skills_csv)
    )

    # Make sure every roadmap item has completed state
    for item in items:
        item["completed"] = False

    # Save roadmap to database
    m.roadmap_json = json.dumps(items)

    db.commit()
    db.refresh(m)

    return {
        "match_id": m.id,
        "items": items,
    }


@router.put("/ai/learning-roadmap/{match_id}")
def update_learning_roadmap(
    match_id: int,
    items: list[dict],
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    m = owned(
        db,
        MatchAnalysis,
        match_id,
        user.id,
    )

    # Validate that roadmap is a list
    if not isinstance(items, list):
        raise HTTPException(
            400,
            "Roadmap items must be a list",
        )

    # Make sure completed is always boolean
    for item in items:
        item["completed"] = bool(
            item.get("completed", False)
        )

    m.roadmap_json = json.dumps(items)

    db.commit()
    db.refresh(m)

    return {
        "match_id": m.id,
        "items": items,
    }


# =========================================================
# ACCOUNT
# =========================================================

@router.delete("/account")
def delete_account(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    db.delete(user)
    db.commit()

    return {
        "deleted": True
    }