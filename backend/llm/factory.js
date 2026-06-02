// AI Attribution: Built with assistance from Claude Sonnet 4.6
// Used for: Factory Method and Strategy pattern implementation

const OllamaClient = require('./ollama');

function getLLMClient() {
  const backend = process.env.LLM_BACKEND || 'ollama';

  if (backend === 'ollama') return new OllamaClient();
  if (backend === 'local') {
    process.env.OLLAMA_URL = process.env.LOCAL_OLLAMA_URL;
    process.env.OLLAMA_MODEL = process.env.LOCAL_OLLAMA_MODEL;
    process.env.OLLAMA_API_KEY = '';
    return new OllamaClient();
  }

  throw new Error(`Unknown LLM backend: ${backend}`);
}

module.exports = getLLMClient;