# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

- Aplikacja dzieli się na dwa główne obszary:
  - Ekrany autoryzacyjne (rejestracja, logowanie, reset hasła)
  - Główne widoki aplikacji (dashboard, generowanie fiszek przez AI, lista fiszek, sesja powtórkowa, panel użytkownika)
- Interfejs korzysta z komponentów shadcn/ui i Tailwind CSS dla zapewnienia responsywności, dostępności (WCAG AA) oraz spójności wizualnej.

## 2. Lista widoków

1. **Widok Autoryzacyjny**

   - **Ścieżka widoku:** `/login`, `/register`, `/reset-password`
   - **Główny cel:** Umożliwienie użytkownikom logowania, rejestracji oraz resetowania hasła.
   - **Kluczowe informacje:** Formularze z polami na e-mail, hasło (i potwierdzenie), komunikaty błędów, linki do przejścia między formularzami.
   - **Kluczowe komponenty:** Formularze, przyciski, validatory, komunikaty błędów.
   - **UX/Dostępność:** Walidacja inline, czytelne komunikaty, wsparcie nawigacji klawiaturowej.
   - **Bezpieczeństwo:** Bezpieczne przesyłanie danych, ochrona przed atakami, mechanizmy autoryzacji.

2. **Dashboard**

   - **Ścieżka widoku:** `/dashboard`
   - **Główny cel:** Prezentacja podsumowania aktywności użytkownika i dostęp do głównych funkcjonalności.
   - **Kluczowe informacje:** Statystyki użytkownika.
   - **Kluczowe komponenty:** Karty statystyk
   - **UX/Dostępność:** Responsywny i intuicyjny layout, wysoki kontrast oraz przystępna struktura informacji.
   - **Bezpieczeństwo:** Dostęp tylko dla zalogowanych użytkowników, ochrona danych konta.

3. **Widok Generowania Fiszek przez AI**

   - **Ścieżka widoku:** `/generate`
   - **Główny cel:** Umożliwienie użytkownikowi wklejenia tekstu (1000-10000 znaków) do analizy i generowania propozycji fiszek.
   - **Kluczowe informacje:** Pole tekstowe z licznikem znaków, komunikaty o błędach (za krótki lub zbyt długi tekst), wskaźnik postępu.
   - **Kluczowe komponenty:** Formularz tekstowy, progress indicator, lista kandydatów na fiszki z przyciskami: Akceptuj, Edytuj, Odrzuć.
   - **UX/Dostępność:** Przejrzysty interfejs formularza, intuicyjna walidacja, dostępność dla czytników ekranowych.
   - **Bezpieczeństwo:** Walidacja danych wejściowych, ochrona przed próbami przekroczenia limitów.

4. **Widok Listy Fiszek**

   - **Ścieżka widoku:** `/flashcards`
   - **Główny cel:** Prezentacja zapisanych fiszek z możliwością edycji i usuwania.
   - **Kluczowe informacje:** Lista fiszek (Przód i Tył), paginacja, filtry wyszukiwania.
   - **Kluczowe komponenty:** Lista elementów, przyciski edycji i usuwania, modal do edycji z przyciskami "Zapisz" i "Anuluj".
   - **UX/Dostępność:** Intuicyjny i responsywny interfejs, wsparcie klawiatury, zrozumiałe komunikaty.
   - **Bezpieczeństwo:** Mechanizmy potwierdzania usunięcia, walidacja edycji danych.

5. **Widok Edycji Fiszki (Modal)**

   - **Ścieżka widoku:** Modal wyświetlany na widoku Listy Fiszek
   - **Główny cel:** Umożliwienie edycji wybranej fiszki z zachowaniem limitów znaków (Przód: 200, Tył: 500).
   - **Kluczowe informacje:** Obecna treść fiszki, pola tekstowe do edycji, komunikaty błędów.
   - **Kluczowe komponenty:** Modal, formularz edycji, przyciski potwierdzenia i anulowania.
   - **UX/Dostępność:** Łatwy dostęp poprzez klawiaturę, czytelna walidacja, intuicyjny design modala.
   - **Bezpieczeństwo:** Walidacja danych, zabezpieczenie przed przekroczeniem limitów.

6. **Panel Użytkownika**

   - **Ścieżka widoku:** `/profile` lub `/settings`
   - **Główny cel:** Zarządzanie kontem i ustawieniami.
   - **Kluczowe informacje:** Dane użytkownika, opcje zmiany danych, wylogowanie.
   - **Kluczowe komponenty:** Formularze, karty informacyjne, przyciski akcji.
   - **UX/Dostępność:** Przejrzysty układ, responsywny design, wsparcie dla asystentów mowy.
   - **Bezpieczeństwo:** Ochrona danych osobowych, autoryzacja zmian.

7. **Widok Sesji Powtórkowej**
   - **Ścieżka widoku:** `/review`
   - **Główny cel:** Przeprowadzenie sesji nauki z wykorzystaniem algorytmu powtórek.
   - **Kluczowe informacje:** Prezentacja fiszek (Przód), odsłanianie Tyłu, ocena wiedzy (np. przyciski "Wiem" i "Nie wiem").
   - **Kluczowe komponenty:** Karty fiszek, przyciski oceny, nawigacja między fiszkami.
   - **UX/Dostępność:** Intuicyjny interfejs sesji, duże i czytelne przyciski, wsparcie urządzeń mobilnych.
   - **Bezpieczeństwo:** Zachowanie stanu sesji, ochrona wyników użytkownika.

## 3. Mapa podróży użytkownika

- Użytkownik rozpoczyna przy ekranie autoryzacyjnym, gdzie loguje się lub rejestruje.
- Po autoryzacji trafia do Dashboardu, gdzie widzi podsumowanie aktywności oraz dostęp do głównych funkcji aplikacji.
- Z Dashboardu użytkownik wybiera opcję generowania fiszek przez AI, przechodząc do widoku `/generate`.
  - W widoku Generowania użytkownik wkleja tekst, system waliduje długość, a następnie wyświetla wskaźnik postępu.
  - Po przetworzeniu tekstu pojawia się lista kandydatów na fiszki z opcjami: Akceptuj, Edytuj (otwierający modal) oraz Odrzuć.
- Po zatwierdzeniu wybranych kandydatów, użytkownik trafia do widoku `/flashcards`, gdzie może przeglądać, edytować lub usuwać fiszki.
- Użytkownik może rozpocząć sesję powtórkową w widoku `/review`, gdzie system prezentuje fiszki zgodnie z algorytmem powtórek.
- W każdej chwili użytkownik ma dostęp do Panelu Użytkownika (`/profile` lub `/settings`), aby zarządzać kontem i przeglądać statystyki.
- Nawigacja umożliwia łatwe przechodzenie między widokami oraz powrót do Dashboardu.

## 4. Układ i struktura nawigacji

- Główna nawigacja jako górne manu (dostępna po zalogowaniu) obejmuje: Dashboard, Generowanie fiszek, Lista fiszek, Sesja powtórkowa oraz Panel Użytkownika.
- Nawigacja jest zlokalizowana w pasku bocznym lub na górze strony, z uwzględnieniem zasad mobile-first oraz responsywności (Tailwind utility variants np. md, lg).
- Widoki autoryzacyjne mają uproszczony layout bez pełnego menu nawigacyjnego.
- Nawigacja zawiera wyraźne etykiety, ikony i wizualne wskazanie aktywnego widoku, co ułatwia poruszanie się po aplikacji.

## 5. Kluczowe komponenty

- **Formularze autoryzacyjne:** Logowanie, rejestracja, reset hasła z walidacją inline i czytelnymi komunikatami błędów.
- **Komponent formularza generowania fiszek:** Pole tekstowe z licznikiem znaków, wskaźnik postępu, komunikaty o błędach.
- **Lista fiszek z paginacją:** Tabela lub lista z opcjami edycji, usuwania oraz filtrowania/wyszukiwania.
- **Modal edycji fiszki:** Interfejs do modyfikacji treści fiszki z walidacją limitów znaków.
- **Komponent nawigacji:** Pasek boczny lub top bar z intuicyjnymi ikonami i etykietami.
- **Karty statystyk:** Prezentacja podsumowania aktywności i metryk użytkownika.
- **System zarządzania stanem:** Centralne zarządzanie danymi (np. Context API) zapewniające synchronizację z backendem poprzez plan API.
