from pydantic import BaseModel, EmailStr, Field

class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=6, max_length=72)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class JobIn(BaseModel):
    title: str
    company: str = ""
    location: str = ""
    url: str = ""
    description: str = Field(min_length=30)

class MatchIn(BaseModel):
    resume_id: int
    job_id: int

class BulletRewriteIn(BaseModel):
    bullet: str = Field(min_length=3, max_length=1000)

class RoadmapIn(BaseModel):
    match_id: int
