# HireSense AI — Intelligent Resume Analyzer & Job Matching Platform

A full-stack CSE project MVP using **React + TypeScript + Tailwind + FastAPI + SQLAlchemy + NLP/ML**. It performs real resume parsing and explainable resume-to-job matching instead of returning hardcoded scores.

## Implemented now
- JWT registration/login and protected frontend routes
- PDF + DOCX resume upload, validation, text parsing
- structured resume metadata + normalized skill extraction
- job-description creation and skill extraction
- hybrid matching engine
  - semantic similarity
  - required skill coverage
  - project relevance
  - experience relevance
- matched vs missing/unverified skills
- score explanations and Recharts dashboard
- match history
- grounded resume feedback
- action-oriented bullet rewrite fallback
- personalized learning-roadmap generation from skill gaps
- ownership checks and account deletion
- SQLite quick-start + PostgreSQL/pgvector Docker setup
- pytest tests for normalization and score range
- Dockerfiles and Docker Compose

## Important current limitations
- `all-MiniLM-L6-v2` is supported behind `USE_SENTENCE_TRANSFORMERS=true`. The default is `false` so the project runs without downloading a model; it uses TF-IDF cosine similarity as a deterministic fallback.
- Full LLM API integration is intentionally not hardcoded. The current assistant is grounded/rule-based and does not invent metrics or qualifications.
- The advanced recruiter workspace, OCR fallback, persistent roadmap checkboxes, Alembic migrations, batch resume upload, pgvector embeddings, and 200–500-pair evaluation dataset are **phase-2 features**, not falsely claimed as complete.

## Folder structure
```text
HireSense-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes + auth dependencies
│   │   ├── core/         # config, DB, JWT/security
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic request models
│   │   ├── services/     # parser, skills, matching, assistant
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/
│   ├── src/types/
│   └── Dockerfile
├── docs/
└── docker-compose.yml
```

## Run locally — easiest development mode
### 1) Backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```
Open API docs: `http://localhost:8000/docs`

### 2) Frontend
In a second terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Open: `http://localhost:5173`

## Docker option
```bash
docker compose up --build
```
Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`  
Swagger: `http://localhost:8000/docs`

## How to test the app
1. Register a user.
2. Upload a text-based PDF/DOCX resume.
3. Open **Jobs**, paste a real/synthetic job description (30+ chars), and save it.
4. Select your uploaded resume and click **Analyze Match**.
5. Inspect component scores, matched skills, missing/unverified skills, and recommendations.
6. Click **Generate Learning Roadmap**.
7. Open **History** to revisit saved analyses.

## Run tests
```bash
cd backend
pytest -q
```

## Matching formula
```text
Overall = 0.40 × semantic
        + 0.35 × required-skill coverage
        + 0.15 × project relevance
        + 0.10 × experience relevance
```
Each component is normalized to 0–100. The score is a **relevance score, not a hiring probability**.

## Phase-2 roadmap (8 weeks)
- Week 1: schema hardening, Alembic, datasets
- Week 2: section parser + OCR fallback
- Week 3: richer taxonomy + MiniLM embeddings + pgvector
- Week 4: labeled evaluation/tuning + evidence linking
- Week 5: structured external/local LLM provider
- Week 6: roadmap persistence + settings + export
- Week 7: security/rate limiting/full integration tests
- Week 8: deployment, SRS, evaluation report, demo/presentation

## Team split
- Member 1: parsing + skill extraction
- Member 2: embeddings + matching + evaluation
- Member 3: FastAPI + DB + auth/security
- Member 4: React UI + integration + deployment/testing

## Academic/demo note
Do not present synthetic jobs as live vacancies and do not describe the matching score as a hiring probability. A “missing skill” means evidence was not found in the uploaded resume.
