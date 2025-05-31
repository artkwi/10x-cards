import { useState } from "react";
import type { FlashcardCandidate } from "../types";

interface UseFlashcardGenerationReturn {
  text: string;
  setText: (text: string) => void;
  characterCount: number;
  isValidLength: boolean;
  isLoading: boolean;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generationResponse: any;
  flashcards: FlashcardCandidate[] | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  handleEdit: (card: FlashcardCandidate) => void;
  handleEditComplete: (id: string, front: string, back: string) => void;
  editingCard: FlashcardCandidate | null;
  resetState: () => void;
}

export function useFlashcardGeneration(): UseFlashcardGenerationReturn {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [generationResponse, setGenerationResponse] = useState<any | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardCandidate[] | null>(null);
  const [editingCard, setEditingCard] = useState<FlashcardCandidate | null>(null);

  const characterCount = text.length;
  const isValidLength = characterCount >= 1000 && characterCount <= 10000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setGenerationResponse(null);
    setFlashcards(null);

    try {
      const command = {
        source_text: text,
      };

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards. Please try again.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await response.json();
      setGenerationResponse(data);

      // Initialize flashcards with pending status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialFlashcards: FlashcardCandidate[] = data.flashcards_proposals.map((proposal: any, index: any) => ({
        ...proposal,
        id: `${data.generation_id}-${index}`,
        status: "pending",
      }));
      setFlashcards(initialFlashcards);

      setText(""); // Clear the input after successful generation
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = (id: string) => {
    setFlashcards((cards) => cards?.map((card) => (card.id === id ? { ...card, status: "accepted" } : card)) ?? null);
  };

  const handleReject = (id: string) => {
    setFlashcards((cards) => cards?.map((card) => (card.id === id ? { ...card, status: "rejected" } : card)) ?? null);
  };

  const handleEdit = (card: FlashcardCandidate) => {
    setEditingCard(card);
  };

  const handleEditComplete = (id: string, front: string, back: string) => {
    setFlashcards(
      (cards) =>
        cards?.map((card) =>
          card.id === id ? { ...card, front, back, status: "accepted", source: "ai-edited" } : card
        ) ?? null
    );
    setEditingCard(null);
  };

  const resetState = () => {
    setText("");
    setError(null);
    setGenerationResponse(null);
    setFlashcards(null);
    setEditingCard(null);
  };

  return {
    text,
    setText,
    characterCount,
    isValidLength,
    isLoading,
    error,
    generationResponse,
    flashcards,
    handleSubmit,
    handleAccept,
    handleReject,
    handleEdit,
    handleEditComplete,
    editingCard,
    resetState,
  };
}
