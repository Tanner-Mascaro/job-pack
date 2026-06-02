const API = window.location.origin;

async function generate() {
  const jobTitle = document.getElementById('job-title').value;
  const jobDescription = document.getElementById('job-description').value;
  const candidateProfile = document.getElementById('candidate-profile').value;

  if (!jobDescription || !candidateProfile) {
    document.getElementById('error').textContent = 'Please fill in both fields.';
    return;
  }

  document.getElementById('error').textContent = '';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('generate-btn').disabled = true;
  document.getElementById('output').style.display = 'none';

  try {
    const res = await fetch(`${API}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title: jobTitle,
        job_description: jobDescription,
        candidate_profile: candidateProfile
      })
    });

    const data = await res.json();

    document.getElementById('resume-output').textContent = data.resume;
    document.getElementById('cover-letter-output').textContent = data.cover_letter;

    try {
      const infographic = JSON.parse(data.infographic);
      renderInfographic(infographic);
    } catch {
      document.getElementById('infographic-output').textContent = data.infographic;
    }

    document.getElementById('output').style.display = 'block';
    loadDrafts();

  } catch (err) {
    document.getElementById('error').textContent = 'Error: ' + err.message;
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('generate-btn').disabled = false;
  }
}

function renderInfographic(data) {
  const container = document.getElementById('infographic-output');
  container.innerHTML = `
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;background:#f0fdf4;padding:15px;border-radius:8px;border:1px solid #86efac;">
        <h3 style="color:#16a34a;margin-top:0;">✅ Pros</h3>
        <ul>${data.pros.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div style="flex:1;min-width:200px;background:#fef2f2;padding:15px;border-radius:8px;border:1px solid #fca5a5;">
        <h3 style="color:#dc2626;margin-top:0;">❌ Cons</h3>
        <ul>${data.cons.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>
    </div>
    <div style="margin-top:15px;font-size:18px;font-weight:bold;">
      Fit Score: ${data.fit_score}/10
    </div>
  `;
}

function downloadPDF(type) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = document.getElementById(`${type}-output`).textContent;
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 15, 15);
  doc.save(`${type}.pdf`);
}

async function loadDrafts() {
  const res = await fetch(`${API}/api/drafts`);
  const drafts = await res.json();
  const container = document.getElementById('drafts');
  container.innerHTML = drafts.map(d => `
    <div class="draft-item" onclick="loadDraft(${d.id})">
      <b>${d.job_title}</b> — ${new Date(d.created_at).toLocaleString()}
    </div>
  `).join('');
}

async function loadDraft(id) {
  const res = await fetch(`${API}/api/drafts/${id}`);
  const draft = await res.json();
  document.getElementById('job-title').value = draft.job_title;
  document.getElementById('job-description').value = draft.job_description;
  document.getElementById('candidate-profile').value = draft.candidate_profile;
  document.getElementById('resume-output').textContent = draft.resume;
  document.getElementById('cover-letter-output').textContent = draft.cover_letter;
  try {
    renderInfographic(JSON.parse(draft.infographic));
  } catch {
    document.getElementById('infographic-output').textContent = draft.infographic;
  }
  document.getElementById('output').style.display = 'block';
}

loadDrafts();