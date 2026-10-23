export type Resume={id:number;filename:string;skills:string[]}
export type Job={id:number;title:string;company:string;location:string;required_skills:string[]}
export type Match={id:number;overall_score:number;semantic_score:number;skill_score:number;preferred_skill_score:number;project_score:number;experience_score:number;matched_skills:string[];missing_skills:string[];strengths:string[];suggestions:string[]}
