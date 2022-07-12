# Contributing

- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Local development](#local-development)
- [Architecture](#architecture)
- [Concepts](#concepts)
  - [Advanced concepts](#advanced-concepts)
  - [Main directories](#main-directories)
  - [Technological stack](#technological-stack)
- [Best practice](#best-practice)
  - [Conventional Commits](#conventional-commits)
- [IDEs](#ides)
  - [Recommended Visual Studio Code settings](#recommended-visual-studio-code-settings)

## Get Started

### Requirements

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation#using-corepack)
- [Docker](https://www.docker.com/get-started)

### Setup

> ⚠️ **Important**  
> If you're under **Windows**, please run all the CLI commands within a Linux shell-like terminal (i.e.: Git Bash).

Then run:

```sh
git clone https://github.com/betagouv/tell-me.git
cd tell-me
pnpm i
pnpm run dev:setup
pnpm run dev:docker
pnpm run db:migrate
```

> 📋 **Note**  
> The `pnpm run dev:setup` command (script) does the following, if necessary:
>
> - Copy `.env.example` file to a `.env` one.
> - Generate an EdDSA Key Pair (required in order to generate and verify [JWTs](https://jwt.io)).
> - Install [Playwright](https://playwright.dev) browsers for E2E tests.

### Local development

```sh
pnpm run dev:docker
pnpm run dev
```

This will run PostgreSQL within a Docker container via Docker Compose and run the webapp which should then be available at
[http://localhost:3000](http://localhost:3000).

It will also watch for file changes and automatically re-hydrate the webapp on the go.

## Architecture

This is a monolithic application conceptually split into 2 concerns:

- **Api**: The back-end RESTFul API used by both front-office and back-office.
- **App**: The front-end.

## Concepts

For the sake of clarity, all comments within and outside source code refer to a few internal concepts defined as:

- **Survey Editor**: The surver editor in the back-office.
- **Survey Form**: The survey form filled by end-users.
- **Tell Me Tree**: The JSON representation of a Survey Form.
- **Tell Me Data**: The JSON representation of survey entries submitted by end-users.

### Advanced concepts

Survey Forms as well as their JSON representation (Tell Me Tree) are made of questions, inputs, buttons (submit, next) 
and some free text content (subtitles, paragraphs). Each of those are conceptualized as **blocks**. For example, a 
question with two choices is made of 3 **blocks**: one for the the question (text) itself and one block per choice.

### Main directories

```sh
├─  api/            # Back-end code base
├─  app/            # Front-end code base
├─  common/         # Source files that are common to all parts (API & Application)
├─  config/         # Tests configuration, setup and teardown
├─  locales/        # Localization files (automatically generated and updated)
├─┐ pages/          # Entrypoint pages (routes there are natively handled by Next.js)
│ ├─  api/          # API endpoints controllers
│ ├─  public/       # Front-office (survey form for end-users and previews)
│ └─  **/*          # Back-office
├─  public/         # Public assets (natively handled by Next.js)
├─  schemas/        # JSON Schema for Tell Me Tree and Tell Me Data with data fakers (= generators)
└─  scripts/        # CI, Docker, deployment, database and enviroment-related scripts
```

### Technological stack

All the parts run on [Next.js framework](https://nextjs.org) and all the entrypoint paths are matched by a similar path
within `pages/` directory.

The API uses [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction).

The back-office uses an [unofficially documented](https://colinhacks.com/essays/building-a-spa-with-nextjs) strategy to
be served as an SPA (Single-Page Application), via [`react-router-dom`](https://www.npmjs.com/package/react-router-dom).

The front-office (public surveys) uses SSR (Server-Side Rendering) but could be improved using both [ISR (Incremental
Static Regeneration)](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) and
[Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode).

There are some URL path resolution caveats with this strategy that are actually circumvented thank to a delarative
[path rewriting strategy](https://nextjs.org/docs/api-reference/next.config.js/rewrites) (c.f. `next.config.js` file).
It's not DRY but it seems clean enough to be an acceptable trade-off.

## Best practice

### Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) principles.

Please try to check the existing history before committing anything if you're not familiar with this convention.

Thanks to [husky](https://github.com/typicode/husky), your code should be automatically linted before your changes are
committed. If there is any lint error can't be auto-fixed, your changes won't be committed. It's up to you to fix them.

## IDEs

### Recommended Visual Studio Code settings

`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "pnpm",
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  },
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": "**/.github/workflows/build.yml"
  }
}
```
