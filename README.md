# Article Dashboard – BeyondChats Assignment

This project is a full-stack implementation of the BeyondChats assignment, completed across three phases using Laravel, NodeJS, and ReactJS.

---

## 🧩 Project Overview

The system performs the following:
- Scrapes articles from BeyondChats
- Stores and manages them via Laravel APIs
- Enhances articles using competitor content and an LLM via NodeJS
- Displays original and AI-enhanced articles in a responsive React UI

---

##  Architecture Overview

React Frontend
    |
Laravel API <----> MySQL Database
    |
NodeJS AI Service
(Search + Scrape + LLM)

##  Repository Structure
Article-Dashboard/
│
├── Laravel-API/ # Laravel Backend (Phase 1)
│ ├── app/
│ ├── routes/
│ ├── database/
│ └── .env.example
│
├── Article_Dashboard-Node/ # NodeJS AI Service (Phase 2)
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ └── .env.example
│
├── Article_Dashboard-UI/ # React Frontend (Phase 3)
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md


---

##  Phase 1 – Laravel 

### Implemented Features:
- Scraped the **5 oldest articles** from BeyondChats blog
- Stored articles in MySQL database
- Created full CRUD APIs:
  - `GET /api/articles`
  - `GET /api/articles/{id}`
  - `POST /api/articles`
  - `PUT /api/articles/{id}`
  - `DELETE /api/articles/{id}`
- Added pagination and filtering (original / AI-generated)

---

##   Phase 2 – NodeJS AI Service 

### Implemented Workflow:
1. Fetch latest or selected article from Laravel API
2. Search article title on Google (fallback to DuckDuckGo)
3. Scrape content from top 2 ranking articles
4. Send original + competitor content to LLM
5. Generate AI-enhanced article
6. Store new article via Laravel API with:
   - `is_ai_generated = true`
   - `parent_article_id`
   - `references[]`

### Key Highlights:
- Retry-safe logic
- Duplicate AI generation prevention
- Clear logging for debugging
- Environment-based configuration

---

##  Phase 3 – ReactJS Frontend 

### UI Features:
- Responsive dashboard (mobile + desktop)
- Filter by:
  - All
  - Original
  - AI Generated
- Pagination support
- Auto-refresh every 30 seconds
- Modal to generate AI article
- Article detail view with references
- Professional UI & UX

---

##  Local Setup Instructions

### 1️ Laravel API
```bash
cd Article_Dashboard-API
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

### NodeJS AI Service

cd Article_Dashboard-Node
npm install
cp .env.example .env
npm start

### React Frontend

cd Article_Dashboard-UI
npm install
npm start

Live URLs (Production)

Frontend (React UI)
👉 https://dashboard-article.up.railway.app/

NodeJS AI Service
👉 https://node-api-production-eb02.up.railway.app/

Laravel API
👉 https://laravelapi-production-2fe5.up.railway.app/

##  Deployment & Database Note

All three services (React, Laravel, NodeJS) are deployed on Railway and accessible 
via public URLs.

However, due to database connectivity limitations on Railway at the time of submission,
the Laravel API is unable to fetch data from the production database.

### Important Clarification:
- The complete system works correctly in local setup
- Articles are scraped, stored, AI-generated, and displayed successfully when running locally
- The deployed services demonstrate correct build, routing, and API structure

### Reason for DB Issue:
Railway requires additional configuration for persistent MySQL connections 
which could not be finalized within the submission timeline.

This does not affect the correctness of the implementation or data flow logic.

### Local URLs (Fully Functional)
- React Frontend: http://localhost:3001
- Laravel API: http://127.0.0.1:8000/api/articles
- NodeJS AI Service: http://localhost:3000
- Database: MySQL (phpMyAdmin )

##  Data Flow Overview

1. Laravel scrapes the 5 oldest articles from BeyondChats
2. Articles are stored in MySQL
3. NodeJS fetches the latest article from Laravel API
4. NodeJS searches Google / DuckDuckGo
5. Scrapes competitor articles
6. Calls LLM to rewrite article
7. Saves AI-enhanced article back to Laravel
8. React UI fetches and displays both original and AI articles