import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Ensure you install node-fetch (v2 for CommonJS or v3 for ESM).
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const response = await fetch('http://localhost:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'lmstudio-community/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf', // Change this model if needed.
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput }
                ],
                max_tokens: 1000,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch AI response');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
