require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getLLMClient = require('./llm/factory');
const { saveDraft, getDrafts, getDraft, updateDraft } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', backend: process.env.LLM_BACKEND });
});

// Generate all three artifacts
app.post('/api/generate', async (req, res) => {
  const { job_description, candidate_profile, job_title } = req.body;
  
  try {
    const llm = getLLMClient();

    const resume = await llm.generate(`
      You are a professional resume writer. 
      Write a tailored resume in markdown format with sections: Summary, Skills, Experience, Education.
      Prioritize keywords from the job description.
      Job description: ${job_description}
      Candidate profile: ${candidate_profile}
    `);

    const coverLetter = await llm.generate(`
      You are a professional cover letter writer.
      Write a tailored cover letter addressed to the hiring manager.
      Job description: ${job_description}
      Candidate profile: ${candidate_profile}
    `);

    const infographic = await llm.generate(`
      Analyze this company and job. Return a JSON object with:
      { "pros": ["...", "..."], "cons": ["...", "..."], "fit_score": 8 }
      Only return JSON, nothing else.
      Job description: ${job_description}
      Candidate profile: ${candidate_profile}
    `);

    const id = saveDraft({
      job_title: job_title || 'Untitled',
      job_description,
      candidate_profile,
      resume,
      cover_letter: coverLetter,
      infographic
    });

    res.json({ id, resume, cover_letter: coverLetter, infographic });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all drafts
app.get('/api/drafts', (req, res) => {
  res.json(getDrafts());
});

// Get single draft
app.get('/api/drafts/:id', (req, res) => {
  const draft = getDraft(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });
  res.json(draft);
});

// Update draft
app.put('/api/drafts/:id', (req, res) => {
  updateDraft(req.params.id, req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
