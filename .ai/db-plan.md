# Schemat bazy danych - 10x-cards

## 1. Tabele i kolumny

### 1.1. users

Tabela zarządzana przez Supabase Auth.

- `id` UUID PRIMARY KEY
- `email` VARCHAR NOT NULL UNIQUE
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- `encrypted_password` TEXT NOT NULL
- `confirmed_at` TIMESTAMPTZ

### 1.2. flashcards

Tabela przechowująca fiszki, zarówno generowane przez AI, jak i tworzone manualnie.

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `generation_id` BIGINT REFERENCES generations(id) ON DELETE CASCADE
- `front` VARCHAR(200) NOT NULL
- `back` VARCHAR(500) NOT NULL
- `source` VARCHAR NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

### 1.3. generations

Tabela rejestrująca metadane dotyczące procesów generowania fiszek przez AI.

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `model` TEXT NOT NULL
- `generated_count` INTEGER NOT NULL
- `accepted_unedited_count` INTEGER NULLABLE
- `accepted_edited_count` INTEGER NULLABLE
- `source_text_hash` TEXT NOT NULL
- `source_text_length` INTEGER NOT NULL
- `generation_duration` INTEGER NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

### 1.4. generation_error_logs

Tabela przechowująca logi błędów występujących podczas generowania fiszek.

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `model` TEXT NOT NULL
- `source_text_hash` TEXT NOT NULL
- `source_text_length` INTEGER NOT NULL
- `error_code` TEXT NOT NULL
- `error_message` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

## 2. Relacje między tabelami

- `flashcards.user_id` → `users.id` (relacja 1-do-wielu, kaskadowe usuwanie)
- `flashcards.generation_id` → `generations.id` (relacja 1-do-wielu, kaskadowe usuwanie)
- `generations.user_id` → `users.id` (relacja 1-do-wielu, kaskadowe usuwanie)
- `generation_error_logs.user_id` → `users.id` (relacja 1-do-wielu, kaskadowe usuwanie)

## 3. Indeksy

- Pełnotekstowe indeksy dla wyszukiwania w tabeli `flashcards`:
  - ```sql
    CREATE INDEX idx_flashcards_front_fts ON flashcards USING gin (to_tsvector('polish', front));
    ```
  - ```sql
    CREATE INDEX idx_flashcards_back_fts ON flashcards USING gin (to_tsvector('polish', back));
    ```
- Dodatkowe indeksy na kolumnie `user_id` w tabelach `flashcards`, `generations` i `generation_error_logs` dla optymalizacji zapytań filtrowanych po użytkowniku.

## 4. Zasady PostgreSQL (RLS - Row Level Security)

Dla tabel zawierających kolumnę `user_id` (`flashcards`, `generations`, `generation_error_logs`) należy aktywować RLS i utworzyć politykę ograniczającą dostęp do danych tylko do właściciela. Przykładowa konfiguracja:

- Włączenie RLS:
  - ```sql
    ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
    ```
- Przykładowa polityka:
  - ```sql
    CREATE POLICY user_isolation_policy ON <table_name>
      USING (user_id = current_setting('app.current_user_id')::uuid);
    ```

Polityka ta zapewnia, że użytkownik ma dostęp jedynie do danych, których `user_id` odpowiada bieżącemu identyfikatorowi użytkownika ustawionemu w aplikacji.

## 5. Dodatkowe uwagi

- Tabela `users` jest zarządzana przez Supabase Auth, dlatego nie jest częścią typowych migracji aplikacji.
- Pełnotekstowe indeksy w tabeli `flashcards` poprawiają wydajność zapytań wyszukiwania treści fiszek.
- Trigger w tabeli flashcards ma automatycznie aktualizować kolumnę `updated_at` przy kadej modyfikacji rekordu.
