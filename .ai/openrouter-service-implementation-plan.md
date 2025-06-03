# OpenRouter Service Implementation Plan

## 1. Opis usługi

OpenRouter to usługa umożliwiająca integrację z API OpenRouter w celu wzbogacenia czatów opartych na LLM. Usługa przetwarza komunikaty systemowe i użytkownika, buduje dynamiczne zapytania, waliduje odpowiedzi oraz zarządza parametrami wywołania modelu. Dzięki standaryzowanemu schematowi odpowiedzi (response_format) zapewnia spójność i bezpieczeństwo komunikacji między frontendem a API.

### Kluczowe komponenty usługi

1. **Payload Builder**

   - Funkcjonalność: Łączy komunikat systemowy, komunikat użytkownika oraz ustrukturyzowany response_format w jeden obiekt zapytania.
   - Wyzwania:
     1. Walidacja kompletności i poprawności danych wejściowych.
     2. Dynamiczne łączenie dodatkowych parametrów.
   - Rozwiązania:
     1. Użycie bibliotek walidacyjnych i testów jednostkowych.
     2. Stosowanie podejścia modularnego przy budowie payloadu.

2. **API Client**

   - Funkcjonalność: Odpowiada za wysyłkę zapytań do OpenRouter API i odbieranie odpowiedzi.
   - Wyzwania:
     1. Błędy komunikacji (timeout, awarie sieciowe).
     2. Zarządzanie retry logic w przypadku niepowodzeń.
   - Rozwiązania:
     1. Implementacja retry logic z wykładniczym opóźnieniem.
     2. Monitorowanie i logowanie błędów komunikacyjnych.

3. **Response Parser & Validator**

   - Funkcjonalność: Waliduje i parsuje odpowiedź API, sprawdzając zgodność ze zdefiniowanym JSON schema.
   - Wyzwania:
     1. Niezgodność schematu odpowiedzi.
     2. Błędy parsowania danych.
   - Rozwiązania:
     1. Użycie dedykowanej biblioteki do walidacji JSON schema.
     2. Implementacja mechanizmów fallback i logowania błędów.

4. **Model Parameter Manager**

   - Funkcjonalność: Zarządza konfiguracją parametrów modelu, takimi jak nazwa modelu, temperatura, max_tokens itp.
   - Wyzwania:
     1. Aktualizacja parametrów w trakcie działania usługi.
     2. Spójność pomiędzy stanem a wysyłanymi zapytaniami.
   - Rozwiązania:
     1. Stosowanie mechanizmów immutability i walidacji podczas aktualizacji.
     2. Centralizacja zarządzania konfiguracją parametrów.

5. **Error Handler**
   - Funkcjonalność: Centralizuje obsługę błędów, loguje incydenty oraz zarządza retry logic w razie awarii.
   - Wyzwania:
     1. Rozpoznanie różnych rodzajów błędów (sieciowych, autoryzacyjnych, walidacyjnych).
     2. Zapewnienie jednolitego sposobu raportowania błędów.
   - Rozwiązania:
     1. Definicja unifikowanego mechanizmu error handling.
     2. Wdrożenie szczegółowych komunikatów błędów i systemu alertów.

## 2. Opis konstruktora

Konstruktor usługi `OpenRouterService` odpowiada za inicjalizację wszystkich kluczowych komponentów oraz konfigurację początkową. Przyjmuje następujące parametry:

- `apiKey`: Klucz API do autoryzacji połączeń z OpenRouter API.
- `baseUrl`: Bazowy URL endpointu OpenRouter API.
- `defaultSystemMessage`: Domyślny komunikat systemowy (np. "Jesteś pomocnym asystentem AI, którego zadaniem jest wspierać użytkownika w rozwiązywaniu problemów.")
- `defaultUserMessage`: Domyślny komunikat użytkownika (np. "Proszę podaj pomocne informacje dotyczące konfiguracji API.")
- `defaultModel`: Obiekt konfiguracyjny zawierający nazwę modelu i parametry, np. `{ modelName: "google/gemini-2.0-flash-exp:free", modelParameters: { temperature: 0.2, max_tokens: 1500 } }`
- Opcjonalnie, konfigurację timeout oraz retry attempts do obsługi błędów sieciowych.

Podczas konstrukcji inicjalizowane są wewnętrzne komponenty, takie jak builder payload, API client oraz mechanizmy walidacji i logowania błędów.

## 3. Publiczne metody i pola

### Metody publiczne:

1. **buildPayload(systemMessage, userMessage, additionalContext?)**
   - Łączy komunikat systemowy, komunikat użytkownika oraz response_format w jeden spójny obiekt zapytania.
2. **callOpenRouterAPI(payload)**
   - Wysyła wygenerowane zapytanie do endpointu OpenRouter API, obsługuje retry logic oraz zwraca odpowiedź.
3. **parseResponse(apiResponse)**
   - Waliduje i parsuje odpowiedź API przy użyciu zdefiniowanego JSON schema.
4. **setModelParameters(parameters)**
   - Umożliwia dynamiczną aktualizację parametrów modelu, np. temperatury, liczby tokenów oraz nazwy modelu.

### Pola publiczne:

- `apiKey`: Klucz autoryzacyjny do OpenRouter API.
- `baseUrl`: Bazowy URL endpointu API.
- `defaultSystemMessage`: Domyślny komunikat systemowy wysyłany do modelu.
- `defaultUserMessage`: Domyślny komunikat użytkownika.
- `defaultModel`: Obiekt zawierający domyślną nazwę modelu oraz parametry (np. `{ modelName: "google/gemini-2.0-flash-exp:free", modelParameters: { temperature: 0.2, max_tokens: 1500 } }`).

### Przykłady konfiguracji:

- **System message**: "Jesteś pomocnym asystentem AI, którego zadaniem jest wspierać użytkownika w rozwiązywaniu problemów."
- **User message**: "Proszę podaj pomocne informacje dotyczące konfiguracji API."
- **Response format (JSON schema)**:
  ```json
  {
    "type": "json_schema",
    "json_schema": {
      "name": "ChatResponse",
      "strict": true,
      "schema": { "id": "number", "answer": "string" }
    }
  }
  ```
- **Model name**: "google/gemini-2.0-flash-exp:free"
- **Model parameters**: `{ "temperature": 0.2, "max_tokens": 1500 }`

## 4. Prywatne metody i pola

### Metody prywatne:

1. **\_validatePayload(payload)**
   - Walidacja struktury i poprawności danych zapytania przed jego wysłaniem.
2. **\_handleApiErrors(error)**
   - Centralna obsługa błędów, która loguje incydenty oraz inicjuje retry logic.
3. **\_logRequestAndResponse(request, response)**
   - Rejestracja szczegółów zapytań i odpowiedzi dla celów debugowania.
4. **\_formatResponse(response)**
   - Przetwarzanie odpowiedzi z API, aby dopasować ją do ustandaryzowanego formatu opartego na response_format.

### Pola prywatne:

- `_apiEndpoint`: Pełny URL endpointu OpenRouter API.
- `_modelParameters`: Obiekt przechowujący bieżące parametry modelu (np. temperatura, max_tokens).
- Dodatkowe pola pomocnicze do zarządzania stanem sesji, retry logic oraz logowania błędów.

## 5. Obsługa błędów

Potencjalne scenariusze błędów i proponowane rozwiązania:

1. **Błąd komunikacji (timeout, awaria sieci)**
   - Rozwiązanie: Implementacja retry logic z wykładniczym opóźnieniem, timeout oraz logowanie błędów.
2. **Błąd autoryzacji (nieprawidłowy/wygasły klucz API)**
   - Rozwiązanie: Natychmiastowa weryfikacja odpowiedzi API, wyświetlenie komunikatu błędu i możliwość ponownej autoryzacji.
3. **Niezgodność formatu odpowiedzi (schema mismatch)**
   - Rozwiązanie: Walidacja odpowiedzi przy użyciu JSON schema, fallback na domyślny komunikat błędu oraz szczegółowe logowanie rozbieżności.
4. **Błąd parsowania odpowiedzi**
   - Rozwiązanie: Użycie bloków try-catch, dokładne logowanie oraz powiadomienia dla systemu monitoringu.
5. **Błędne parametry wejściowe**
   - Rozwiązanie: Wstępna walidacja danych wejściowych i natychmiastowe zwracanie komunikatu o nieprawidłowej konfiguracji.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie klucza API w zmiennych środowiskowych lub bezpiecznym magazynie.
2. Walidacja i sanityzacja wszystkich danych wejściowych, aby zapobiec atakom (np. wstrzyknięcia kodu).
3. Użycie protokołu HTTPS dla wszystkich połączeń z API.
4. Implementacja rate limiting oraz mechanizmów ochrony przed atakami brute-force.
5. Regularny monitoring i audyt logów w celu wykrywania podejrzanych działań.

## 7. Plan wdrożenia krok po kroku

1. **Przygotowanie środowiska**:

   - Konfiguracja zmiennych środowiskowych (API Key, baseUrl, itp.).
   - Instalacja zależności zgodnie z naszym tech stackiem (Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui).

2. **Inicjalizacja projektu**:

   - Utworzenie modułu usługi (np. `src/lib/openrouterService.ts`).
   - Zdefiniowanie struktury katalogów zgodnie z zasadami projektu.

3. **Implementacja konstruktora**:

   - Inicjalizacja klucza API, baseUrl, domyślnych komunikatów oraz konfiguracji modelu.
   - Utworzenie instancji wewnętrznych komponentów: payload builder, API client, response parser oraz error handler.

4. **Budowa metody `buildPayload`**:

   - Połączenie komunikatu systemowego, komunikatu użytkownika oraz response_format w jeden obiekt zapytania.
   - Przykład:
     ```json
     {
       "system_message": "Jesteś pomocnym asystentem AI, którego zadaniem jest wspierać użytkownika w rozwiązywaniu problemów.",
       "user_message": "Proszę podaj pomocne informacje dotyczące konfiguracji API.",
       "response_format": {
         "type": "json_schema",
         "json_schema": {
           "name": "ChatResponse",
           "strict": true,
           "schema": { "id": "number", "answer": "string" }
         }
       }
     }
     ```

5. **Implementacja metody `callOpenRouterAPI`**:

   - Wysyłka zapytania do API z użyciem skonfigurowanego endpointu.
   - Wdrożenie retry logic oraz timeout w przypadku błędów komunikacyjnych.

6. **Implementacja metody `parseResponse`**:

   - Walidacja odpowiedzi przy użyciu JSON schema.
   - Transformacja odpowiedzi do ustandaryzowanego formatu.

7. **Dodanie możliwości aktualizacji parametrów modelu (`setModelParameters`)**:

   - Umożliwienie dynamicznej zmiany parametrów takich jak temperatura, max_tokens, nazwa modelu.

8. **Testowanie i walidacja**:

   - Opracowanie zestawu testów jednostkowych dla każdej metody.
   - Symulacja scenariuszy błędów (błąd sieci, błędny format odpowiedzi, problemy z autoryzacją).

9. **Wdrożenie i monitorowanie**:
   - Integracja z pipeline CI/CD (np. Github Actions) w celu automatycznego testowania i wdrażania.
   - Deployment usługi na wybranej platformie (np. DigitalOcean) z konfiguracją systemu logowania i monitorowania.
   - Wdrożenie mechanizmów alertowych na wypadek wystąpienia krytycznych błędów.
