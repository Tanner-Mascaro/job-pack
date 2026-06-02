const axios = require('axios');

class OllamaClient {
  constructor() {
    this.url = process.env.OLLAMA_URL;
    this.model = process.env.OLLAMA_MODEL;
    this.apiKey = process.env.OLLAMA_API_KEY;
  }

  async generate(prompt) {
    const response = await axios.post(`${this.url}/api/chat`, {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.message.content;
  }
}

module.exports = OllamaClient;