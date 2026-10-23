# API Contract

Base URL: `http://localhost:8000/api/v1`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Resumes
- `POST /resumes/upload` multipart field `file`
- `GET /resumes`
- `GET /resumes/{id}`
- `DELETE /resumes/{id}`

## Jobs
- `POST /jobs`
- `GET /jobs`
- `GET /jobs/{id}`
- `DELETE /jobs/{id}`

## Matching
- `POST /matches/analyze` body `{resume_id, job_id}`
- `GET /matches`
- `GET /matches/{id}`

## AI / learning
- `POST /ai/resume-feedback`
- `POST /ai/rewrite-bullet`
- `POST /ai/learning-roadmap`

## Account
- `DELETE /account`

FastAPI interactive docs: `/docs`.
