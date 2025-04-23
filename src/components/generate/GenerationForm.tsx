import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FlashcardsList } from "./FlashcardsList";
import { SaveSetButton } from "./SaveSetButton";
import { useFlashcardGeneration } from "./hooks/useFlashcardGeneration";

export function GenerationForm() {
  const {
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
  } = useFlashcardGeneration();

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here (minimum 1000 characters, maximum 10000 characters)"
            className="min-h-[200px]"
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Characters: {characterCount}</span>
            {!isValidLength && (
              <span className="text-destructive">
                {characterCount < 1000
                  ? `${1000 - characterCount} more characters needed`
                  : `${characterCount - 10000} characters over limit`}
              </span>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={!isValidLength || isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </form>

      {flashcards && generationResponse && (
        <>
          <FlashcardsList
            flashcards={flashcards}
            onAccept={handleAccept}
            onReject={handleReject}
            onEdit={handleEdit}
            onEditComplete={handleEditComplete}
            editingCard={editingCard}
          />
          <SaveSetButton
            flashcards={flashcards}
            generationId={generationResponse.generation_id}
            onSaveComplete={resetState}
          />
        </>
      )}
    </div>
  );
}
