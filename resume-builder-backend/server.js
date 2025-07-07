// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate-summary', async (req, res) => {
  const { name, targetRole, yearsOfExperience, skills, experience } = req.body;

  const prompt = `Generate a professional resume summary for a person with the following details:

Name: ${name}
Target Role: ${targetRole}
Years of Experience: ${yearsOfExperience}
Skills: ${skills}
Experience: ${experience.map(e => `${e.position} at ${e.company} for ${e.duration}`).join('; ')}

Summary:`;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });
    const summary = completion.data.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
