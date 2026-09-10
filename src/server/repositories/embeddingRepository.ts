import { SkillEmbeddingRecord, IEmbeddingProvider } from "@/types/skills";

// Configurable feature flag: false (default), "shadow", or "true"
export function getSemanticMatchingMode(): "disabled" | "shadow" | "active" {
  const envVal = process.env.SEMANTIC_SKILL_MATCHING?.toLowerCase();
  if (envVal === "shadow") return "shadow";
  if (envVal === "true" || envVal === "1") return "active";
  return "disabled";
}

// Deterministic mock/fallback embedding provider for unit tests & offline mode
export class DeterministicEmbeddingProvider implements IEmbeddingProvider {
  async embedText(text: string): Promise<number[]> {
    const vector: number[] = new Array(64).fill(0);
    const clean = text.toLowerCase().trim();
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      const idx = (code * (i + 1)) % 64;
      vector[idx] += (code % 10) / 10;
    }
    // L2 normalize
    const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((v) => v / mag);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }
}

let inMemoryEmbeddings: SkillEmbeddingRecord[] = [];

export const embeddingRepository = {
  provider: new DeterministicEmbeddingProvider() as IEmbeddingProvider,

  async upsertEmbedding(skillId: string, embedding: number[], model = "text-embedding-3-small"): Promise<SkillEmbeddingRecord> {
    const existingIndex = inMemoryEmbeddings.findIndex((e) => e.skillId === skillId);
    const record: SkillEmbeddingRecord = {
      id: `emb-${skillId}`,
      skillId,
      embedding,
      model,
      modelVersion: "v1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      inMemoryEmbeddings[existingIndex] = record;
    } else {
      inMemoryEmbeddings.push(record);
    }
    return record;
  },

  async findNearestSkills(queryVector: number[], topK = 5): Promise<Array<{ skillId: string; similarity: number }>> {
    // Cosine similarity
    const results = inMemoryEmbeddings.map((emb) => {
      let dot = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < Math.min(queryVector.length, emb.embedding.length); i++) {
        dot += queryVector[i] * emb.embedding[i];
        normA += queryVector[i] * queryVector[i];
        normB += emb.embedding[i] * emb.embedding[i];
      }
      const similarity = normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
      return { skillId: emb.skillId, similarity };
    });

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  },

  async deleteEmbedding(skillId: string): Promise<boolean> {
    const initLen = inMemoryEmbeddings.length;
    inMemoryEmbeddings = inMemoryEmbeddings.filter((e) => e.skillId !== skillId);
    return inMemoryEmbeddings.length < initLen;
  },
};
