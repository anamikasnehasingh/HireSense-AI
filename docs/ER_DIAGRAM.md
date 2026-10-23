# ER Diagram

```mermaid
erDiagram
  USERS ||--o{ RESUMES : owns
  USERS ||--o{ JOBS : owns
  USERS ||--o{ MATCH_ANALYSES : owns
  RESUMES ||--o{ MATCH_ANALYSES : analyzed_in
  JOBS ||--o{ MATCH_ANALYSES : analyzed_against

  USERS { int id PK string email string full_name string password_hash datetime created_at }
  RESUMES { int id PK int user_id FK string filename text text text skills_csv text structured_json }
  JOBS { int id PK int user_id FK string title string company text description text required_skills_csv text preferred_skills_csv }
  MATCH_ANALYSES { int id PK int user_id FK int resume_id FK int job_id FK float overall_score float semantic_score float skill_score text explanation_json }
```

The MVP keeps several extracted collections serialized for simplicity. A production expansion can normalize `resume_sections`, `extracted_skills`, `job_requirements`, `skill_gaps`, `roadmap_progress`, and `resume_suggestions` as specified in the master brief.
