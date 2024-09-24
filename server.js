import express from 'express';
import fetch from 'node-fetch'; // Ensure you install node-fetch (v2 for CommonJS or v3 for ESM)
import cors from 'cors';

const app = express();
const port = 3000;

// Allow CORS from your InfinityFree domain
app.use(cors({
    origin: 'http://www.medz.great-site.net' // Replace with your actual InfinityFree domain
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle chatbot requests
app.post('/send', async (req, res) => {
    const userInput = req.body.userInput;
    
    try {
        // Call AI model server
        const response = await fetch('http://192.168.29.2:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'lmstudio-community/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf', // Ensure this model is correct
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput }
                ],
                max_tokens: 1000,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            // Handle non-OK responses more granularly
            return res.status(response.status).send(`AI response failed with status ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Send AI response back to frontend
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
