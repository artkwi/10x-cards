import type { FlashcardProposalDTO, FlashcardSource } from "@/types";

export type FlashcardStatus = "pending" | "accepted" | "rejected";

export interface FlashcardCandidate {
  id: string;
  front: string;
  back: string;
  source: FlashcardSource;
  status: FlashcardStatus;
}
