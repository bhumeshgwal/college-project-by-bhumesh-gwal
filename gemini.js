// ========================================
// GEMINI AI CHAT - Reusable Module
// ========================================

const GEMINI_CONFIG = {
  apiKey: 'AIzaSyCJFf35xLDWwPmX2SCbiZmaq-RRUuLy8SQ',
  model: 'gemini-pro',
  systemPrompt: `You are an expert on Swami Vivekananda's life, teachings, and philosophy.

CONTEXT:
- Born 1863 in Calcutta as Narendranath Datta
- Disciple of Sri Ramakrishna Paramahamsa
- Famous 1893 Chicago Parliament speech: "Sisters and Brothers of America"
- Founded Ramakrishna Mission in 1897
- Teachings: Practical Vedanta, Four Yogas (Karma, Bhakti, Raja, Jnana)
- Key books: Raja Yoga, Karma Yoga, Bhakti Yoga, Jnana Yoga
- Emphasized: "Arise, awake, and stop not till the goal is reached"
- Died 1902 at age 39 (Mahasamadhi at Belur Math)

Answer questions accurately in under 150 words. Use a warm, educational tone. Include relevant quotes when appropriate.`
};

class GeminiChat {
  constructor() {
    this.chatBtn = null;
    this.chatWindow = null;
    this.closeBtn = null;
    this.sendBtn = null;
    this.chatInput = null;
    this.messagesDiv = null;
    this.init();
  }

  init() {
    // Wait for DOM to load
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
    console.log('✅ Gemini AI Chat initialized');
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
          <div class="message ai">
            Namaste! 🙏 I'm an AI assistant trained on Swami Vivekananda's teachings. Ask me anything!
          </div>
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

    // Cursor hover effects
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
    if (this.chatWindow.classList.contains('active')) {
      this.chatInput.focus();
    }
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
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${GEMINI_CONFIG.systemPrompt}\n\nQuestion: ${userMessage}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      this.removeMessage(loadingId);

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        this.addMessage(data.candidates[0].content.parts[0].text, 'ai');
      } else if (data.error) {
        this.addMessage(`Error: ${data.error.message}`, 'ai');
      } else {
        this.addMessage('Sorry, please try again.', 'ai');
      }
    } catch (error) {
      this.removeMessage(loadingId);
      this.addMessage('Connection error. Please try again.', 'ai');
      console.error('Gemini API Error:', error);
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

// Auto-initialize when script loads
new GeminiChat();