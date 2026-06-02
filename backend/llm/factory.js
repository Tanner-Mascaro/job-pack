const OllamaClient = require('./ollama');
const ClaudeClient = require('./claude');

function getLLMClient() {
  const backend = process.env.LLM_BACKEND || 'ollama';
  
  if (backend === 'ollama') return new OllamaClient();
  if (backend === 'claude') return new ClaudeClient();
  
  throw new Error(`Unknown LLM backend: ${backend}`);
}

module.exports = getLLMClient;