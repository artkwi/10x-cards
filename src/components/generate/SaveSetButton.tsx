import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CreateFlashcardsDTO, CreateFlashcardCommand } from "@/types";
import type { FlashcardCandidate } from "./types";

interface SaveSetButtonProps {
  flashcards: FlashcardCandidate[];
  generationId: number;
  onSaveComplete?: () => void;
}

export function SaveSetButton({ flashcards, generationId, onSaveComplete }: SaveSetButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedFlashcards = flashcards.filter((card) => card.status === "accepted");
  const hasAcceptedCards = acceptedFlashcards.length > 0;

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const flashcardsToSave: CreateFlashcardCommand[] = acceptedFlashcards.map((card) => ({
        front: card.front,
        back: card.back,
        source: card.source,
        generation_id: generationId,
      }));

      const command: CreateFlashcardsDTO = {
        flashcards: flashcardsToSave,
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error("Failed to save flashcards. Please try again.");
      }

      onSaveComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAcceptedCards) {
    return null;
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleSave} disabled={isLoading} className="w-full" variant="default" size="lg">
        {isLoading
          ? "Saving..."
          : `Save ${acceptedFlashcards.length} Flashcard${acceptedFlashcards.length === 1 ? "" : "s"}`}
      </Button>
    </div>
  );
}
