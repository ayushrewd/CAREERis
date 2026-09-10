import { CareerTimelineEvent } from "@/types/careerJourney";
import { CANONICAL_TIMELINE_EVENTS } from "@/data/canonicalCareerTimelineData";

let inMemoryTimeline: CareerTimelineEvent[] = JSON.parse(JSON.stringify(CANONICAL_TIMELINE_EVENTS));

export const careerTimelineRepository = {
  async findByCandidateId(candidateId: string): Promise<CareerTimelineEvent[]> {
    return inMemoryTimeline
      .filter((e) => e.candidateId === candidateId)
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  },

  async addEvent(event: Omit<CareerTimelineEvent, "id">): Promise<CareerTimelineEvent> {
    const newEvent: CareerTimelineEvent = {
      ...event,
      id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryTimeline.unshift(newEvent);
    return newEvent;
  },

  async create(event: Omit<CareerTimelineEvent, "id">): Promise<CareerTimelineEvent> {
    return this.addEvent(event);
  },
};
