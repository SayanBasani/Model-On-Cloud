# [ModelOnCloud](https://model-on-cloud.vercel.app/)
[Link](https://model-on-cloud.vercel.app/)
> A modern AI chat application powered by **Next.js** and **Cloudflare Workers AI**.

ModelOnCloud is an AI chat platform designed to provide a fast, responsive ChatGPT-style experience while keeping the AI inference layer separate from the frontend application.

The project currently supports:

* AI conversations
* Streaming AI responses
* Stop generation
* Markdown rendering
* GitHub-Flavored Markdown
* Syntax-highlighted code blocks
* Code copying
* Chat history
* Local chat persistence
* Create new conversations
* Rename conversations
* Delete conversations
* Search conversations
* Edit user messages
* Regenerate AI responses
* Retry failed responses
* Light/Dark mode
* Responsive desktop/mobile interface
* Cloudflare Workers AI integration

The project is being developed toward a larger AI platform with authentication, persistent cloud storage, file uploads, RAG, memory, API keys, developer tools, usage analytics, and more.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Getting Cloudflare Credentials](#getting-cloudflare-credentials)
* [Running the Project](#running-the-project)
* [Production Build](#production-build)
* [AI API](#ai-api)
* [Streaming](#streaming)
* [Chat Storage](#chat-storage)
* [Security](#security)
* [Deployment](#deployment)
* [Troubleshooting](#troubleshooting)
* [Useful Commands](#useful-commands)
* [Documentation](#documentation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)

---

# Features

## AI Chat

ModelOnCloud communicates with Cloudflare Workers AI through the application's server-side API.

The current model is:

```text
@cf/meta/llama-3.2-1b-instruct
```

The frontend does not directly expose the Cloudflare API token.

The request flow is:

```text
User
  ↓
Next.js Chat UI
  ↓
/api/chat
  ↓
Cloudflare Workers AI REST API
  ↓
Llama 3.2 1B
  ↓
Streaming response
  ↓
Browser
```

Cloudflare Workers AI provides serverless access to AI models running on Cloudflare infrastructure.

---

## Streaming Responses

AI responses are streamed progressively instead of waiting for the complete response.

```text
User sends message
       ↓
Next.js /api/chat
       ↓
Cloudflare AI
       ↓
SSE stream
       ↓
readAIStream()
       ↓
Token
       ↓
Update UI
       ↓
Token
       ↓
Update UI
```

This provides a much faster ChatGPT-style experience.

Cloudflare Workers AI supports streaming model responses through the `stream` option.

---

## Stop Generation

Users can stop an active AI response.

The application uses:

* `AbortController`
* `AbortSignal`
* stream cancellation
* generation IDs

This prevents already-buffered tokens from continuing to update the interface after the user presses Stop.

---

## Markdown

AI responses support Markdown including:

* Headings
* Bold
* Italic
* Lists
* Links
* Tables
* Blockquotes
* Inline code
* Fenced code blocks

GitHub-Flavored Markdown is supported through `remark-gfm`.

---

## Code Highlighting

Code blocks are rendered with syntax highlighting.

Supported languages depend on the syntax-highlighting library and language identifier returned by the Markdown parser.

Code blocks include:

* Language indicator
* Syntax highlighting
* Horizontal scrolling
* Copy button
* Preserved indentation
* Preserved line breaks

---

## Chat Management

Current chat functionality includes:

```text
New Chat
Rename Chat
Delete Chat
Search Conversations
Edit User Message
Regenerate Response
Retry Failed Response
```

Chat history is currently stored locally in the browser.

---

## Responsive UI

The application supports:

* Desktop
* Tablet
* Mobile

The sidebar supports:

* Desktop expanded mode
* Desktop collapsed mode
* Mobile drawer
* Mobile overlay
* Mobile close button

---

## Themes

ModelOnCloud supports:

```text
Light Mode
Dark Mode
```

Theme variables are defined in:

```text
app/globals.css
```

---

# Tech Stack

## Frontend

| Technology               | Purpose                 |
| ------------------------ | ----------------------- |
| Next.js                  | Application framework   |
| React                    | UI                      |
| TypeScript               | Type safety             |
| Tailwind CSS             | Styling                 |
| React Markdown           | Markdown rendering      |
| remark-gfm               | GitHub Markdown support |
| react-syntax-highlighter | Code highlighting       |
| Lucide React             | Icons                   |

## AI

| Technology            | Purpose             |
| --------------------- | ------------------- |
| Cloudflare Workers AI | AI inference        |
| Llama 3.2 1B Instruct | Current AI model    |
| Cloudflare REST API   | AI communication    |
| SSE                   | Streaming responses |

## Storage

Current:

```text
Browser Local Storage
```

Planned:

```text
Cloudflare D1
Cloudflare R2
Cloudflare Vectorize
```

---

# Architecture

## Current Architecture

```text
┌──────────────────────────────┐
│          Browser             │
│                              │
│  Next.js / React Application │
└──────────────┬───────────────┘
               │
               │ POST /api/chat
               ▼
┌──────────────────────────────┐
│       Next.js Server         │
│                              │
│      app/api/chat/route.ts   │
└──────────────┬───────────────┘
               │
               │ HTTPS
               ▼
┌──────────────────────────────┐
│    Cloudflare Workers AI     │
│                              │
│ @cf/meta/llama-3.2-1b-       │
│ instruct                     │
└──────────────┬───────────────┘
               │
               │ SSE stream
               ▼
┌──────────────────────────────┐
│          Browser             │
│                              │
│       Streaming UI           │
└──────────────────────────────┘
```

---

# Project Structure

Current project structure:

```text
Model-On-Cloud/
│
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   │
│   ├── chat/
│   │   ├── Chat.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── CodeBlock.tsx
│   │   └── TypingIndicator.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── lib/
│   ├── message-utils.ts
│   ├── storage.ts
│   ├── stream.ts
│   └── types.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# Requirements

Before running ModelOnCloud, install:

## Node.js

Use a current LTS version of Node.js.

Check your installed version:

```powershell
node --version
```

```powershell
npm --version
```

Recommended:

```text
Node.js 20+
npm 10+
```

---

# Getting Started

## 1. Clone the repository

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Enter the project:

```powershell
cd Model-On-Cloud
```

---

## 2. Install dependencies

```powershell
npm install
```

If dependencies need to be installed again after a clean checkout:

```powershell
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

Do not add quotation marks unless required by your environment.

Example:

```env
CLOUDFLARE_ACCOUNT_ID=1234567890abcdef1234567890abcdef
CLOUDFLARE_API_TOKEN=your-secret-token
```

---

# Environment Variables

## `CLOUDFLARE_ACCOUNT_ID`

Your Cloudflare account identifier.

```env
CLOUDFLARE_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

---

## `CLOUDFLARE_API_TOKEN`

Your Cloudflare API token used to access Workers AI.

```env
CLOUDFLARE_API_TOKEN=YOUR_API_TOKEN
```

This is a **secret**.

Never:

* Commit it to GitHub
* Put it in frontend code
* Put it in `NEXT_PUBLIC_*`
* Share it publicly
* Put it inside React components
* Put it inside `app/page.tsx`

The token should only be available to server-side code.

---

# Getting Cloudflare Credentials

## Step 1 — Create Cloudflare Account

Go to:

https://dash.cloudflare.com/

Create an account or log in.

---

## Step 2 — Get Account ID

Open the Cloudflare Dashboard.

Go to the relevant account.

Copy your:

```text
Account ID
```

Cloudflare's Workers AI REST API documentation also instructs users to obtain the Account ID from the Cloudflare dashboard.

---

## Step 3 — Create Workers AI API Token

In the Cloudflare Dashboard:

```text
Workers AI
    ↓
Use REST API
    ↓
Create a Workers AI API Token
```

Cloudflare currently documents this as the recommended setup for the Workers AI REST API.

If creating a custom token, make sure it has the required Workers AI permissions. Cloudflare documents `Workers AI - Read` and `Workers AI - Edit` for this REST API setup.

Copy the generated token immediately and store it securely.

---

# Environment File

Your local file should look like:

```env
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Do **not** commit:

```text
.env
.env.local
.env.production
```

Your `.gitignore` should include:

```gitignore
# dependencies
node_modules/

# Next.js
.next/
out/

# production
build/

# local environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# debugging
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Vercel
.vercel/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# TypeScript
*.tsbuildinfo
```

---

# Running the Project

## Development

Run:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Build

Before deploying, test the production build:

```powershell
npm run build
```

If successful:

```powershell
npm start
```

The production application will normally be available at:

```text
http://localhost:3000
```

---

# Useful Development Commands

## Start development server

```powershell
npm run dev
```

## Build

```powershell
npm run build
```

## Start production server

```powershell
npm start
```

## Check dependencies

```powershell
npm ls
```

## Install a package

```powershell
npm install <package-name>
```

## Install development dependency

```powershell
npm install -D <package-name>
```

---

# AI API

The application currently exposes:

```text
POST /api/chat
```

The frontend sends:

```json
{
    "messages": [
        {
            "role": "user",
            "content": "Hello"
        }
    ]
}
```

The Next.js route forwards the request to Cloudflare Workers AI.

Current model:

```text
@cf/meta/llama-3.2-1b-instruct
```

Cloudflare's Execute AI Model API uses the endpoint pattern:

```text
POST /accounts/{account_id}/ai/run/{model_name}
```

and authenticates using an API token.

---

# Chat API Flow

```text
POST /api/chat
       │
       ▼
Validate request
       │
       ▼
Read environment variables
       │
       ├── CLOUDFLARE_ACCOUNT_ID
       │
       └── CLOUDFLARE_API_TOKEN
       │
       ▼
Cloudflare AI REST API
       │
       ▼
Llama 3.2 1B
       │
       ▼
SSE stream
       │
       ▼
readAIStream()
       │
       ▼
React state
       │
       ▼
MessageBubble
```

---

# Streaming Implementation

The server requests streaming from Cloudflare.

The browser receives the response progressively.

The stream is handled by:

```text
lib/stream.ts
```

The main function is:

```text
readAIStream()
```

The current implementation also accepts an `AbortSignal`.

This allows:

```text
Send
 ↓
Generate
 ↓
Stop
 ↓
AbortController
 ↓
Cancel stream
```

---

# Stop Generation

The chat component uses:

```text
AbortController
```

and:

```text
AbortSignal
```

along with:

```text
generationIdRef
```

The generation ID prevents stale tokens from updating the UI after a generation has been stopped.

---

# Local Chat Storage

At the current stage, chat history is stored locally.

The storage implementation is:

```text
lib/storage.ts
```

The application uses functions such as:

```text
loadChats()
saveChats()
```

This means chat history is currently tied to the browser/device.

It is **not yet cloud synchronized**.

Planned cloud persistence will use a database.

---

# Security

## Never expose API tokens

Incorrect:

```tsx
const token =
    "my-secret-cloudflare-token";
```

Incorrect:

```tsx
NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=...
```

Correct:

```text
.env.local
      ↓
Server-side API route
      ↓
Cloudflare
```

---

## `.env.local`

Never commit:

```text
.env.local
```

Verify Git is ignoring it:

```powershell
git status
```

If `.env.local` appears in the output, fix `.gitignore` before committing.

---

# Deployment

## Vercel

The current Next.js application can be deployed to Vercel.

Before deploying:

```powershell
npm run build
```

Then configure the environment variables in:

```text
Vercel Dashboard
    ↓
Project
    ↓
Settings
    ↓
Environment Variables
```

Add:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

Do not rely on your local `.env.local` being available on Vercel.

After adding or changing environment variables, redeploy the project.

---

# Production Environment

Production should contain:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

Never expose these values to the client.

---

# Troubleshooting

## `CLOUDFLARE_ACCOUNT_ID is not configured`

Check:

```text
.env.local
```

Make sure:

```env
CLOUDFLARE_ACCOUNT_ID=...
```

exists.

Restart the development server:

```powershell
Ctrl + C
npm run dev
```

---

## `CLOUDFLARE_API_TOKEN is not configured`

Check:

```env
CLOUDFLARE_API_TOKEN=...
```

Restart Next.js:

```powershell
npm run dev
```

---

## Cloudflare returns 401

Usually check:

1. API token is correct.
2. Token has the required Workers AI permissions.
3. Account ID is correct.
4. Token belongs to the correct Cloudflare account.

Cloudflare's API documentation specifies API-token authentication for the AI model execution endpoint.

---

## Cloudflare returns 403

Check the API token permissions.

For the Workers AI REST API, Cloudflare documents Workers AI permissions for the token.

---

## AI response does not stream

Check:

```text
app/api/chat/route.ts
```

Make sure the request contains:

```json
{
    "stream": true
}
```

Also check:

```text
lib/stream.ts
```

and browser DevTools → Network.

---

## Stop button does not stop

Check:

```text
components/chat/Chat.tsx
```

The application should have:

```text
AbortController
generationIdRef
```

and:

```text
controller.signal
```

should be passed to:

```text
readAIStream()
```

---

## Markdown hydration errors

Avoid creating invalid HTML such as:

```html
<p>
    <pre>
        ...
    </pre>
</p>
```

Code blocks should be rendered through:

```text
components/chat/CodeBlock.tsx
```

---

## Code formatting is broken

Check:

```text
components/chat/CodeBlock.tsx
```

and:

```text
app/globals.css
```

Code blocks must preserve:

```css
white-space: pre;
```

---

# Main Documentation

## Next.js

Official documentation:

https://nextjs.org/docs

Next.js API reference:

https://nextjs.org/docs/app/api-reference

---

## React

Official documentation:

https://react.dev/

---

## TypeScript

Official documentation:

https://www.typescriptlang.org/docs/

---

## Tailwind CSS

Official documentation:

https://tailwindcss.com/docs

---

## React Markdown

GitHub:

https://github.com/remarkjs/react-markdown

---

## remark-gfm

GitHub:

https://github.com/remarkjs/remark-gfm

---

## React Syntax Highlighter

GitHub:

https://github.com/react-syntax-highlighter/react-syntax-highlighter

---

# Cloudflare Documentation

## Cloudflare Workers AI

Official documentation:

https://developers.cloudflare.com/workers-ai/

Workers AI provides serverless access to AI models running on Cloudflare's infrastructure.

---

## Workers AI Getting Started

https://developers.cloudflare.com/workers-ai/get-started/

Cloudflare currently provides Workers Bindings, REST API, and dashboard-based approaches for getting started with Workers AI.

---

## Workers AI REST API

https://developers.cloudflare.com/workers-ai/get-started/rest-api/

This is the primary documentation relevant to the current ModelOnCloud implementation. It covers:

* Account ID
* API token
* Permissions
* REST API
* Running models
* API requests

---

## Workers AI API Reference

https://developers.cloudflare.com/api/resources/ai/

---

## Workers AI Model Execution API

https://developers.cloudflare.com/api/resources/ai/methods/run/

Current endpoint:

```text
POST /accounts/{account_id}/ai/run/{model_name}
```

---

## Workers AI Bindings

https://developers.cloudflare.com/workers-ai/configuration/bindings/

This will become especially important when the project moves from the current REST API architecture to a Cloudflare Worker backend.

Workers AI bindings expose the AI service through:

```text
env.AI
```

and support streaming through:

```text
stream: true
```

---

## Cloudflare API Tokens

https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

Use API tokens instead of exposing account credentials or global API keys.

---

# Future Cloudflare Architecture

The planned production architecture is:

```text
                    ┌──────────────────┐
                    │     Browser      │
                    │  Next.js / React │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Cloudflare       │
                    │ Worker API       │
                    └────────┬─────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌────────────┐      ┌────────────┐    ┌────────────┐
   │ Workers AI │      │     D1     │    │     R2     │
   │    LLM     │      │  Database  │    │   Files    │
   └────────────┘      └────────────┘    └────────────┘
                             │
                             ▼
                       ┌────────────┐
                       │ Vectorize  │
                       │    RAG     │
                       └────────────┘
```

Cloudflare's current AI platform also provides products such as Workers AI, Vectorize, AI Gateway, and AI Search for building AI applications.

---

# Roadmap

## Phase 1 — Chat Experience

Completed / in progress:

* [x] Next.js application
* [x] Responsive UI
* [x] Sidebar
* [x] Mobile sidebar
* [x] Desktop sidebar collapse
* [x] Light/Dark mode
* [x] Chat history
* [x] Local persistence
* [x] Cloudflare Workers AI
* [x] Streaming responses
* [x] Stop generation
* [x] Markdown
* [x] GFM
* [x] Syntax highlighting
* [x] Copy code
* [x] Edit messages
* [x] Regenerate responses
* [x] Retry responses
* [x] Rename chats
* [x] Delete confirmation
* [x] Search chats

---

## Phase 2 — Advanced Chat

Planned:

* [ ] Export Markdown
* [ ] Export JSON
* [ ] Chat menu
* [ ] Keyboard shortcuts
* [ ] Command palette
* [ ] Model selector
* [ ] Temperature control
* [ ] Max-token control
* [ ] Better error handling
* [ ] Message timestamps
* [ ] Chat import/export

---

## Phase 3 — Cloud Database

Planned:

* [ ] Cloudflare D1
* [ ] Persistent users
* [ ] Persistent chats
* [ ] Persistent messages
* [ ] User settings
* [ ] Usage records
* [ ] Server-side chat synchronization

---

## Phase 4 — Authentication

Planned:

* [ ] Sign up
* [ ] Login
* [ ] Logout
* [ ] Sessions
* [ ] User profile
* [ ] Password management
* [ ] Protected routes

---

## Phase 5 — File System

Planned:

* [ ] File upload
* [ ] PDF support
* [ ] TXT support
* [ ] Markdown support
* [ ] CSV support
* [ ] JSON support
* [ ] DOCX support
* [ ] File preview
* [ ] File deletion
* [ ] Cloudflare R2

---

## Phase 6 — RAG

Planned:

```text
Upload document
       ↓
R2
       ↓
Extract text
       ↓
Split into chunks
       ↓
Generate embeddings
       ↓
Vectorize
       ↓
Semantic search
       ↓
Relevant context
       ↓
Workers AI
       ↓
Answer
```

Features:

* [ ] Document chunking
* [ ] Embeddings
* [ ] Vectorize
* [ ] Semantic search
* [ ] Retrieval-Augmented Generation
* [ ] Chat with documents

---

## Phase 7 — AI Memory

Planned:

* [ ] Conversation memory
* [ ] User memory
* [ ] Relevant memory retrieval
* [ ] Memory management
* [ ] Memory privacy controls

---

## Phase 8 — Developer Platform

Planned:

* [ ] Developer dashboard
* [ ] API keys
* [ ] Public API
* [ ] API playground
* [ ] Usage statistics
* [ ] Token statistics
* [ ] Request logs
* [ ] Error logs
* [ ] Rate limiting
* [ ] API documentation

Future API:

```text
POST /api/v1/chat
```

Example:

```json
{
    "model": "@cf/meta/llama-3.2-1b-instruct",
    "messages": [
        {
            "role": "user",
            "content": "Hello ModelOnCloud"
        }
    ]
}
```

---

# Planned Final Product

```text
ModelOnCloud
│
├── Chat
│   ├── Streaming
│   ├── Markdown
│   ├── Code Highlighting
│   ├── Files
│   ├── RAG
│   ├── Memory
│   └── Model Selection
│
├── Account
│   ├── Sign Up
│   ├── Login
│   ├── Profile
│   └── Settings
│
├── Documents
│   ├── Upload
│   ├── Preview
│   ├── Search
│   └── RAG
│
└── Developer
    ├── API Keys
    ├── Playground
    ├── Usage
    ├── Logs
    └── API
```

---

# Contributing

Contributions are welcome.

## 1. Fork the repository

```powershell
git clone <YOUR_REPOSITORY_URL>
```

## 2. Create a branch

```powershell
git checkout -b feature/your-feature
```

## 3. Install dependencies

```powershell
npm install
```

## 4. Configure environment variables

Create:

```text
.env.local
```

and configure the required Cloudflare credentials.

## 5. Run the project

```powershell
npm run dev
```

## 6. Test the production build

```powershell
npm run build
```

## 7. Commit

```powershell
git add .
git commit -m "feat: add your feature"
```

## 8. Push

```powershell
git push origin feature/your-feature
```

Then create a Pull Request.

---

# License

This project is currently under development.

Add the project's chosen license here before distributing the project publicly.

---

# Author

**Sayan Basani**

Project:

**ModelOnCloud**

Built with:

```text
Next.js
React
TypeScript
Cloudflare Workers AI
```

---

## Project Status

ModelOnCloud is actively under development.

The current priority is to build a complete AI platform rather than only a basic chatbot.

The long-term goal is:

```text
Chat
+
Accounts
+
Cloud Storage
+
Documents
+
RAG
+
Memory
+
Developer API
+
Usage Analytics
```

into one unified AI platform.
