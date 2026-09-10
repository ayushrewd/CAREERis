import { describe, expect, it } from "vitest";
import { generateFreshDeclaredSkillQuestions } from "@/server/services/candidate/freshQuizGenerator";

const declaredSkills = [
  "Artificial Intelligence", "Deep Learning", "Machine Learning", "Generative AI", "AI Agents",
  "Agentic AI", "Multi-Agent Systems", "Large Language Models (LLMs)", "Natural Language Processing (NLP)",
  "Computer Vision", "Reinforcement Learning", "Unsupervised Learning", "Supervised Learning", "Prompt Engineering",
  "Retrieval-Augmented Generation (RAG)", "Transfer Learning", "Fine-Tuning", "Model Evaluation", "AI Safety",
  "Responsible AI", "NumPy", "Python", "Pandas",
];

describe("fresh declared-skill assessment", () => {
  it("covers every declared skill exactly once and changes on a new attempt", () => {
    const first = generateFreshDeclaredSkillQuestions(declaredSkills);
    const second = generateFreshDeclaredSkillQuestions(declaredSkills, first.map((question) => question.prompt));

    expect(first).toHaveLength(declaredSkills.length);
    expect(new Set(first.map((question) => question.skill))).toEqual(new Set(declaredSkills));
    expect(first.every((question) => question.options.length === 4 && question.correctIndex >= 0 && question.correctIndex < 4)).toBe(true);
    expect(second).toHaveLength(declaredSkills.length);
    expect(second.map((question) => question.prompt)).not.toEqual(first.map((question) => question.prompt));
    expect(second.some((question, index) => question.options.join("|") !== first[index].options.join("|"))).toBe(true);
  });
});
