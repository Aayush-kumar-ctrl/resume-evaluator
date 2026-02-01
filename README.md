# Resume Evaluator

A toolkit and service for automatically evaluating and scoring resumes. It extracts text from uploaded resumes (PDF, DOCX, TXT), analyzes structure and content against configurable rubrics and best-practice rules, and returns a numeric score and actionable feedback to help candidates improve their resumes.

Features
- Extract text from PDF, DOCX, and plain-text resumes
- Configurable scoring rubrics (format, relevance, achievements, keywords,ATS-compatibility)
- Human-readable feedback and machine-friendly JSON output
- CLI, HTTP API, and optional web UI integrations
- Dockerized for easy deployment
- Test suite and CI-ready configuration

Prerequisites
- Python 3.9+ (or the runtime your project uses)
- pip (for Python projects) or your package manager of choice
- Docker (optional, recommended for production)

Clone and install
```bash
git clone https://github.com/Aayush-kumar-ctrl/resume-evaluator.git
cd resume-evaluator

# Python example
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run locally
```bash
# Start the API server (example)
# Replace with the actual command your repo provides
python -m resume_evaluator.server --port 8000
```

Docker
```bash
# Build
docker build -t resume-evaluator:latest .

# Run
docker run -p 8000:8000 resume-evaluator:latest
```

Usage

CLI
```bash
# Evaluate a resume file and print JSON output
resume-eval evaluate ./samples/jane_doe_resume.pdf --output json
```

HTTP API
POST /evaluate
- Content-Type: multipart/form-data
- Body: file field named `resume` (PDF/DOCX/TXT)
- Optional JSON body or query params:
  - `rubric` — select a scoring rubric profile
  - `language` — language of resume content

Example (curl)
```bash
curl -X POST "http://localhost:8000/evaluate" \
  -F "resume=@./samples/jane_doe_resume.pdf" \
  -F "rubric=default"
```

Example JSON response
```json
{
  "score": 78,
  "breakdown": {
    "format": 18,
    "content": 28,
    "achievements": 12,
    "keywords": 10,
    "readability": 10
  },
  "feedback": [
    "Add quantifiable achievements to Work Experience bullets",
    "Include a short professional summary",
    "Reduce header font size for better ATS parsing"
  ],
  "metadata": {
    "pages": 2,
    "words": 742,
    "extracted_text_length": 4280
  }
}
```

Web UI
- If your repo includes a frontend, mention the URL or run instructions here.
- Integrate the API via the /evaluate endpoint to provide live feedback in the browser.

How it works (high level)
1. Ingest: Accept resume files (PDF/DOCX/TXT) and convert to plain text.
2. Parse: Detect sections (Contact, Summary, Experience, Education, Skills, Projects).
3. Analyze: Apply rule-based checks and/or ML models to assess:
   - Format & structure
   - Relevance to job titles / keywords
   - Presence of achievements and metrics
   - ATS-compatibility checks (fonts, headers, images)
4. Score: Aggregate checks into a configurable rubric and produce a final score.
5. Feedback: Generate human-readable suggestions and machine-friendly explanations.

Configuration & scoring
- Scoring weights are stored in a configuration file (e.g. config/rubrics.yml).
- Example rubric keys:
  - format: 20
  - content: 40
  - achievements: 20
  - keywords: 10
  - readability: 10
- You can add custom rubrics and adjust weights per job-type or industry.


Contact
- Maintainainer: Aayush-kumar-ctrl
- Email: proudindian519@gmai.com
