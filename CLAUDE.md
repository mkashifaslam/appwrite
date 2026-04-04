# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server at http://localhost:4200 (uses development config)
npm run build        # Production build → dist/angular-starter-kit-for-appwrite/
npm run watch        # Build in watch mode (development config)
npm test             # Run unit tests via Karma/Jasmine in Chrome
```

To run a single test file, use the Angular CLI directly:
```bash
npx ng test --include='**/app.component.spec.ts'
```

## Configuration

Before running, set your Appwrite credentials in `src/environments/`:
- `environment.development.ts` — used during `ng serve` (development)
- `environment.ts` — used for production builds

Both files export the same shape: `appwriteEndpoint`, `appwriteProjectId`, `appwriteProjectName`.

The `angular.json` build config replaces `environment.ts` with `environment.development.ts` automatically when serving in development mode.

## Architecture

This is a minimal Angular 19 standalone-component app that demonstrates Appwrite connectivity.

- **Entry point**: `src/main.ts` bootstraps `AppComponent` with `appConfig`
- **App config** (`src/app/app.config.ts`): Sets up Zone.js change detection and the router (currently no routes defined)
- **AppComponent** (`src/app/app.component.ts`): The entire app lives in a single standalone component. It instantiates the Appwrite `Client` directly in the constructor using environment variables, then calls `client.ping()` on button click to test the connection. Ping results are stored in a `logs: Log[]` array and displayed in a fixed bottom panel.
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/postcss` in `.postcssrc.json`). Global styles in `src/styles.css` just imports Tailwind. All component styles use Tailwind utility classes inline in the template; `app.component.css` is effectively empty.
- **Fonts**: Poppins and Fira Code are loaded via Google Fonts in `src/index.html` and referenced by name in Tailwind classes (`font-[Poppins]`, `font-[Fira_Code]`).
- **Icons**: Custom icon font loaded in `src/index.html` from Appwrite's CDN; used as `<span class="icon-*">` elements.
