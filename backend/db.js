const Database = require('better-sqlite3');
const db = new Database('drafts.db');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_title TEXT,
    job_description TEXT,
    candidate_profile TEXT,
    resume TEXT,
    cover_letter TEXT,
    infographic TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function saveDraft(data) {
  const stmt = db.prepare(`
    INSERT INTO drafts (job_title, job_description, candidate_profile, resume, cover_letter, infographic)
    VALUES (@job_title, @job_description, @candidate_profile, @resume, @cover_letter, @infographic)
  `);
  const result = stmt.run(data);
  return result.lastInsertRowid;
}

function getDrafts() {
  return db.prepare('SELECT * FROM drafts ORDER BY created_at DESC').all();
}

function getDraft(id) {
  return db.prepare('SELECT * FROM drafts WHERE id = ?').get(id);
}

function updateDraft(id, data) {
  const stmt = db.prepare(`
    UPDATE drafts SET
      job_title = @job_title,
      resume = @resume,
      cover_letter = @cover_letter,
      infographic = @infographic
    WHERE id = @id
  `);
  stmt.run({ ...data, id });
}

module.exports = { saveDraft, getDrafts, getDraft, updateDraft };