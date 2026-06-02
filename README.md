# Job Pack

AI-powered resume, cover letter, and company fit generator.

## What it does

Paste a job description and your candidate profile, and Job Pack generates:
- A tailored resume in markdown format
- A personalized cover letter
- A company fit infographic with pros, cons, and a fit score

Drafts are saved automatically and can be reopened and compared.

## Live App

https://job-pack.onrender.com

## Setup

1. Clone the repo
2. Install dependencies:
```bash
   cd jobpack
   npm install
```
3. Copy `.env.example` to `.env` and fill in your values
4. Run the server:
```bash
   node backend/server.js
```
5. Open `frontend/index.html` in your browser

## LLM Backend

The app uses the Strategy pattern to support multiple LLM backends.
Switch backends with a single config change in `.env` — zero code modification.

### Available backends

| Backend | LLM_BACKEND value | Description |
|---|---|---|
| Class Ollama (default) | `ollama` | Hosted class Ollama server |
| Local Ollama | `local` | Local Ollama with llama3.2 |

### How to swap backends

Change `LLM_BACKEND` in your `.env` file:
LLM_BACKEND=ollama   # use class server
LLM_BACKEND=local    # use local Ollama

No code changes required.

## Design Patterns

- **Strategy + Factory Method** — LLM backend is selected via `getLLMClient()` in `backend/llm/factory.js`. Adding a new backend requires one new class and one line in the factory.
- **Facade** — The `/api/generate` endpoint hides the complexity of three sequential LLM calls and draft persistence behind a single interface.

## Enterprise Integration Pattern

**Pipes and Filters** — The generation pipeline passes the input through sequential stages: prompt construction → LLM call → response formatting → PDF generation → draft persistence.

## Perfect Framework Concerns

- **Secrets management** — API keys stored in `.env`, never committed to git
- **Persistence** — Drafts saved to SQLite database server-side
- **Deployment** — Deployed on Render with HTTPS

## AI Attribution

Built with assistance from Claude Sonnet 4.6 for LLM backend Strategy pattern, factory implementation, and API integration.