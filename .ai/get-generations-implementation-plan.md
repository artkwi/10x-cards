# API Endpoint Implementation Plan: GET /generations and GET /generations/{id}

## 1. Przegląd punktu końcowego

Implementacja dwóch endpointów REST API do pobierania informacji o generacjach fiszek:

- GET `/generations` - lista generacji z paginacją
- GET `/generations/{id}` - szczegóły pojedynczej generacji wraz z powiązanymi fiszkami

## 2. Szczegóły żądania

### GET /generations

- Metoda HTTP: GET
- Struktura URL: `/generations`
- Parametry query:
  - Opcjonalne:
    - `page` (number, default: 1)
    - `limit` (number, default: 10)

### GET /generations/{id}

- Metoda HTTP: GET
- Struktura URL: `/generations/{id}`
- Parametry path:
  - Wymagane:
    - `id` (number) - identyfikator generacji

## 3. Wykorzystywane typy

```typescript
// Z types.ts
type GenerationDetailDto = Generation & {
  flashcards?: FlashcardDto[];
};

interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

// Z database.types.ts
type Generation = Database["public"]["Tables"]["generations"]["Row"];
```

## 4. Szczegóły odpowiedzi

### GET /generations

```typescript
interface GenerationsListResponse {
  data: GenerationDetailDto[];
  pagination: PaginationDto;
}
```

- Status: 200 OK
- Content-Type: application/json

### GET /generations/{id}

```typescript
type GenerationDetailResponse = GenerationDetailDto;
```

- Status: 200 OK
- Content-Type: application/json

## 5. Przepływ danych

1. Weryfikacja autoryzacji użytkownika przez Supabase
2. Dla GET /generations:

   - Walidacja parametrów paginacji
   - Pobranie listy generacji z bazy danych z uwzględnieniem RLS
   - Pobranie powiązanych fiszek dla każdej generacji
   - Przygotowanie odpowiedzi z paginacją

3. Dla GET /generations/{id}:
   - Walidacja ID generacji
   - Pobranie szczegółów generacji z bazy danych z uwzględnieniem RLS
   - Pobranie powiązanych fiszek
   - Przygotowanie odpowiedzi

## 6. Względy bezpieczeństwa

1. Autoryzacja:

   - Wykorzystanie Supabase Auth do weryfikacji tokenu
   - Sprawdzenie czy użytkownik ma dostęp do żądanych zasobów

2. Walidacja danych:

   - Sanityzacja parametru ID
   - Walidacja parametrów paginacji
   - Sprawdzenie limitów paginacji

3. Row Level Security:
   - Wykorzystanie wbudowanych polityk RLS w Supabase
   - Zapewnienie izolacji danych między użytkownikami

## 7. Obsługa błędów

1. 400 Bad Request:

   - Nieprawidłowy format ID
   - Nieprawidłowe parametry paginacji

2. 401 Unauthorized:

   - Brak tokenu autoryzacyjnego
   - Nieprawidłowy token

3. 404 Not Found:

   - Generacja o podanym ID nie istnieje
   - Użytkownik nie ma dostępu do generacji

4. 500 Internal Server Error:
   - Błędy bazy danych
   - Nieoczekiwane błędy serwera

## 8. Rozważania dotyczące wydajności

1. Optymalizacja zapytań:

   - Wykorzystanie indeksów w bazie danych
   - Efektywne zapytania JOIN dla pobierania fiszek

2. Paginacja:

   - Implementacja limitów na rozmiar strony
   - Efektywne liczenie całkowitej liczby rekordów

3. Cachowanie:
   - Rozważenie implementacji cache dla często używanych generacji
   - Cache nagłówków odpowiedzi

## 9. Etapy wdrożenia

1. Przygotowanie struktury:

   - Utworzenie pliku `src/pages/api/generations/index.ts` dla listy
   - Utworzenie pliku `src/pages/api/generations/[id].ts` dla pojedynczej generacji
   - Utworzenie serwisu `src/lib/services/generation.service.ts`

2. Implementacja serwisu:

   - Metody do pobierania listy generacji z paginacją
   - Metoda do pobierania pojedynczej generacji
   - Logika transformacji danych

3. Implementacja endpointów:

   - Obsługa parametrów żądania
   - Walidacja danych wejściowych
   - Integracja z serwisem
   - Obsługa błędów

4. Dokumentacja:
   - Aktualizacja dokumentacji API
   - Dodanie przykładów użycia
   - Dokumentacja obsługi błędów
