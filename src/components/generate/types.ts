export type FlashcardStatus = "pending" | "accepted" | "rejected";

export interface FlashcardCandidate {
  id: string;
  front: string;
  back: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  status: FlashcardStatus;
}
