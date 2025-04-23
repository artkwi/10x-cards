# Plan implementacji widoku Przegląd i zatwierdzanie propozycji fiszek

## 1. Przegląd

Widok umożliwia użytkownikowi przeglądanie wygenerowanych propozycji fiszek po wykonaniu zapytania AI oraz wybór tych, które chce zaakceptować do finalnego zapisu. Użytkownik może również edytować lub odrzucić poszczególne propozycje przed ostatecznym zapisaniem zestawu do bazy danych.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/generate`.

## 3. Struktura komponentów

Widok zostanie podzielony na następujące główne komponenty:

- Formularz generowania fiszek
- Lista propozycji fiszek
  - Pojedynczy element listy (propozycja fiszki)
  - Modal edycji fiszki
- Przycisk zapisu zatwierdzonych fiszek do bazy

Diagram drzewa komponentów:

```
GenerateView
├── GenerationForm
├── FlashcardsList
│    └── FlashcardItem (x N)
│          ├── Akceptuj, Edytuj, Odrzuć (przyciski)
├── FlashcardEditModal
└── SaveSetButton
```

## 4. Szczegóły komponentów

### 4.1. GenerationForm

- Opis: Formularz umożliwiający wklejenie tekstu do generowania fiszek.
- Główne elementy:
  - Pole tekstowe (textarea) z licznikiem znaków
  - Komunikat o błędzie przy niepoprawnej długości (mniej niż 1000 lub więcej niż 10000 znaków)
  - Przycisk "Generuj fiszki"
- Obsługiwane interakcje:
  - Aktualizacja stanu tekstu
  - Walidacja długości tekstu
  - Wywołanie API po kliknięciu przycisku
- Walidacja:
  - Min. 1000 znaków, max. 10000 znaków (przycinanie nadmiaru i informowanie użytkownika)
- Typy: Wykorzystuje typy dla generacji, np. `CreateGenerationCommand` i `GenerationResponseDTO`.
- Propsy: Callback do obsługi wyniku generacji.

### 4.2. FlashcardsList

- Opis: Komponent prezentujący listę wygenerowanych propozycji fiszek.
- Główne elementy:
  - Renderowanie listy elementów
  - Wyróżnienie zaakceptowanych propozycji
- Obsługiwane interakcje:
  - Kliknięcie przycisków "Akceptuj", "Edytuj" oraz "Odrzuć" na elemencie listy
- Walidacja:
  - Potwierdzenie, że dane fiszki mieszczą się w limitach (front ≤ 200 znaków, back ≤ 500 znaków)
- Typy: Wykorzystuje typ `FlashcardProposalDTO` oraz dodatkowy ViewModel np. `FlashcardCandidate` z informacją o stanie (np. pending, accepted, edited, rejected).
- Propsy: Lista fiszek, funkcje zmiany stanu danego elementu.

### 4.3. FlashcardItem

- Opis: Pojedynczy element listy prezentujący propozycję fiszki.
- Główne elementy:
  - Wyświetlenie treści "przód" i "tył" fiszki
  - Przyciski: "Akceptuj", "Edytuj", "Odrzuć"
- Obsługiwane interakcje:
  - Zmiana stanu fiszki przy kliknięciach przycisków
  - Otwarcie modala po kliknięciu "Edytuj"
- Walidacja:
  - Sprawdzenie długości pól przy edycji
- Typy: Wykorzystuje `FlashcardCandidate`.

### 4.4. FlashcardEditModal

- Opis: Modal umożliwiający edycję treści fiszki.
- Główne elementy:
  - Formularz edycji z polami "przód" i "tył"
  - Limity znaków (front max 200, back max 500)
  - Przycisk zatwierdzenia zmian
- Obsługiwane interakcje:
  - Aktualizacja wartości w formularzu
  - Zamknięcie modala i aktualizacja stanu fiszki po zatwierdzeniu
- Walidacja:
  - Walidacja limitów znaków
- Typy: Może korzystać z niestandardowego ViewModelu do edycji fiszki.
- Propsy: Aktualne dane fiszki, callback do zatwierdzania edycji.

### 4.5. SaveSetButton

- Opis: Przycisk umożliwiający zapis zatwierdzonych fiszek do bazy.
- Główne elementy:
  - Przycisk wywołujący endpoint POST `/flashcards`
- Obsługiwane interakcje:
  - Wywołanie API wysyłającego zatwierdzone fiszki
- Walidacja:
  - Sprawdzenie obecności przynajmniej jednej zatwierdzonej fiszki przed wysłaniem
- Typy: Korzysta z `CreateFlashcardCommand` i `CreateFlashcardsDTO`.
- Propsy: Lista zatwierdzonych fiszek, funkcja wywołania API.

## 5. Typy

- `CreateGenerationCommand`:
  - source_text: string (1000-10000 znaków)
- `GenerationResponseDTO`:
  - generation_id: number
  - flashcards_proposals: FlashcardProposalDTO[]
  - generated_count: number
- `FlashcardProposalDTO`:
  - front: string
  - back: string
  - source: "ai-full"
- `FlashcardCandidate` (widokowy model):
  - id: string (lokalne ID, np. UUID)
  - front: string
  - back: string
  - source: "ai-full" | "ai-edited"
  - accepted: boolean
  - edited: boolean

## 6. Zarządzanie stanem

- Użycie `useState` do zarządzania:
  - Tekstem wejściowym dla generacji
  - Stanem walidacji tekstu (błędy dotyczące długości)
  - Stanem ładowania i postępem wywołania API
  - Listą propozycji fiszek (tablica `FlashcardCandidate`)
  - Stanem modala edycji (aktualnie edytowana propozycja i stan widoczności)
  - Globalnym stanem zatwierdzonych propozycji (filtracja elementów o statusie "accepted" lub "edited")
- Możliwe wdrożenie custom hooka np. `useFlashcardGeneration` do zarządzania logiką generowania i modyfikowania propozycji.

## 7. Integracja API

- Endpoint POST `/generations`
  - Żądanie: { source_text: string }
  - Odpowiedź: `GenerationResponseDTO` zawierający generation_id, listę propozycji oraz generated_count.
- Endpoint POST `/flashcards`
  - Żądanie: { flashcards: CreateFlashcardCommand[] }
  - Odpowiedź: Zapisane fiszki z bazy, z walidacjami (front ≤ 200, back ≤ 500, prawidłowe source i generation_id).
- Walidacja: Przed wysłaniem żądania, dane są weryfikowane lokalnie zgodnie z limitami i typami.

## 8. Interakcje użytkownika

- Użytkownik wpisuje tekst w formularzu generacji, widzi dynamiczny licznik znaków.
- Po kliknięciu "Generuj fiszki" wyświetlany jest wskaźnik postępu.
- Po otrzymaniu odpowiedzi z API, pod formularzem pojawia się lista propozycji fiszek.
- Dla każdej propozycji dostępne są akcje:
  - "Akceptuj": Zmiana statusu fiszki na zaakceptowaną.
  - "Edytuj": Otwarcie modala umożliwiającego modyfikację treści.
  - "Odrzuć": Usunięcie fiszki z listy propozycji.
- Po zatwierdzeniu, użytkownik klika przycisk "Zapisz zestaw", co wywołuje zapis zatwierdzonych danych przez API.

## 9. Warunki i walidacja

- Tekst wejściowy:
  - Minimalnie 1000 znaków, maksymalnie 10000 znaków (nadmiar może być przycinany z komunikatem).
- Fiszki:
  - Front: max 200 znaków
  - Back: max 500 znaków
- Przycisk generowania: aktywny tylko gdy walidacja wejścia jest pozytywna.
- Przycisk zapisu zestawu: aktywny tylko jeśli istnieje przynajmniej jedna zatwierdzona propozycja.
- Walidacja odbywa się lokalnie oraz przy wysyłaniu danych do API.

## 10. Obsługa błędów

- Walidacja tekstu w polu wejściowym: wyświetlanie komunikatów o błędach pod polem tekstowym.
- Błędy API (zarówno przy generowaniu, jak i zapisywaniu fiszek) skutkują wyświetleniem komunikatu błędu umożliwiającego ponowienie akcji.
- Podczas edycji, niepoprawne dane (przekroczenie limitu znaków) powodują natychmiastowe wyświetlenie błędu.
- Całość interfejsu zapewnia dostępność komunikatów błędów (np. dla czytników ekranu).

## 11. Kroki implementacji

1. Utworzyć nową stronę widoku pod ścieżką `/generate`.
2. Stworzyć komponent `GenerationForm` z polem tekstowym, licznikiem znaków, walidacją oraz przyciskiem "Generuj fiszki".
3. Zaimplementować wywołanie API POST `/generations` wraz z obsługą stanu ładowania i błędów.
4. Utworzyć komponent `FlashcardsList` do renderowania listy elementów `FlashcardItem`.
5. W komponencie `FlashcardItem` dodać przyciski "Akceptuj", "Edytuj", "Odrzuć" oraz logikę zmiany stanu poszczególnej propozycji.
6. Zaimplementować modal `FlashcardEditModal` umożliwiający edycję treści fiszek z walidacją limitów znaków.
7. Stworzyć komponent `SaveSetButton`, który wywołuje endpoint POST `/flashcards` z zatwierdzonymi danymi.
8. Zarządzać stanem widoku (tekst wejściowy, lista propozycji, stan modala) przy użyciu React hooks, opcjonalnie wdrożyć custom hook np. `useFlashcardGeneration`.
9. Dodać obsługę błędów zarówno dla walidacji lokalnej, jak i odpowiedzi API.
10. Przetestować kompletne przepływy: generowanie, przeglądanie, edycja, odrzucenie oraz zapis zestawu fiszek, dbając o zgodność z wymaganiami PRD oraz wytycznymi dostępu.
