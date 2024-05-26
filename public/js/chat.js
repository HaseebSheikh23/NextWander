document.addEventListener("DOMContentLoaded", function() {
    const chatForm = document.getElementById('chat-form');
    const chatMessage = document.getElementById('chat-message');
    let loadingMessageId = 0; // Unique ID for loading messages

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = chatMessage.value.trim();
        if (!message) return;

        appendMessage(message, 'user');
        chatMessage.value = ""; // Clear the input field

        // Show loading indicator
        const currentLoadingId = ++loadingMessageId;
        appendMessage("Thinking...", 'loading', currentLoadingId);

        fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            // Replace loading indicator with actual response
            updateMessage(data.message, 'bot', currentLoadingId);
        })
        .catch(error => {
            console.error("Error:", error);
            updateMessage("Failed to fetch response.", 'error', currentLoadingId);
        });
    });

    function appendMessage(message, sender, messageId = null) {
        const chatHistory = document.getElementById('chat-history');
        const messageElement = document.createElement("li");
        if (messageId) messageElement.id = `msg-${messageId}`; // Set unique ID if provided
        messageElement.classList.add(sender);
    
        // Determine the image source based on the sender
        let imgSrc = '';
        if (sender === 'user') {
            imgSrc = '/user.jpeg';
        } else if (sender === 'loading' || sender === 'bot') {
            imgSrc = '/bot.jpeg'; // Use bot image for both bot and loading messages
        }
    
        // Construct the message element HTML
        messageElement.innerHTML = `
            <img src="${imgSrc}" alt="${sender}" style="${sender === 'loading' ? 'visibility: visible;' : ''}">
            <p>${message}</p>
        `;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    }

    function updateMessage(newMessage, newSender, messageId) {
        const messageElement = document.getElementById(`msg-${messageId}`);
        if (!messageElement) return; // If the message element doesn't exist, exit
    
        // Safely encode the message to prevent HTML injection
        // Then replace newline characters with <br> for HTML display
        let safeMessage = newMessage
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>");
    
        // Update the message content and class
        messageElement.classList.remove('loading');
        messageElement.classList.add(newSender);
        messageElement.innerHTML = `
            <img src="${newSender === 'user' ? '/user.jpeg' : '/bot.jpeg'}" alt="${newSender}">
            <p>${safeMessage}</p>
        `;
    }
});