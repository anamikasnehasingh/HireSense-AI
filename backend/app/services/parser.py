import io, json, re
import fitz
from docx import Document
from .skills import extract_skills

def extract_text(filename: str, content: bytes) -> str:
    name = filename.lower()
    if name.endswith(".pdf"):
        try:
            doc = fitz.open(stream=content, filetype="pdf")
            text = "\n".join(page.get_text("text") for page in doc)
        except Exception as exc:
            raise ValueError("Invalid, encrypted, or malformed PDF") from exc
    elif name.endswith(".docx"):
        try:
            doc = Document(io.BytesIO(content))
            text = "\n".join(p.text for p in doc.paragraphs)
        except Exception as exc:
            raise ValueError("Invalid or malformed DOCX") from exc
    else:
        raise ValueError("Only PDF and DOCX files are supported")
    if not text.strip():
        raise ValueError("No readable text found. Scanned files may need OCR.")
    return text.strip()

def structured_resume(text: str) -> dict:
    urls = re.findall(r"https?://[^\s)]+", text)
    emails = re.findall(r"[\w.+-]+@[\w.-]+\.\w+", text)
    phone = re.findall(r"(?:\+?\d[\d\s-]{8,}\d)", text)
    headings = ["education", "experience", "internship", "projects", "skills", "certifications"]
    detected = [h.title() for h in headings if re.search(rf"\b{h}\b", text, re.I)]
    return {"skills": extract_skills(text), "links": urls[:10], "emails": emails[:3], "phones": phone[:3], "detected_sections": detected}
