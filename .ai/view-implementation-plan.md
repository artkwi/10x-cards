# API Endpoint Implementation Plan: POST /generations

## 1. Przegląd punktu końcowego

Endpoint służy do inicjacji procesu generowania propozycji fiszek przez AI. Użytkownik przesyła tekst źródłowy (`source_text`) o długości od 1000 do 10000 znaków, a system, wykorzystując zewnętrzny serwis AI, generuje propozycje fiszek, które następnie są zapisywane w bazie danych.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **URL:** /generations
- **Parametry:**
  - Brak dodatkowych parametrów w URL lub query.
- **Body żądania (JSON):**
  ```json
  {
    "source_text": "User provided text (1000 to 10000 characters)"
  }
  ```
  - **Wymagany:** `source_text` (string, długość między 1000 a 10000 znaków)
  - **Opcjonalne:** brak

## 3. Szczegóły odpowiedzi

- **Status sukcesu:** 201 (Created)
- **Struktura odpowiedzi (JSON):**
  ```json
  {
    "generation_id": number,
    "flashcards_proposals": [
      { "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }
    ],
    "generated_count": number
  }
  ```

**Wykorzystywane typy:**

- `CreateGenerationCommand`: Obiekt zawierający pole `source_text`.
- `GenerationResponseDTO`: Zawiera `generation_id`, listę `flashcards_proposals` oraz `generated_count`.
- `FlashcardProposalDTO`: Obejmuje pola `front`, `back` oraz `source` (wartość "ai-full").

## 4. Przepływ danych

1. Odbiór żądania i weryfikacja uwierzytelnienia użytkownika (poprzez token Supabase i middleware).
2. Walidacja danych wejściowych przy użyciu zod schema (sprawdzenie długości `source_text`).
3. Przekazanie zweryfikowanego `source_text` do serwisu AI w warstwie serwisowej.
4. W przypadku sukcesu:
   - Utworzenie rekordu w tabeli `generations` z odpowiednimi metadanymi (np. `user_id`, `model`, `generated_count` itd.).
   - Zwrócenie odpowiedzi zawierającej `generation_id`, propozycje fiszek oraz liczbę wygenerowanych fiszek.
5. W przypadku błędu:
   - Rejestracja szczegółów błędu w tabeli `generation_error_logs`.
   - Zwrot odpowiedzi z kodem 500.

## 5. Względy bezpieczeństwa

- Uwierzytelnienie użytkownika przy użyciu Supabase oraz middleware.
- Dokładna walidacja danych wejściowych, aby zapobiec atakom (np. injection).
- Użycie zapytań parametryzowanych w interakcjach z bazą danych.
- Ograniczenie ujawniania szczegółów błędów w odpowiedziach, aby nie eksponować informacji wewnętrznych.

## 6. Obsługa błędów

- **400 Bad Request:** Gdy `source_text` nie spełnia wymagań walidacyjnych (np. nieodpowiednia długość).
- **401 Unauthorized:** Gdy użytkownik nie jest uwierzytelniony lub token jest nieważny.
- **500 Internal Server Error:** W przypadku awarii serwisu AI lub błędów podczas zapisu do bazy danych.
  - Błędy należy rejestrować w tabeli `generation_error_logs` z pełnymi danymi diagnostycznymi.

## 7. Wydajność

- Timeout dla wywołania AI - maksymalnie 60 sekund oczekiwania, inaczej błąd timeout.
- Monitorowanie czasu odpowiedzi przy wywołaniach do bazy danych i integracji z serwisem AI.

## 8. Kroki implementacji

1. **Walidacja wejścia:**
   - Utworzenie oraz integracja zod schema dla `source_text`.
2. **Implementacja endpointu:**
   - Utworzenie kontrolera dla POST /generations z obsługą uwierzytelnienia.
   - Integracja z warstwą serwisową odpowiedzialną za komunikację z serwisem AI oraz zapis do bazy danych.
3. **Obsługa błędów:**
   - Implementacja mechanizmu przechwytywania błędów i rejestracji ich w tabeli `generation_error_logs`.
   - Opracowanie czytelnych komunikatów błędów dla użytkownika.
