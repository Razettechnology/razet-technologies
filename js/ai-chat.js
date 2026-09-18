/* ================================
   RAZET AI ASSISTANT
   Front-end interface
   ================================ */

document.addEventListener("DOMContentLoaded", function () {

    // Create a unique conversation ID for this visitor
    let sessionId = localStorage.getItem("razetSessionId");

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("razetSessionId", sessionId);
}

    const chatButton = document.getElementById("razet-ai-button");
    const chatWindow = document.getElementById("razet-ai-chat");
    const closeButton = document.getElementById("razet-ai-close");
    const input = document.getElementById("razet-ai-input");
    const sendButton = document.getElementById("razet-ai-send");
    const messages = document.getElementById("razet-ai-messages");
    const letsTalkButton = document.getElementById("lets-talk-button");

    if (!chatButton || !chatWindow) {
        return;
    }

            // Open chat
            function openChat() {
                chatWindow.classList.add("active");
                input.focus();
            }

            chatButton.addEventListener("click", function () {
                openChat();
            });

            // Let's Talk button opens AI Assistant
            if (letsTalkButton) {
                letsTalkButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    openChat();
                });
            }

            // Close chat
            if (closeButton) {
                closeButton.addEventListener("click", function () {
                    chatWindow.classList.remove("active");
                });
            }

function formatAIResponse(text) {
    return text
        // Escape HTML for safety
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // Line breaks
        .replace(/\n/g, "<br>");
}

    // Add a message to the chat
    function addMessage(text, sender) {
        const message = document.createElement("div");

        message.classList.add(
            "razet-ai-message",
            sender
        );

        message.innerHTML = formatAIResponse(text);

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;
    }

    // Send message
    function sendMessage() {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        // Show user's message
        addMessage(text, "user");

        // Clear input
        input.value = "";

        /*
         * Temporary response.
         * Later, this will be replaced with
         * the n8n AI workflow.
         */

        // Send message to n8n
fetch("https://ability-decreased-arranged-stamp.trycloudflare.com/webhook/razet-ai", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
    message: text,
    sessionId: sessionId
    })
})
.then(function (response) {
    return response.json();
})
.then(function (data) {

    console.log("Response from n8n:", data);

    addMessage(
        data.message || "I received your message.",
        "bot"
    );

})
.catch(function (error) {

    console.error("n8n connection error:", error);

    addMessage(
        "Sorry, I couldn't connect to the Razet AI system. Please try again or use the contact page to connect with the Razet Team.",
        "bot"
    );

});
    }

    // Send button
    sendButton.addEventListener("click", sendMessage);

    // Enter key
    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    });

});