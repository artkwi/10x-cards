# Specyfikacja architektury modułu rejestracji, logowania i odzyskiwania hasła

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Struktura stron i layoutów

- **Strony Astro (`/src/pages`)**:

  - `/login.astro` – strona logowania
  - `/register.astro` – strona rejestracji
  - `/reset-password.astro` – strona inicjacji resetu hasła
  - `/reset-password/[token].astro` – strona ustawienia nowego hasła po kliknięciu w link z maila
  - `/` (lub `/dashboard.astro`) – główny widok aplikacji po zalogowaniu
  - `/settings.astro` – ustawienia konta (z opcją usunięcia konta)

- **Layouty (`/src/layouts`)**:
  - `AuthLayout.astro` – minimalistyczny layout dla stron auth (login, rejestracja, reset hasła)
  - `AppLayout.astro` – layout dla zalogowanych użytkowników (nawigacja, sidebar, itp.)

### 1.2. Komponenty React (`/src/components`)

- `LoginForm.tsx` – formularz logowania (email, hasło, przycisk Google, obsługa błędów)
- `RegisterForm.tsx` – formularz rejestracji (email, hasło, powtórz hasło, obsługa błędów)
- `ResetPasswordForm.tsx` – formularz do podania emaila do resetu hasła
- `SetNewPasswordForm.tsx` – formularz ustawienia nowego hasła (hasło, powtórz hasło)
- `GoogleAuthButton.tsx` – przycisk logowania przez Google (integracja z Supabase Auth)
- `LogoutButton.tsx` – przycisk wylogowania
- `DeleteAccountButton.tsx` – przycisk usunięcia konta (z potwierdzeniem)
- Komponenty UI z Shadcn/ui (`/src/components/ui`) do budowy pól, przycisków, komunikatów

### 1.3. Podział odpowiedzialności

- **Strony Astro** odpowiadają za routing, SSR, layout oraz przekazywanie propsów do komponentów React.
- **Komponenty React** realizują całą logikę formularzy, walidację, obsługę zdarzeń, komunikację z Supabase Auth przez client SDK oraz wyświetlanie komunikatów.
- **Nawigacja**: Po udanej akcji (login, rejestracja, reset) komponenty wywołują przekierowania (np. przez `window.location` lub router Reacta, jeśli używany).

### 1.4. Walidacja i komunikaty błędów

- Walidacja po stronie klienta (format email, długość hasła, zgodność haseł, wymagane pola)
- Walidacja po stronie backendu (Supabase Auth)
- Komunikaty błędów:
  - Niepoprawny email/hasło
  - Email już zarejestrowany
  - Hasła nie są zgodne
  - Zbyt słabe hasło
  - Błąd sieci/serwera
  - Brak konta o podanym emailu (reset hasła)
  - Token resetu hasła nieprawidłowy lub wygasł
- Komunikaty sukcesu:
  - Rejestracja zakończona sukcesem
  - Email z linkiem resetu wysłany
  - Hasło zmienione pomyślnie

### 1.5. Scenariusze obsługiwane

- Rejestracja nowego użytkownika (email/hasło)
- Logowanie użytkownika (email/hasło)
- Logowanie/rejestracja przez Google
- Resetowanie hasła (wysyłka maila, ustawienie nowego hasła)
- Wylogowanie
- Usunięcie konta
- Obsługa sesji (utrzymanie zalogowania)

## 2. LOGIKA BACKENDOWA

### 2.1. Endpointy API (`/src/pages/api`)

- `/api/auth/delete-account.ts` – endpoint do usuwania konta (autoryzacja przez Supabase JWT)
- Pozostałe operacje (rejestracja, logowanie, reset hasła) obsługiwane bezpośrednio przez Supabase Auth SDK po stronie klienta

### 2.2. Modele danych

- Użytkownicy i sesje zarządzane przez Supabase Auth (brak własnych modeli userów w bazie)

### 2.3. Walidacja danych wejściowych

- Po stronie klienta: walidacja formatów, długości, zgodności haseł
- Po stronie backendu: walidacja przez Supabase (np. unikalność emaila, siła hasła)
- Dla endpointów własnych (np. usuwanie konta): walidacja JWT, autoryzacja, potwierdzenie akcji

### 2.4. Obsługa wyjątków

- Zwracanie czytelnych komunikatów błędów do klienta (np. przez statusy HTTP i JSON)
- Logowanie błędów po stronie backendu (np. do konsoli lub systemu monitoringu)
- Obsługa typowych błędów Supabase (np. user not found, invalid credentials, expired token)

### 2.5. Renderowanie server-side

- Strony auth (login, register, reset) renderowane SSR przez Astro, bez danych usera
- Strony aplikacji (dashboard, settings) renderowane SSR tylko jeśli user jest zalogowany (sprawdzanie sesji po stronie serwera, przekierowanie na login jeśli brak sesji)
- Middleware (`/src/middleware/index.ts`) do ochrony tras wymagających autoryzacji

## 3. SYSTEM AUTENTYKACJI

### 3.1. Supabase Auth

- Wykorzystanie Supabase Auth do:
  - Rejestracji użytkownika (email/hasło)
  - Logowania użytkownika (email/hasło)
  - Logowania/rejestracji przez Google (OAuth)
  - Resetowania hasła (wysyłka maila, obsługa linku z tokenem)
  - Utrzymania sesji (tokeny JWT, cookies)
  - Wylogowania
  - Usuwania konta (przez API lub panel Supabase)

### 3.2. Integracja z Astro

- Po stronie klienta: użycie Supabase JS SDK do obsługi auth w komponentach React
- Po stronie serwera: weryfikacja sesji przez Supabase JWT (np. w middleware lub API)
- Przechowywanie sesji w cookies (httpOnly, secure)
- Przekierowania na login przy braku sesji

### 3.3. Bezpieczeństwo

- Wszystkie operacje auth przez HTTPS
- Brak przechowywania haseł po stronie klienta
- Ochrona endpointów API przez weryfikację JWT
- Ograniczenie liczby prób logowania (rate limiting – do rozważenia na poziomie Supabase lub reverse proxy)

---

## Kluczowe komponenty i kontrakty

- **Strony Astro**: `/login.astro`, `/register.astro`, `/reset-password.astro`, `/reset-password/[token].astro`, `/settings.astro`, `/dashboard.astro`
- **Layouty**: `AuthLayout.astro`, `AppLayout.astro`
- **Komponenty React**: `LoginForm.tsx`, `RegisterForm.tsx`, `ResetPasswordForm.tsx`, `SetNewPasswordForm.tsx`, `GoogleAuthButton.tsx`, `LogoutButton.tsx`, `DeleteAccountButton.tsx`
- **API**: `/api/auth/delete-account.ts`
- **Middleware**: `/src/middleware/index.ts` (ochrona tras)
- **Supabase**: konfiguracja klienta, integracja z auth, obsługa sesji

---

Ta specyfikacja zapewnia pełną zgodność z wymaganiami PRD (US-001, US-002, US-003, US-004) oraz stackiem technologicznym, nie naruszając istniejącej architektury aplikacji.
