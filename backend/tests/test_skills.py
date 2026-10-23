from app.services.skills import extract_skills
from app.services.matcher import analyze

def test_skill_normalization():
    skills = extract_skills("Built REST API with JS, React and PostgreSQL")
    assert "JavaScript" in skills and "RESTful API" in skills and "PostgreSQL" in skills

def test_match_score_range():
    r = analyze("Python React SQL project", "Need Python React SQL", ["Python", "React", "SQL"], [])
    assert 0 <= r["overall_score"] <= 100
    assert r["missing_skills"] == []
