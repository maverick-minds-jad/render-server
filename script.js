document.getElementById('chatForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await sendMessage();
});

document.getElementById('userInput').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatContent = document.getElementById('chatContent');

    // Append user message with prefix
    const userMessage = document.createElement('div');
    userMessage.className = 'chatMessage userMessage';
    userMessage.textContent = 'User: ' + userInput;
    chatContent.appendChild(userMessage);

    // Clear user input
    document.getElementById('userInput').value = '';

    // Scroll to bottom
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ userInput: userInput })
        });

        const responseContainer = document.createElement('div');
        responseContainer.className = 'chatMessage response';

        if (response.ok) {
            const data = await response.json();
            responseContainer.textContent = 'Llama 3.1: ' + data.choices[0].message.content;
        } else {
            responseContainer.textContent = 'Llama 3.1: Error: ' + response.statusText;
        }

        chatContent.appendChild(responseContainer);
        chatContent.scrollTop = chatContent.scrollHeight;
    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'chatMessage response';
        errorMessage.textContent = 'Llama 3.1: Error occurred: ' + error.message;
        chatContent.appendChild(errorMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}
