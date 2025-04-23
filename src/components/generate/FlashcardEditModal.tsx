import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { FlashcardCandidate } from "./types";

interface FlashcardEditModalProps {
  flashcard: FlashcardCandidate;
  onClose: () => void;
  onSave: (front: string, back: string) => void;
}

export function FlashcardEditModal({ flashcard, onClose, onSave }: FlashcardEditModalProps) {
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (front.length > 200 || back.length > 500) {
      setError(
        `Content exceeds maximum length: ${
          front.length > 200 ? "Front side (max 200 characters)" : "Back side (max 500 characters)"
        }`
      );
      return;
    }

    if (front.trim() === "" || back.trim() === "") {
      setError("Both front and back content are required");
      return;
    }

    onSave(front, back);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="front" className="text-sm font-medium">
              Front Side <span className="text-muted-foreground">({front.length}/200)</span>
            </label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter front side content"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="back" className="text-sm font-medium">
              Back Side <span className="text-muted-foreground">({back.length}/500)</span>
            </label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter back side content"
              className="resize-none"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
