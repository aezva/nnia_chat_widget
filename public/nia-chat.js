document.addEventListener("DOMContentLoaded", function () {
  const container = document.createElement("div");
  container.id = "nia-widget-container";

  container.innerHTML = `
    <div id="nia-welcome-bubble">¡Hola! ¿En qué puedo ayudarte?</div>
    <button id="nia-floating-icon"></button>
    <div id="nia-chat-box">
      <div id="nia-chat-header">
        <div style="display: flex; align-items: center;">
          <img src="https://aezva.com/wp-content/uploads/2025/04/web-200x200-1.webp" />
          NIA Assistant
        </div>
        <button id="nia-minimize-button">─</button>
      </div>
      <div id="nia-chat-messages"></div>
      <div id="nia-chat-input-area">
        <input type="text" id="nia-chat-input" placeholder="Escribe un mensaje..." />
        <button id="nia-send-button">Enviar</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const floatingIcon = document.getElementById("nia-floating-icon");
  const chatBox = document.getElementById("nia-chat-box");
  const sendButton = document.getElementById("nia-send-button");
  const input = document.getElementById("nia-chat-input");
  const messages = document.getElementById("nia-chat-messages");
  const minimizeBtn = document.getElementById("nia-minimize-button");
  const welcomeBubble = document.getElementById("nia-welcome-bubble");

  let hasInteracted = false;
  let welcomeSent = false;

  function addMessage(text, from) {
    const div = document.createElement("div");
    div.className = from === "nia" ? "nia-message" : "user-message";
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function openChat() {
    chatBox.style.display = "flex";
    welcomeBubble.style.display = "none";
    if (!welcomeSent) {
      addMessage("¡Hola! ¿En qué puedo ayudarte?", "nia");
      welcomeSent = true;
    }
  }

  function minimizeChat() {
    chatBox.style.display = "none";
    if (!hasInteracted) {
      welcomeBubble.style.display = "block";
    }
  }

  function sendMessage() {
    const text = input.value.trim();
    if (text !== "") {
      addMessage(text, "user");
      input.value = "";
      hasInteracted = true;
    }
  }

  floatingIcon.addEventListener("click", openChat);
  welcomeBubble.addEventListener("click", openChat);
  minimizeBtn.addEventListener("click", minimizeChat);
  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Mostrar burbuja de bienvenida si no hay interacción previa
  if (!hasInteracted) {
    welcomeBubble.style.display = "block";
  }
});
