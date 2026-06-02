const axios = require('axios');

class ClaudeClient {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = 'claude-sonnet-4-20250514';
  }

  async generate(prompt) {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });
    return response.data.content[0].text;
  }
}

module.exports = ClaudeClient;