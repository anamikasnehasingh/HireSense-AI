import re

TAXONOMY = {
    "Python": ["python"], "Java": ["java"], "C++": ["c++", "cpp"], "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"], "React": ["react", "react.js", "reactjs"], "FastAPI": ["fastapi"],
    "Django": ["django"], "Flask": ["flask"], "Node.js": ["node.js", "nodejs", "node js"],
    "SQL": ["sql"], "PostgreSQL": ["postgresql", "postgres", "psql"], "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo db"], "RESTful API": ["rest api", "restful api", "restful services"],
    "Git": ["git"], "GitHub": ["github"], "Docker": ["docker"], "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"], "Machine Learning": ["machine learning", "ml"], "NLP": ["nlp", "natural language processing"],
    "Pandas": ["pandas"], "NumPy": ["numpy"], "Scikit-learn": ["scikit-learn", "sklearn"],
    "PyTorch framework": ["pytorch"], "TensorFlow": ["tensorflow"], "HTML": ["html", "html5"],
    "CSS": ["css", "css3"], "Tailwind CSS": ["tailwind", "tailwind css"], "Data Structures": ["data structures", "dsa"],
    "OOP": ["oop", "object oriented programming", "object-oriented programming"], "Linux": ["linux"],
    "Communication": ["communication"], "Problem Solving": ["problem solving", "problem-solving"],
}

def extract_skills(text: str) -> list[str]:
    lower = text.lower()
    found = []
    for canonical, synonyms in TAXONOMY.items():
        for synonym in synonyms:
            pattern = r"(?<![\w.+#-])" + re.escape(synonym.lower()) + r"(?![\w.+#-])"
            if re.search(pattern, lower):
                found.append(canonical)
                break
    return sorted(set(found))

def split_job_skills(description: str) -> tuple[list[str], list[str]]:
    lines = description.splitlines()
    preferred_text = "\n".join(l for l in lines if any(k in l.lower() for k in ["preferred", "nice to have", "bonus"]))
    all_skills = extract_skills(description)
    preferred = extract_skills(preferred_text)
    required = [s for s in all_skills if s not in preferred]
    return required, preferred
