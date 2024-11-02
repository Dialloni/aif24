
document.getElementById('send-btn').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    try {
        const queryparams = new URLSearchParams({ ui: userInput });
        const completion = await (await fetch('./openai' + '?' + queryparams.toString())).text();

        const botMessage = completion.choices[0].message.content;
        appendMessage('bot', botMessage);
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Sorry, something went wrong.');
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Example usage of appendMessage with a callback
appendMessage('user', 'Hello, this is a user message!', function() {
    console.log('Message appended to the chat box.');
});