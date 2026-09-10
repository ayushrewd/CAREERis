// ==============================================================================
// CAREERIS OFFER REPOSITORY
// Formal Job Offers & Placement Generation
// ==============================================================================

import { OfferRecordDetail, OfferStatus } from "@/types/employerIntelligence";

let inMemoryOffers: OfferRecordDetail[] = [
  {
    id: "off-tm-amit-01",
    applicationId: "app-amit-tm-01",
    requisitionId: "req-tm-bms-01",
    candidateId: "cand-amit-03",
    candidateName: "Amit Verma",
    employerId: "comp-tata-motors",
    employerName: "Tata Motors EV Division",
    roleTitle: "Battery Management System (BMS) Calibration Specialist",
    annualCompensationINR: 1150000,
    joiningDate: "2026-04-15",
    workLocation: "Chakan EV Mega Plant, Pune",
    employmentType: "FULL_TIME",
    status: "SENT",
    offerLetterUrl: "/offers/tm_off_amit.pdf",
    createdAt: "2026-03-03T10:00:00Z",
    updatedAt: "2026-03-03T10:00:00Z",
  },
];

export const offerRepository = {
  async findAll(params?: {
    employerId?: string;
    candidateId?: string;
    requisitionId?: string;
    status?: OfferStatus;
  }): Promise<OfferRecordDetail[]> {
    let list = [...inMemoryOffers];
    if (params?.employerId) {
      list = list.filter((o) => o.employerId.toLowerCase() === params.employerId!.toLowerCase());
    }
    if (params?.candidateId) {
      list = list.filter((o) => o.candidateId.toLowerCase() === params.candidateId!.toLowerCase());
    }
    if (params?.requisitionId) {
      list = list.filter((o) => o.requisitionId.toLowerCase() === params.requisitionId!.toLowerCase());
    }
    if (params?.status) {
      list = list.filter((o) => o.status === params.status);
    }
    return list;
  },

  async findById(id: string): Promise<OfferRecordDetail | null> {
    const found = inMemoryOffers.find((o) => o.id === id);
    return found || null;
  },

  async create(data: Omit<OfferRecordDetail, "id" | "createdAt" | "updatedAt">): Promise<OfferRecordDetail> {
    const newOffer: OfferRecordDetail = {
      ...data,
      id: `off-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryOffers.unshift(newOffer);
    return newOffer;
  },

  async updateStatus(
    id: string,
    status: OfferStatus,
    responseDetails?: { rejectionReason?: string; candidateResponseAt?: string }
  ): Promise<OfferRecordDetail | null> {
    const item = inMemoryOffers.find((o) => o.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (responseDetails?.candidateResponseAt) item.candidateResponseAt = responseDetails.candidateResponseAt;
    if (responseDetails?.rejectionReason) item.rejectionReason = responseDetails.rejectionReason;
    return item;
  },
};
