# Dokument wymagań produktu (PRD) - 10x-cards

## 1. Przegląd produktu

10x-cards to aplikacja internetowa (webowa) w wersji MVP (Minimum Viable Product), której celem jest uproszczenie i przyspieszenie procesu tworzenia fiszek edukacyjnych. Aplikacja umożliwia użytkownikom generowanie fiszek za pomocą sztucznej inteligencji na podstawie dostarczonego tekstu, jak również tworzenie ich manualnie. Użytkownicy mogą zarządzać swoimi fiszkami, grupować je w zestawy i wykorzystywać zintegrowany, gotowy algorytm powtórek (spaced repetition) do efektywnej nauki. Podstawowy system kont użytkowników zapewnia przechowywanie danych. Produkt skierowany jest do szerokiej grupy odbiorców poszukujących efektywniejszych metod nauki.

## 2. Problem użytkownika

Głównym problemem, który rozwiązuje aplikacja, jest czasochłonność manualnego tworzenia wysokiej jakości fiszek edukacyjnych. Ten proces często zniechęca potencjalnych użytkowników do korzystania z metody nauki opartej na powtórkach rozłożonych w czasie (spaced repetition), mimo jej udowodnionej skuteczności. Aplikacja ma na celu zminimalizowanie wysiłku potrzebnego do stworzenia materiałów do nauki.

## 3. Wymagania funkcjonalne

Aplikacja w wersji MVP będzie posiadać następujące funkcjonalności:

3.1. Zarządzanie Kontem Użytkownika: - Rejestracja użytkownika za pomocą adresu e-mail i hasła. - Logowanie użytkownika za pomocą adresu e-mail i hasła. - Logowanie użytkownika za pomocą konta Google (przycisk "Zaloguj przez Google"). - Funkcjonalność resetowania zapomnianego hasła. - Możliwość usunięcia konta przez użytkownika. - Dane użytkownika (w tym fiszki i zestawy) są bezpiecznie przechowywane i powiązane z jego kontem.

3.2. Tworzenie i Zarządzanie Zestawami Fiszki: - Użytkownik może tworzyć nowe zestawy fiszek. - Każdy zestaw ma unikalną nazwę nadaną przez użytkownika. - Użytkownik może zmieniać nazwę istniejącego zestawu. - Użytkownik może usuwać zestawy fiszek (co powoduje usunięcie również wszystkich fiszek w tym zestawie). - Lista zestawów użytkownika jest prezentowana z paginacją (maksymalnie 10 zestawów na stronę).

3.3. Generowanie Fiszki przez AI: - Użytkownik może zainicjować proces tworzenia nowego zestawu fiszek poprzez wklejenie tekstu (minimum 1000 znaków, maksimum 10000 znaków). - Tekst krótszy niż 1000 znaków skutkuje komunikatem błędu. - Tekst dłuższy niż 10000 znaków jest automatycznie obcinany do limitu przed przetworzeniem. - System wykorzystuje darmowy model AI (konkretny model do ustalenia) do analizy tekstu i generowania propozycji fiszek (kandydatów). - Proces generowania kandydatów jest synchroniczny (użytkownik oczekuje na wynik w tym samym widoku, powinien być widoczny wskaźnik postępu lub komunikat). - Wygenerowani kandydaci na fiszki (Przód / Tył) są prezentowani użytkownikowi w formie listy. - Użytkownik może przejrzeć każdego kandydata i wykonać jedną z akcji: - Akceptuj: Kandydat staje się fiszką i zostanie dodany do nowego zestawu. - Edytuj: Otwiera modal (okno dialogowe w tym samym widoku) pozwalający na modyfikację treści Przodu i Tyłu kandydata przed akceptacją. Edytowana i zaakceptowana fiszka jest dodawana do nowego zestawu. Limity znaków dla edycji są takie same jak przy tworzeniu manualnym. - Odrzuć: Kandydat jest usuwany z listy i nie zostanie zapisany jako fiszka. - Tylko zaakceptowani (bezpośrednio lub po edycji) kandydaci są zapisywani jako fiszki w nowo utworzonym zestawie. - Jeśli AI nie wygeneruje żadnych kandydatów na podstawie tekstu, użytkownik otrzymuje stosowny komunikat. - Każdy zestaw utworzony w ten sposób jest oznaczany jako "stworzony przez AI" na potrzeby metryk.

3.4. Manualne Tworzenie Fiszki: - Użytkownik może stworzyć pusty zestaw, a następnie manualnie dodawać do niego fiszki. - Formularz dodawania fiszki zawiera dwa pola: "Przód" (maksymalnie 200 znaków) i "Tył" (maksymalnie 500 znaków). - Formatowanie tekstu (pogrubienie, kursywa, listy itp.) nie jest wspierane w polach fiszek w MVP. - System waliduje długość wprowadzanych tekstów. - Każdy zestaw, do którego pierwsza fiszka została dodana manualnie, jest oznaczany jako "stworzony manualnie" na potrzeby metryk.

3.5. Przeglądanie, Edycja i Usuwanie Fiszki: - Użytkownik może przeglądać fiszki wewnątrz wybranego zestawu. - Lista fiszek w zestawie jest prezentowana z paginacją (maksymalnie 20 fiszek na stronę). - Użytkownik może edytować istniejące fiszki (Przód i Tył) z zachowaniem limitów znaków. - Użytkownik może usuwać pojedyncze fiszki z zestawu.

3.6. Wyszukiwanie Fiszki: - Użytkownik ma dostęp do funkcji wyszukiwania fiszek. - Wyszukiwanie obejmuje wszystkie fiszki użytkownika we wszystkich jego zestawach. - Wyszukiwanie odbywa się po treści pól "Przód" i "Tył".

3.7. Integracja z Algorytmem Powtórek: - Aplikacja integruje się z gotowym, zewnętrznym algorytmem powtórek typu open-source (konkretna biblioteka lub implementacja np. SM-2 do ustalenia). - Użytkownik może rozpocząć sesję nauki (powtórek) dla wybranego zestawu fiszek. - Interfejs sesji powtórek pozwala użytkownikowi ocenić swoją znajomość fiszki (szczegóły interakcji do zdefiniowania). - Algorytm zarządza harmonogramem powtórek dla każdej fiszki na podstawie ocen użytkownika.

3.8. Interfejs Użytkownika (UI/UX): - Interfejs użytkownika jest prosty, czysty i intuicyjny. - Nawigacja w aplikacji jest łatwa i niezagnieżdżona. - Domyślnym językiem aplikacji jest język polski. - Aplikacja jest zgodna z wytycznymi WCAG na poziomie A. - W MVP nie jest przewidziany dedykowany onboarding ani samouczki.

## 4. Granice produktu

Następujące elementy znajdują się poza zakresem wersji MVP tego produktu:

- Rozwój własnego, zaawansowanego algorytmu powtórek (jak np. w SuperMemo czy Anki). Zamiast tego wykorzystana zostanie gotowa biblioteka open-source lub prosta implementacja znanego algorytmu (np. SM-2).
- Import fiszek z plików w różnych formatach (np. PDF, DOCX, CSV, Anki Package).
- Funkcjonalność współdzielenia zestawów fiszek między użytkownikami.
- Integracje z innymi platformami edukacyjnymi lub narzędziami (np. LMS, Google Classroom).
- Dedykowane aplikacje mobilne (iOS, Android). Produkt będzie dostępny wyłącznie jako aplikacja webowa.
- Zaawansowane formatowanie tekstu w fiszkach (np. Rich Text, Markdown).
- Możliwość dodawania obrazów lub dźwięków do fiszek.
- System tagowania lub kategoryzacji fiszek/zestawów inny niż podział na zestawy.
- Tryb offline.
- Funkcje społecznościowe (komentarze, oceny zestawów itp.).

Nierozwiązane kwestie na obecnym etapie (wymagające podjęcia decyzji przed implementacją):

- Wybór konkretnego, darmowego modelu AI do generowania fiszek.
- Wybór konkretnej biblioteki open-source lub specyfikacji algorytmu powtórek (np. SM-2) oraz szczegółów jego integracji i interfejsu użytkownika sesji nauki.
- Szczegółowe zdefiniowanie obsługi przypadków brzegowych logowania przez Google (np. email już istnieje w bazie).

## 5. Historyjki użytkowników

Poniżej przedstawiono historyjki użytkowników opisujące interakcje z systemem:

---

ID: US-001
Tytuł: Rejestracja nowego użytkownika (Email/Hasło)
Opis: Jako nowy użytkownik, chcę móc zarejestrować konto w aplikacji używając mojego adresu email i hasła, aby móc zapisywać swoje fiszki i postępy w nauce.
Kryteria akceptacji:

- Istnieje formularz rejestracji z polami na adres email, hasło i potwierdzenie hasła.
- System waliduje poprawność formatu adresu email.
- System sprawdza, czy hasło i jego potwierdzenie są identyczne.
- System sprawdza, czy podany adres email nie jest już zarejestrowany.
- Po pomyślnej walidacji i przesłaniu formularza, konto użytkownika jest tworzone w systemie.
- Użytkownik jest automatycznie zalogowany po rejestracji lub przekierowany na stronę logowania z komunikatem o sukcesie.
- W przypadku błędu (np. email zajęty, niepoprawne dane), użytkownik widzi czytelny komunikat błędu.

---

ID: US-002
Tytuł: Logowanie użytkownika (Email/Hasło)
Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji używając mojego adresu email i hasła, aby uzyskać dostęp do moich fiszek i zestawów.
Kryteria akceptacji:

- Istnieje formularz logowania z polami na adres email i hasło.
- System weryfikuje podane dane logowania z zapisanymi w bazie danych.
- Po pomyślnym zalogowaniu, użytkownik jest przekierowany do głównego widoku aplikacji (np. listy zestawów).
- W przypadku niepoprawnych danych logowania, użytkownik widzi czytelny komunikat błędu.
- Sesja użytkownika jest utrzymywana po zalogowaniu.

---

ID: US-003
Tytuł: Logowanie użytkownika (Google)
Opis: Jako użytkownik, chcę móc zalogować się lub zarejestrować do aplikacji za pomocą mojego konta Google, aby przyspieszyć proces i nie musieć pamiętać kolejnego hasła.
Kryteria akceptacji:

- Na stronie logowania/rejestracji znajduje się przycisk "Zaloguj przez Google".
- Kliknięcie przycisku inicjuje proces autoryzacji przez Google OAuth.
- Po pomyślnej autoryzacji przez Google:
  - Jeśli użytkownik z tym adresem email już istnieje, jest on logowany.
  - Jeśli użytkownik z tym adresem email nie istnieje, tworzone jest nowe konto i użytkownik jest logowany.
- Po pomyślnym zalogowaniu/rejestracji, użytkownik jest przekierowany do głównego widoku aplikacji.
- W przypadku błędu autoryzacji Google, użytkownik widzi odpowiedni komunikat.
- (Do doprecyzowania) Obsługa przypadku, gdy email z Google jest już zarejestrowany tradycyjnie (email/hasło).

---

ID: US-004
Tytuł: Resetowanie hasła
Opis: Jako zarejestrowany użytkownik, który zapomniał hasła, chcę móc zresetować swoje hasło, aby odzyskać dostęp do konta.
Kryteria akceptacji:

- Na stronie logowania znajduje się link "Zapomniałem hasła".
- Po kliknięciu linku, użytkownik jest proszony o podanie adresu email powiązanego z kontem.
- Jeśli email istnieje w bazie, system wysyła na ten adres wiadomość z linkiem do resetowania hasła.
- Link do resetowania hasła jest unikalny i ograniczony czasowo.
- Po kliknięciu linku w emailu, użytkownik jest przekierowany na stronę, gdzie może ustawić nowe hasło (wpisując je dwukrotnie).
- Po pomyślnym ustawieniu nowego hasła, użytkownik może zalogować się przy użyciu nowego hasła.
- Użytkownik jest informowany o wysłaniu emaila lub o tym, że podany email nie istnieje w bazie.

---

ID: US-005
Tytuł: Usuwanie konta
Opis: Jako zarejestrowany użytkownik, chcę móc usunąć swoje konto wraz ze wszystkimi moimi danymi (fiszki, zestawy), jeśli zdecyduję się przestać korzystać z aplikacji.
Kryteria akceptacji:

- W ustawieniach konta użytkownika dostępna jest opcja usunięcia konta.
- Przed usunięciem konta, użytkownik musi potwierdzić swoją decyzję (np. przez ponowne wpisanie hasła lub kliknięcie w link potwierdzający w emailu).
- Po potwierdzeniu, konto użytkownika oraz wszystkie powiązane z nim dane (zestawy, fiszki, postępy w nauce) są trwale usuwane z systemu.
- Użytkownik jest wylogowywany i widzi komunikat potwierdzający usunięcie konta.

---

ID: US-006
Tytuł: Tworzenie zestawu fiszek przez AI
Opis: Jako użytkownik, chcę móc wkleić dłuższy fragment tekstu (np. z artykułu, notatek), aby system automatycznie wygenerował dla mnie propozycje fiszek i stworzył z nich nowy zestaw, oszczędzając mój czas.
Kryteria akceptacji:

- Istnieje opcja "Utwórz zestaw z tekstu" lub podobna.
- Użytkownik może wkleić tekst do wyznaczonego pola tekstowego.
- System waliduje długość tekstu:
  - Jeśli tekst ma mniej niż 1000 znaków, wyświetlany jest błąd "Tekst jest za krótki (minimum 1000 znaków)".
  - Jeśli tekst ma więcej niż 10000 znaków, jest on przycinany do 10000 znaków przed przetworzeniem (użytkownik może być o tym poinformowany).
- Po zatwierdzeniu tekstu, system synchronicznie przetwarza go za pomocą AI i wyświetla wskaźnik postępu/oczekiwania.
- Wynikiem przetwarzania jest lista kandydatów na fiszki (każdy z polem Przód i Tył).
- Obok każdego kandydata znajdują się przyciski: "Akceptuj", "Edytuj", "Odrzuć".
- Kliknięcie "Akceptuj" oznacza kandydata do zapisania.
- Kliknięcie "Edytuj" otwiera modal z polami Przód i Tył kandydata, pozwalając na edycję (z walidacją długości: Przód max 200, Tył max 500 znaków); po zapisaniu zmian w modalu, kandydat jest oznaczony jako zaakceptowany.
- Kliknięcie "Odrzuć" usuwa kandydata z listy.
- Po przejrzeniu wszystkich kandydatów (lub kliknięciu przycisku typu "Zapisz zestaw"), tworzony jest nowy zestaw zawierający tylko zaakceptowane fiszki.
- Użytkownik jest proszony o nadanie nazwy nowemu zestawowi przed lub po procesie recenzji.
- Jeśli AI nie zwróci żadnych kandydatów, wyświetlany jest komunikat "Nie udało się wygenerować fiszek z podanego tekstu".
- Nowo utworzony zestaw jest oznaczany jako "stworzony przez AI".

---

ID: US-007
Tytuł: Tworzenie zestawu fiszek manualnie
Opis: Jako użytkownik, chcę móc stworzyć nowy, pusty zestaw fiszek, a następnie ręcznie dodawać do niego fiszki, wpisując treść dla przodu i tyłu.
Kryteria akceptacji:

- Istnieje opcja "Utwórz nowy zestaw" lub podobna.
- Po wybraniu tej opcji, użytkownik jest proszony o podanie nazwy dla nowego zestawu.
- Po utworzeniu zestawu, użytkownik jest przekierowywany do widoku tego zestawu, który początkowo jest pusty.
- W widoku zestawu istnieje opcja "Dodaj fiszkę".
- Po wybraniu "Dodaj fiszkę", pojawia się formularz z polami "Przód" i "Tył".
- Pole "Przód" ma limit 200 znaków.
- Pole "Tył" ma limit 500 znaków.
- System waliduje długość wprowadzonych tekstów przed zapisaniem fiszki.
- Po zapisaniu, nowa fiszka pojawia się na liście fiszek w danym zestawie.
- Zestaw, do którego pierwsza fiszka została dodana manualnie, jest oznaczany jako "stworzony manualnie".

---

ID: US-008
Tytuł: Przeglądanie listy zestawów
Opis: Jako użytkownik, chcę widzieć listę wszystkich moich zestawów fiszek, aby móc łatwo wybrać zestaw do nauki lub zarządzania.
Kryteria akceptacji:

- Po zalogowaniu, użytkownik widzi listę swoich zestawów fiszek.
- Lista wyświetla nazwy zestawów.
- Lista zestawów jest paginowana, wyświetlając maksymalnie 10 zestawów na jednej stronie.
- Użytkownik może nawigować między stronami listy zestawów.
- Kliknięcie na nazwę zestawu przekierowuje do widoku fiszek w tym zestawie.

---

ID: US-009
Tytuł: Zmiana nazwy zestawu
Opis: Jako użytkownik, chcę móc zmienić nazwę istniejącego zestawu fiszek, aby lepiej odzwierciedlała jego zawartość.
Kryteria akceptacji:

- W widoku listy zestawów lub w widoku konkretnego zestawu istnieje opcja edycji nazwy zestawu.
- Po wybraniu opcji edycji, użytkownik może wprowadzić nową nazwę dla zestawu.
- Po zatwierdzeniu, nowa nazwa zestawu jest zapisywana i wyświetlana.
- Nazwa zestawu nie może być pusta.

---

ID: US-010
Tytuł: Usuwanie zestawu
Opis: Jako użytkownik, chcę móc usunąć cały zestaw fiszek, gdy już go nie potrzebuję.
Kryteria akceptacji:

- W widoku listy zestawów lub w widoku konkretnego zestawu istnieje opcja usunięcia zestawu.
- Przed usunięciem zestawu, system wyświetla prośbę o potwierdzenie, informując, że usunięte zostaną również wszystkie fiszki w tym zestawie.
- Po potwierdzeniu przez użytkownika, zestaw i wszystkie należące do niego fiszki są usuwane z systemu.
- Użytkownik jest przekierowywany do listy zestawów (jeśli usuwał z widoku zestawu).

---

ID: US-011
Tytuł: Przeglądanie fiszek w zestawie
Opis: Jako użytkownik, chcę móc przeglądać wszystkie fiszki należące do wybranego zestawu, aby zobaczyć ich zawartość.
Kryteria akceptacji:

- Po wybraniu zestawu z listy, użytkownik widzi listę fiszek należących do tego zestawu.
- Każdy element listy pokazuje treść Przodu i Tyłu fiszki (lub przynajmniej Przodu z opcją podejrzenia Tyłu).
- Lista fiszek jest paginowana, wyświetlając maksymalnie 20 fiszek na jednej stronie.
- Użytkownik może nawigować między stronami listy fiszek.

---

ID: US-012
Tytuł: Edycja fiszki
Opis: Jako użytkownik, chcę móc edytować treść istniejącej fiszki (zarówno Przód, jak i Tył), aby poprawić błędy lub zaktualizować informacje.
Kryteria akceptacji:

- W widoku fiszki (np. na liście fiszek w zestawie) istnieje opcja edycji danej fiszki.
- Po wybraniu opcji edycji, użytkownik widzi formularz z aktualną treścią pól Przód i Tył.
- Użytkownik może modyfikować treść w obu polach.
- Walidacja limitów znaków (Przód max 200, Tył max 500) jest stosowana podczas edycji.
- Po zapisaniu zmian, zaktualizowana treść fiszki jest widoczna w systemie.

---

ID: US-013
Tytuł: Usuwanie fiszki
Opis: Jako użytkownik, chcę móc usunąć pojedynczą fiszkę z zestawu, jeśli uznam ją za niepotrzebną lub błędną.
Kryteria akceptacji:

- W widoku fiszki (np. na liście fiszek w zestawie) istnieje opcja usunięcia danej fiszki.
- Przed usunięciem fiszki, system może (opcjonalnie) poprosić o potwierdzenie.
- Po potwierdzeniu (lub od razu), fiszka jest usuwana z zestawu.
- Fiszka znika z listy fiszek w danym zestawie.

---

ID: US-014
Tytuł: Wyszukiwanie fiszek
Opis: Jako użytkownik, chcę móc wyszukać fiszki zawierające określone słowo kluczowe we wszystkich moich zestawach, aby szybko znaleźć potrzebne informacje.
Kryteria akceptacji:

- W interfejsie aplikacji dostępne jest pole wyszukiwania.
- Użytkownik może wpisać szukaną frazę w pole wyszukiwania.
- Po zainicjowaniu wyszukiwania, system przeszukuje pola Przód i Tył wszystkich fiszek należących do użytkownika.
- Wyniki wyszukiwania są prezentowane w formie listy pasujących fiszek, wskazując również, do którego zestawu dana fiszka należy.
- Jeśli nic nie zostanie znalezione, wyświetlany jest komunikat "Nie znaleziono fiszek pasujących do zapytania".

---

ID: US-015
Tytuł: Rozpoczęcie sesji nauki (powtórek)
Opis: Jako użytkownik, chcę móc rozpocząć sesję nauki dla wybranego zestawu fiszek, aby system pokazał mi fiszki do powtórki zgodnie z algorytmem spaced repetition.
Kryteria akceptacji:

- W widoku zestawu lub na liście zestawów istnieje przycisk "Rozpocznij naukę" (lub podobny).
- Po kliknięciu przycisku, rozpoczyna się sesja nauki oparta na zintegrowanym algorytmie powtórek.
- System prezentuje użytkownikowi fiszki zgodnie z harmonogramem wyznaczonym przez algorytm (np. najpierw te wymagające najpilniejszej powtórki).
- Interfejs sesji nauki wyświetla Przód fiszki.
- Użytkownik ma możliwość odsłonięcia Tyłu fiszki.
- Użytkownik ma możliwość oceny swojej znajomości fiszki ("Nie wiem", "Wiem").
- Ocena użytkownika jest przekazywana do algorytmu powtórek, który aktualizuje harmonogram dla danej fiszki.
- Sesja kontynuuje prezentowanie kolejnych fiszek zgodnie z logiką algorytmu.
- Użytkownik może zakończyć sesję nauki w dowolnym momencie.

---

ID: US-016
Tytuł: Zgodność z WCAG Poziom A
Opis: Jako użytkownik, w tym osoba z niepełnosprawnościami, chcę móc korzystać z aplikacji bez barier, zgodnie z podstawowymi standardami dostępności.
Kryteria akceptacji:

- Aplikacja spełnia wszystkie kryteria sukcesu poziomu A wytycznych WCAG (Web Content Accessibility Guidelines) w aktualnej wersji.
- Możliwa jest nawigacja po aplikacji przy użyciu klawiatury.
- Kontrasty kolorów tekstu i tła są wystarczające.
- Elementy interaktywne mają czytelne etykiety.
- Struktura strony jest logiczna i używa poprawnych znaczników semantycznych HTML.

## 6. Metryki sukcesu

Sukces MVP będzie mierzony za pomocą następujących kluczowych wskaźników:

6.1. Jakość generowania fiszek przez AI: - Metryka: Procent akceptacji fiszek wygenerowanych przez AI. - Cel: 75% - Sposób pomiaru: Dla każdego procesu generowania fiszek przez AI (dla jednego wklejonego tekstu), system zlicza liczbę wygenerowanych kandydatów oraz liczbę kandydatów zaakceptowanych przez użytkownika (bezpośrednio lub po edycji). Metryka jest obliczana jako (Liczba zaakceptowanych kandydatów / Łączna liczba wygenerowanych kandydatów) \* 100%. Średnia ważona tej wartości dla wszystkich procesów generowania będzie śledzona.

6.2. Adopcja funkcji generowania przez AI: - Metryka: Procent fiszek stworzonych z wykorzystaniem AI. - Cel: 75% - Sposób pomiaru: System oznacza każdy zestaw jako "stworzony przez AI" (jeśli zainicjowany przez wklejenie tekstu) lub "stworzony manualnie". Następnie, dla każdego użytkownika oraz globalnie, obliczany jest stosunek liczby fiszek znajdujących się w zestawach "stworzonych przez AI" do całkowitej liczby fiszek posiadanych przez użytkownika (lub wszystkich fiszek w systemie). Metryka = (Liczba fiszek w zestawach AI / Całkowita liczba fiszek) \* 100%.
