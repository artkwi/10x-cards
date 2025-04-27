# OpenRouter Service Implementation Plan

## 1. Opis usługi

OpenRouter to usługa umożliwiająca integrację z API OpenRouter w celu uzupełnienia czatów opartych na LLM. Usługa przetwarza komunikaty systemowe i użytkownika, formułuje zapytania do API, a następnie waliduje i przetwarza odpowiedzi zgodnie ze zdefiniowanym schematem JSON. Jej celem jest zapewnienie spójnej integracji z interfejsem API i ułatwienie komunikacji między frontendem a modelem LLM.

## 2. Opis konstruktora

Konstruktor serwisu powinien przyjmować następujące parametry:

1. Klucz API do uwierzytelniania zapytań do OpenRouter.
2. Bazowy URL endpointu API.
3. Domyślne ustawienia komunikatów systemowych i użytkownika.
4. Konfigurację domyślnego modelu (nazwa modelu i parametry takie jak temperatura, max_tokens, itd.).
5. Opcjonalnie, ustawienia timeout i liczby prób w przypadku błędów komunikacyjnych.

## 3. Publiczne metody i pola

1. `sendChat(message: string): Promise<ChatResponse>`
   - Wysyła wiadomość użytkownika do API OpenRouter i zwraca ustrukturyzowaną odpowiedź.
2. `updateConfig(config: OpenRouterConfig): void`
   - Aktualizuje konfigurację usługi (np. zmiana modelu lub parametrów wywołania API).
3. Pola takie jak:
   - `apiKey`: Przechowuje klucz API.
   - `baseUrl`: Adres endpointu API.
   - `defaultModel`: Obiekt zawierający domyślną nazwę modelu i parametry wywołania.

## 4. Prywatne metody i pola

1. `buildRequestPayload(userMessage: string): RequestPayload`
   - Odpowiedzialna za zestawienie komunikatu systemowego, komunikatu użytkownika oraz konfiguracji response_format.
2. `parseResponse(apiResponse: any): ChatResponse`
   - Waliduje i przetwarza odpowiedź z API zgodnie z ustalonym schematem JSON.
3. `handleApiError(error: any): void`
   - Centralny mechanizm obsługi błędów, logujący szczegóły i zarządzający retry logic.
4. Pola pomocnicze do przechowywania tymczasowych danych oraz konfiguracji niejawnych opcji (np. liczba prób, timeout itd.).

## 5. Obsługa błędów

1. **Błąd komunikacji sieciowej**
   - Wyzwanie: Problemy z połączeniem, timeout, brak odpowiedzi.
   - Rozwiązanie: Implementacja retry logic oraz timeout, logowanie błędów sieciowych.
2. **Błąd formatu odpowiedzi**
   - Wyzwanie: Odpowiedź niezgodna z oczekiwanym schematem JSON.
   - Rozwiązanie: Walidacja odpowiedzi z użyciem predefiniowanego JSON schema, fallback na komunikat błędu.
3. **Błąd uwierzytelnienia**
   - Wyzwanie: Nieprawidłowy klucz API lub wygasłe uprawnienia.
   - Rozwiązanie: Weryfikacja statusu odpowiedzi, odpowiednie komunikaty błędów i możliwość ponownej autoryzacji.
4. **Błąd konfiguracyjny**
   - Wyzwanie: Brak lub nieprawidłowa konfiguracja komunikatów systemowych czy parametrów modelu.
   - Rozwiązanie: Walidacja konfiguracji podczas inicjalizacji usługi oraz stosowanie wartości domyślnych w przypadku braków.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie klucza API w bezpiecznym miejscu (np. zmienne środowiskowe) i unikanie wklepywania ich w kodzie.
2. Monitorowanie i logowanie nieautoryzowanych prób dostępu oraz błędów.
3. Ograniczenie liczby prób połączenia w celu ochrony przed atakami typu brute-force.

## 7. Plan wdrożenia krok po kroku

1. **Inicjalizacja projektu**

   - Skonfigurowanie środowiska (Astro, TypeScript, React, Tailwind i Shadcn/ui).
   - Dodanie zmiennych środowiskowych dla klucza API oraz adresu endpointu.

2. **Implementacja modułu OpenRouter Service**

   - Utworzenie klasy serwisu w odpowiedniej lokalizacji (np. `./src/lib/openrouterService.ts`).
   - Zaimplementowanie konstruktora z parametrami: `apiKey`, `baseUrl`, domyślnymi komunikatami oraz konfiguracją modelu.

3. **Konfiguracja komunikatów i schematu odpowiedzi**

   - **Komunikat systemowy**: Przykład: "You are a helpful assistant providing detailed and accurate responses."
   - **Komunikat użytkownika**: Pobierany dynamicznie z interfejsu użytkownika.
   - **Response_format**: Przykładowy schemat:
     ```json
     {
       "type": "json_schema",
       "json_schema": { "name": "chat_response", "strict": true, "schema": { "response": "string" } }
     }
     ```
   - **Nazwa modelu**: Przykładowo, "gpt-4" lub inny dostępny model.
   - **Parametry modelu**: Przykład: `{ "temperature": 0.7, "max_tokens": 200, "frequency_penalty": 0.0 }`.

4. **Implementacja metod publicznych i prywatnych**

   - Tworzenie metody `sendChat` do wysyłki zapytań do API.
   - Implementacja metody `buildRequestPayload` łączącej komunikat systemowy, użytkownika oraz response_format w jeden spójny obiekt.
   - Zaimplementowanie metody `parseResponse` walidującej odpowiedź według JSON schema.

5. **Obsługa błędów i logowanie**

   - Dodanie try-catch w kluczowych metodach API.
   - Implementacja mechanizmu retry oraz fallback dla błędów komunikacyjnych i formatowania odpowiedzi.
   - Logowanie błędów przy użyciu centralnego modułu logowania.
