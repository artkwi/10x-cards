# 10x-cards

## Project description 

10x-cards is a web-based MVP application designed to simplify and accelerate the creation of educational flashcards. The application leverages artificial intelligence to generate flashcards from a given text, as well as enabling the manual creation of flashcards. Users can manage their flashcards by grouping them into sets and utilizing an integrated spaced repetition algorithm for efficient learning. User accounts ensure secure data storage and progress tracking.

## Tech stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL, built-in authentication)
- **AI Integration:** Openrouter.ai for communication with various AI models
- **CI/CD & Hosting:** GitHub Actions, DigitalOcean

## Getting started locally

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 10x-cards
   ```

2. **Ensure the correct Node version is used**

   ```bash
   nvm use
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:3000`

## Available scripts

- `npm run dev` – Starts the development server.
- `npm run build` – Builds the project for production.
- `npm run preview` – Previews the production build.

For additional scripts, refer to the `package.json` file.

## Project scope

- **User Management:** Account registration, email/password and Google login, password reset, and account deletion.
- **Flashcard Creation:** AI-powered generation of flashcards from text input and manual creation with character limits (front: 200 characters, back: 500 characters).
- **Flashcard Management:** Organizing flashcards into sets with pagination, editing, and deletion functionalities.
- **Learning Mode:** Integration with a spaced repetition algorithm to optimize review sessions.
- **Accessibility:** Built-in adherence to WCAG Level A guidelines for an accessible user interface.

## Project status

This MVP version of 10x-cards is under active development. Core functionalities are implemented and ongoing improvements are expected based on user feedback and further feature requirements.

## License

This project is licensed under the MIT License.

# products

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test products` to execute the unit tests.

Unit tests are implemented using Vitest and React Testing Library for fast and robust testing of components and logic.

## Running end-to-end tests

End-to-end tests are executed using Playwright to simulate real user interactions and verify complete application flows.
