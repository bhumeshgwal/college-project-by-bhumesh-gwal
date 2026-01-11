// ========================================
// AI CHAT - Cohere (FREE & WORKING)
// ========================================

const AI_CONFIG = {
  apiKey: 'aa03FFBl6CzD3lAWAnhsuFfBB7P4bC1IhVAYEzcd',
  model: 'command-r'
};

class AIChat {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.injectHTML();
    this.cacheElements();
    this.attachEvents();
    console.log('✅ AI Chat ready');
  }

  injectHTML() {
    const html = `
      <button id="aiChatBtn" class="ai-chat-btn">
        <i class="fa-solid fa-robot"></i>
      </button>
      <div id="aiChatWindow" class="ai-chat-window">
        <div class="chat-header">
          <h3>VIVEKANANDA AI</h3>
          <button id="closeChatBtn" class="close-chat-btn">&times;</button>
        </div>
        <div id="chatMessages" class="chat-messages">
          <div class="message ai">Namaste! 🙏 Ask me anything about Swami Vivekananda!</div>
        </div>
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <input type="text" id="chatInput" class="chat-input" placeholder="Ask about Vivekananda..." autocomplete="off">
            <button id="sendBtn" class="send-btn">Send</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  cacheElements() {
    this.chatBtn = document.getElementById('aiChatBtn');
    this.chatWindow = document.getElementById('aiChatWindow');
    this.closeBtn = document.getElementById('closeChatBtn');
    this.sendBtn = document.getElementById('sendBtn');
    this.chatInput = document.getElementById('chatInput');
    this.messagesDiv = document.getElementById('chatMessages');
  }

  attachEvents() {
    this.chatBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    [this.chatBtn, this.closeBtn, this.sendBtn].forEach(el => {
      el.addEventListener('mouseenter', () => {
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.classList.remove('hover');
      });
    });
  }

  toggleChat() {
    this.chatWindow.classList.toggle('active');
    if (this.chatWindow.classList.contains('active')) this.chatInput.focus();
  }

  closeChat() {
    this.chatWindow.classList.remove('active');
  }

  async sendMessage() {
  const userMessage = this.chatInput.value.trim();
  if (!userMessage) return;

  this.chatInput.disabled = true;
  this.sendBtn.disabled = true;
  this.addMessage(userMessage, 'user');
  this.chatInput.value = '';
  const loadingId = this.addMessage('Thinking...', 'ai', true);

  try {
    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer aa03FFBl6CzD3lAWAnhsuFfBB7P4bC1IhVAYEzcd`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-08-2024',
        messages: [{
          role: 'user',
          content: `Expert on Vivekananda. Answer in 100 words: ${userMessage}`
        }]
      })
    });

    const data = await response.json();
    this.removeMessage(loadingId);

    if (data.message?.content?.[0]?.text) {
      this.addMessage(data.message.content[0].text, 'ai');
    } else {
      this.addMessage('Error. Check console.', 'ai');
      console.log(data);
    }
  } catch (error) {
    this.removeMessage(loadingId);
    this.addMessage('Error: ' + error.message, 'ai');
  }

  this.chatInput.disabled = false;
  this.sendBtn.disabled = false;
  this.chatInput.focus();
}

  addMessage(text, sender, isLoading = false) {
    const msgId = Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender} ${isLoading ? 'loading' : ''}`;
    msgDiv.id = `msg-${msgId}`;
    msgDiv.textContent = text;
    this.messagesDiv.appendChild(msgDiv);
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    return msgId;
  }

  removeMessage(msgId) {
    const msg = document.getElementById(`msg-${msgId}`);
    if (msg) msg.remove();
  }
}

new AIChat();
