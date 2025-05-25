import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, X, Pencil } from "lucide-react";
import type { FlashcardCandidate } from "./types";

interface FlashcardItemProps {
  flashcard: FlashcardCandidate;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
}

export function FlashcardItem({ flashcard, onAccept, onReject, onEdit }: FlashcardItemProps) {
  const isDisabled = flashcard.status !== "pending";

  return (
    <Card
      className={flashcard.status === "rejected" ? "opacity-50" : undefined}
      data-test-id={`flashcard-item-${flashcard.id}`}
    >
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Front</h3>
            <p className="text-sm text-muted-foreground">{flashcard.front}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Back</h3>
            <p className="text-sm text-muted-foreground">{flashcard.back}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {flashcard.status === "accepted" ? (
          <span className="text-sm text-muted-foreground">Accepted</span>
        ) : flashcard.status === "rejected" ? (
          <span className="text-sm text-muted-foreground">Rejected</span>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              data-test-id={`edit-flashcard-${flashcard.id}`}
              disabled={isDisabled}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onReject}
              data-test-id={`reject-flashcard-${flashcard.id}`}
              disabled={isDisabled}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onAccept}
              data-test-id={`accept-flashcard-${flashcard.id}`}
              disabled={isDisabled}
            >
              <Check className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
