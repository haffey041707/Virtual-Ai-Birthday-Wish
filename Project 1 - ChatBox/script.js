const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

let isChatActive = true;
let isBotTyping = false;
const typingDelayMs = 22;
const typingStartDelayMs = 180;

function normalizeText(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function isExitCommand(text) {
  if (text === "bye") {
    return true;
  } else if (text === "exit") {
    return true;
  } else if (text === "quit") {
    return true;
  } else if (text === "goodbye") {
    return true;
  } else if (text === "see you") {
    return true;
  } else {
    return false;
  }
}

function getBotResponse(text) {
  if (text === "hi" || text === "hello" || text === "hey") {
    return "hi how can i help you";
  } else if (text === "how are you") {
    return "im fine and you";
  } else if (
    text === "im good" ||
    text === "i am good" ||
    text === "fine" ||
    text === "im fine" ||
    text === "i am fine" ||
    text === "i'm fine"
  ) {
    return "excellent..";
  } else if (
    text === "what is your name" ||
    text === "whats your name" ||
    text === "what's your name"
  ) {
    return "i am Eva Ai Chat Box.";
  } else if (text === "help") {
    return "Try Hello, How are you, Whats your name, or Bye.";
  } else if (text === "thank you" || text === "thanks") {
    return "welcome";
  } else {
    return "I do not understand. Type help.";
  }
}

function addMessage(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${role}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function setInputState(disabled) {
  userInput.disabled = disabled;
  chatForm.querySelector("button").disabled = disabled;
}

async function addBotTypingMessage(text) {
  const bubble = document.createElement("div");
  bubble.className = "msg bot typing";
  bubble.textContent = "";
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  await wait(typingStartDelayMs);

  for (const char of text) {
    bubble.textContent += char;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    await wait(typingDelayMs);
  }

  bubble.classList.remove("typing");
}

function endChat() {
  isChatActive = false;
  setInputState(true);
  userInput.placeholder = "Chat ended. Refresh to chat again.";
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isChatActive || isBotTyping) {
    return;
  }

  const rawText = userInput.value;
  const cleanedText = normalizeText(rawText);

  if (cleanedText === "") {
    isBotTyping = true;
    setInputState(true);
    await addBotTypingMessage("Please type something so I can respond.");
    isBotTyping = false;
    if (isChatActive) {
      setInputState(false);
      userInput.focus();
    }
    userInput.value = "";
    return;
  }

  addMessage(rawText.trim(), "user");
  userInput.value = "";
  isBotTyping = true;
  setInputState(true);

  if (isExitCommand(cleanedText)) {
    await addBotTypingMessage("Good bye. Happy to talk you.");
    isBotTyping = false;
    endChat();
    return;
  }

  const reply = getBotResponse(cleanedText);
  await addBotTypingMessage(reply);
  isBotTyping = false;
  setInputState(false);
  userInput.focus();
});
