# Public Scheme Eligibility Checker

A web tool to help users find government schemes they are eligible for, based on their details or natural language queries.

## Features
- Form-based input for user details (age, gender, income, occupation, caste, education, state, etc.)
- Natural language query support (e.g., "What schemes are available for a 23-year-old unemployed graduate from Kerala?")
- Rule-based eligibility engine
- Categorized scheme results with apply links
- (Optional) Multilingual support

## Tech Stack
- **Frontend:** React (Create React App)
- **Backend:** Python (Flask), spaCy for NLP
- **Database:** JSON (easy to migrate to PostgreSQL)

---

## Getting Started

### Backend Setup
1. **Install dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    ```
2. **Run the backend server:**
    ```bash
    python app.py
    ```
    The API will be available at `http://localhost:5000`.

### Frontend Setup
1. **Install dependencies:**
    ```bash
    cd frontend
    npm install --legacy-peer-deps
    ```
2. **Start the React app:**
    ```bash
    npm start
    ```
    The app will run at `http://localhost:3000`.

---

## API Endpoints
- `POST /schemes/match` — Match schemes by user details (JSON)
- `POST /schemes/query` — Match schemes by natural language query (JSON)

---

## Example Scheme Data
See `backend/schemes.json` for sample scheme rules and structure.

---

## To Do
- Add more schemes and eligibility rules
- Improve NLP extraction
- Add multilingual support
- Migrate to PostgreSQL (optional)