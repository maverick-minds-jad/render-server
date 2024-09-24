import express from 'express';
import fetch from 'node-fetch'; 
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000; // Use the environment variable for deployment on Render

// Allow CORS from your InfinityFree domain
app.use(cors({
    origin: 'http://www.medz.great-site.net' // Replace with your actual InfinityFree domain
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Root route to handle GET request on "/"
app.get('/', (req, res) => {
    res.send('AI Chatbot Server is running');
});

// Endpoint to handle chatbot requests
app.post('/send', async (req, res) => {
    const userInput = req.body.userInput;
    
    try {
        // Call AI model server (use the correct public URL)
        const response = await fetch('http://192.168.29.2:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'lmstudio-community/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput }
                ],
                max_tokens: 1000,
                temperature: 0.5
            })
        });

        if (!response.ok) {
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
