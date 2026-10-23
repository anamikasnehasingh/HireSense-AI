import re


RESOURCE_LINKS = {
    "Python": "https://docs.python.org/3/tutorial/",
    "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "React": "https://react.dev/learn",
    "FastAPI": "https://fastapi.tiangolo.com/tutorial/",
    "Git": "https://git-scm.com/doc",
    "SQL": "https://www.postgresql.org/docs/",
    "PostgreSQL": "https://www.postgresql.org/docs/",
    "Docker": "https://docs.docker.com/get-started/",
    "Machine Learning": "https://scikit-learn.org/stable/getting_started.html",
    "PyTorch": "https://docs.pytorch.org/tutorials/",
    "Java": "https://dev.java/learn/",
    "C++": "https://cplusplus.com/doc/tutorial/",
}


def rewrite_bullet(bullet: str) -> dict:
    cleaned = re.sub(r"\s+", " ", bullet.strip())

    verbs = [
        "Built",
        "Developed",
        "Implemented",
        "Designed",
        "Created",
        "Analyzed",
        "Automated",
        "Improved",
    ]

    revised = cleaned[0].upper() + cleaned[1:] if cleaned else cleaned

    if revised and not any(revised.startswith(v) for v in verbs):
        revised = "Developed " + revised[0].lower() + revised[1:]

    return {
        "original": bullet,
        "revised": revised,
        "why": (
            "Uses clearer action-oriented wording without inventing "
            "metrics, achievements, or experience."
        ),
    }


def _resource_for(skill: str) -> str | None:
    normalized = skill.strip().lower()

    for name, url in RESOURCE_LINKS.items():
        if name.lower() == normalized:
            return url

    return None


def _priority(index: int) -> str:
    if index < 2:
        return "High"

    if index < 5:
        return "Medium"

    return "Low"


def roadmap_for(skills: list[str]) -> list[dict]:
    roadmap = []

    for index, skill in enumerate(skills[:8]):
        skill = skill.strip()

        if not skill:
            continue

        priority = _priority(index)

        roadmap.append(
            {
                "skill": skill,
                "priority": priority,
                "why": (
                    f"{skill} appears in the selected job requirements "
                    "but was not verified in the submitted resume."
                ),
                "sequence": [
                    f"Learn {skill} fundamentals",
                    f"Practice {skill} with small focused exercises",
                    f"Apply {skill} in a guided mini-project",
                    f"Build one portfolio project demonstrating {skill}",
                ],
                "exercise": (
                    f"Complete 3 practical exercises using {skill} "
                    "and document what you learned."
                ),
                "project": (
                    f"Build a small real-world portfolio project "
                    f"that demonstrates {skill}."
                ),
                "estimated_effort": (
                    "1–3 weeks estimate; depends on prior knowledge."
                ),
                "resource": _resource_for(skill),
                "completed": False,
            }
        )

    return roadmap