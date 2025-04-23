import type { FlashcardCandidate } from "./types";
import { FlashcardItem } from "./FlashcardItem";
import { FlashcardEditModal } from "./FlashcardEditModal";

interface FlashcardsListProps {
  flashcards: FlashcardCandidate[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (card: FlashcardCandidate | null) => void;
  onEditComplete: (id: string, front: string, back: string) => void;
  editingCard: FlashcardCandidate | null;
}

export function FlashcardsList({
  flashcards,
  onAccept,
  onReject,
  onEdit,
  onEditComplete,
  editingCard,
}: FlashcardsListProps) {
  const acceptedCount = flashcards.filter((card) => card.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Generated Flashcards ({acceptedCount}/{flashcards.length} accepted)
        </h2>
      </div>

      <div className="space-y-4">
        {flashcards.map((card) => (
          <FlashcardItem
            key={card.id}
            flashcard={card}
            onAccept={() => onAccept(card.id)}
            onReject={() => onReject(card.id)}
            onEdit={() => onEdit(card)}
          />
        ))}
      </div>

      {editingCard && (
        <FlashcardEditModal
          flashcard={editingCard}
          onClose={() => onEdit(null)}
          onSave={(front: string, back: string) => onEditComplete(editingCard.id, front, back)}
        />
      )}
    </div>
  );
}
