/* ================================
   RAZET AI ASSISTANT
   Front-end interface
   ================================= */

document.addEventListener("DOMContentLoaded", function () {
    // ================================
    // CONFIGURATION
    // ================================

    const AI_WEBHOOK_URL =
        "https://ai.razet.work/webhook/razet-ai";

    // ================================
    // SESSION
    // ================================

    let sessionId = localStorage.getItem("razetSessionId");

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("razetSessionId", sessionId);
    }

    // ================================
    // ELEMENTS
    // ================================

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

    // ================================
    // OPEN CHAT
    // ================================

    function openChat() {
        chatWindow.classList.add("active");

        if (input) {
            setTimeout(function () {
                input.focus();
            }, 100);
        }
    }

    // ================================
    // CLOSE CHAT
    // ================================

    function closeChat() {
        chatWindow.classList.remove("active");
    }

    // ================================
    // AI FLOATING BUTTON
    // ================================

    chatButton.addEventListener("click", function (event) {
        event.stopPropagation();
        openChat();
    });

    // ================================
    // LET'S TALK BUTTON
    // ================================

    if (letsTalkButton) {
        letsTalkButton.addEventListener("click", function (event) {
            event.preventDefault();
            openChat();
        });
    }

    // ================================
    // CLOSE BUTTON
    // ================================

    if (closeButton) {
        closeButton.addEventListener("click", function (event) {
            event.stopPropagation();
            closeChat();
        });
    }

    // ================================
    // PREVENT CHAT CLICK FROM CLOSING
    // ================================

    chatWindow.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // ================================
    // CLICK OUTSIDE CHAT
    // ================================

    document.addEventListener("click", function (event) {
        if (
            chatWindow.classList.contains("active") &&
            !chatWindow.contains(event.target) &&
            !chatButton.contains(event.target)
        ) {
            closeChat();
        }
    });

    // ================================
    // ESCAPE KEY
    // ================================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeChat();
        }
    });

    // ================================
    // FORMAT AI RESPONSE SAFELY
    // ================================

    function formatAIResponse(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>");
    }

    // ================================
    // ADD MESSAGE
    // ================================

    function addMessage(text, sender) {
        if (!messages) {
            return;
        }

        const message = document.createElement("div");

        message.classList.add(
            "razet-ai-message",
            sender
        );

        message.innerHTML = formatAIResponse(text);

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;
    }

    // ================================
    // SEND MESSAGE
    // ================================

    function sendMessage() {
        if (!input) {
            return;
        }

        const text = input.value.trim();

        if (!text) {
            return;
        }

        // Show user's message
        addMessage(text, "user");

        // Clear input
        input.value = "";

        // Disable send button while processing
        if (sendButton) {
            sendButton.disabled = true;
        }

        // Send message to n8n through Cloudflare
        fetch(AI_WEBHOOK_URL, {
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
                if (!response.ok) {
                    throw new Error(
                        "HTTP error: " + response.status
                    );
                }

                return response.json();
            })

            .then(function (data) {
                console.log(
                    "Response from Razet AI:",
                    data
                );

                const aiResponse =
                    data.message ||
                    data.output ||
                    data.response ||
                    "I received your message.";

                addMessage(
                    aiResponse,
                    "bot"
                );
            })

            .catch(function (error) {
                console.error(
                    "Razet AI connection error:",
                    error
                );

                addMessage(
                    "Sorry, I couldn't connect to the Razet AI system. Please try again or use the contact page to connect with the Razet Team.",
                    "bot"
                );
            })

            .finally(function () {
                // Re-enable send button
                if (sendButton) {
                    sendButton.disabled = false;
                }

                if (input) {
                    input.focus();
                }
            });
    }

    // ================================
    // SEND BUTTON
    // ================================

    if (sendButton) {
        sendButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();
                sendMessage();
            }
        );
    }

    // ================================
    // ENTER KEY
    // ================================

    if (input) {
        input.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage();
                }
            }
        );
    }
});