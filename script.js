// Clear chatbot history on page load
localStorage.removeItem('vastraaChatHistory');




// Mobile Menu Toggle with Animation
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('navCategories').classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Enhanced Chatbot with AI Responses
let chatHistory = JSON.parse(localStorage.getItem('vastraaChatHistory')) || [];
let isTyping = false;

function toggleChatbot() {
  const chatbot = document.getElementById('chatbot');
  chatbot.style.display = chatbot.style.display === 'flex' ? 'none' : 'flex';
  
  if (chatbot.style.display === 'flex') {
    loadChatHistory();
    document.getElementById('chat-input').focus();
    updateChatbotPosition();
  }
}

// Auto-position chatbot above mobile bottom nav
function updateChatbotPosition() {
  const chatbot = document.getElementById('chatbot');
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  if (window.innerWidth <= 768 && bottomNav) {
    chatbot.style.bottom = `${bottomNav.offsetHeight + 20}px`;
  } else {
    chatbot.style.bottom = '100px';
  }
}

window.addEventListener('resize', updateChatbotPosition);

// Enhanced loadChatHistory with rich media support
function loadChatHistory() {
  const body = document.getElementById('chat-body');
  body.innerHTML = '';
  
  if (chatHistory.length === 0) {
    addWelcomeMessage(body);
  } else {
    chatHistory.forEach(msg => {
      if (msg.type === 'product') {
        addProductMessage(body, msg);
      } else {
        addTextMessage(body, msg);
      }
    });
    body.scrollTop = body.scrollHeight;
  }
}

function addWelcomeMessage(container) {
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'message bot';
  welcomeMsg.innerHTML = `
    <div class="chatbot-welcome">
      <div class="chatbot-avatar">
        <img src="assets/chatbot-avatar.png" alt="Vastraa Assistant">
      </div>
      <div class="welcome-content">
        <h4>Hi there! 👋</h4>
        <p>I'm your Vastraa shopping assistant. How can I help you today?</p>
      </div>
    </div>
  `;
  container.appendChild(welcomeMsg);
  
  const quickReplies = document.createElement('div');
  quickReplies.className = 'quick-replies';
  quickReplies.innerHTML = `
    <button onclick="sendQuickReply('Track my order')">
      <i class="fas fa-truck"></i> Track order
    </button>
    <button onclick="sendQuickReply('Return policy')">
      <i class="fas fa-exchange-alt"></i> Returns
    </button>
    <button onclick="sendQuickReply('Show me summer dresses')">
      <i class="fas fa-tshirt"></i> Summer dresses
    </button>
  `;
  container.appendChild(quickReplies);
}

function addTextMessage(container, msg) {
  const msgElement = document.createElement('div');
  msgElement.className = `message ${msg.sender}`;
  msgElement.innerHTML = msg.content;
  container.appendChild(msgElement);
}

function addProductMessage(container, msg) {
  const productMsg = document.createElement('div');
  productMsg.className = 'message bot product-message';
  productMsg.innerHTML = `
    <div class="product-suggestion">
      <img src="${msg.product.image}" alt="${msg.product.name}">
      <div class="product-info">
        <h4>${msg.product.name}</h4>
        <div class="price">$${msg.product.price}</div>
        <button class="btn-view-product" data-id="${msg.product.id}">
          View Product
        </button>
      </div>
    </div>
  `;
  container.appendChild(productMsg);
}

// Enhanced send message function with typing indicator
function sendMessage(content, sender = 'user') {
  if (!content.trim()) return;
  
  const body = document.getElementById('chat-body');
  const newMsg = { content, sender, timestamp: new Date().toISOString() };
  
  // Add user message
  addTextMessage(body, newMsg);
  chatHistory.push(newMsg);
  localStorage.setItem('vastraaChatHistory', JSON.stringify(chatHistory));
  
  // Show typing indicator
  showTypingIndicator();
  
  // Scroll to bottom
  body.scrollTop = body.scrollHeight;
  
  // Simulate bot response after delay
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateBotResponse(content);
    const botMsg = { content: response, sender: 'bot', timestamp: new Date().toISOString() };
    addTextMessage(body, botMsg);
    chatHistory.push(botMsg);
    localStorage.setItem('vastraaChatHistory', JSON.stringify(chatHistory));
    body.scrollTop = body.scrollHeight;
  }, 1000 + Math.random() * 2000);
}

function showTypingIndicator() {
  const body = document.getElementById('chat-body');
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.className = 'typing-indicator';
  typing.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `;
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;
  isTyping = true;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
  isTyping = false;
}

// AI-powered response generator
function generateBotResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Order tracking
  if (input.includes('track') || input.includes('order')) {
    return `To track your order, please visit the <a href="my-orders.html">My Orders</a> page or share your order number with me.`;
  }
  
  // Returns
  if (input.includes('return') || input.includes('exchange')) {
    return `Our return policy allows returns within 30 days of delivery. Please ensure items are unworn with original tags. <a href="#" onclick="sendQuickReply('Start return')">Start a return</a>`;
  }
  
  // Product suggestions
  if (input.includes('dress') || input.includes('summer')) {
    // In a real app, you would fetch actual products from your database
    const summerDresses = [
      { id: 101, name: "Floral Summer Dress", price: 39.99, image: "https://example.com/dress1.jpg" },
      { id: 102, name: "Striped Maxi Dress", price: 45.99, image: "https://example.com/dress2.jpg" }
    ];
    
    // Add product message to chat
    const body = document.getElementById('chat-body');
    summerDresses.forEach(dress => {
      const productMsg = {
        type: 'product',
        sender: 'bot',
        product: dress
      };
      addProductMessage(body, productMsg);
      chatHistory.push(productMsg);
    });
    
    localStorage.setItem('vastraaChatHistory', JSON.stringify(chatHistory));
    return "Here are some popular summer dresses:";
  }
  
  // Default responses
  const defaultResponses = [
    "I can help you with product recommendations, order tracking, and returns. What would you like to know?",
    "I'm happy to assist with your fashion needs! Could you tell me more about what you're looking for?",
    "For quick assistance, you can check our <a href='faq.html'>FAQ page</a> or ask me anything!"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Quick reply handler
function sendQuickReply(text) {
  if (isTyping) return;
  document.getElementById('chat-input').value = text;
  sendMessage(text);
}

// Handle Enter key in chat input
function handleChatInputKeypress(e) {
  if (e.key === 'Enter') {
    sendChat();
  }
}

// Main send chat function
function sendChat() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (message) {
    sendMessage(message);
    input.value = '';
  }
}

// Product Quick View
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('quick-view-btn')) {
    const productId = e.target.dataset.id;
    showQuickView(productId);
  }
  
  if (e.target.classList.contains('btn-view-product')) {
    const productId = e.target.dataset.id;
    window.location.href = `product.html?id=${productId}`;
  }
});

function showQuickView(productId) {
  // In a real app, you would fetch product details from your API
  const product = {
    id: productId,
    name: "Designer Saree",
    price: 49.99,
    originalPrice: 69.99,
    description: "Beautiful handcrafted saree with intricate designs...",
    images: [
      "https://example.com/saree1.jpg",
      "https://example.com/saree2.jpg"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue", "Green"]
  };
  
  // Create and show modal
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="product-images">
        <div class="main-image">
          <img src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="thumbnails">
          ${product.images.map(img => `
            <img src="${img}" alt="${product.name}">
          `).join('')}
        </div>
      </div>
      <div class="product-details">
        <h2>${product.name}</h2>
        <div class="price">
          <span class="current">$${product.price}</span>
          ${product.originalPrice ? `<span class="original">$${product.originalPrice}</span>` : ''}
        </div>
        <div class="description">${product.description}</div>
        
        <div class="product-options">
          <div class="option">
            <label>Size:</label>
            <select>
              ${product.sizes.map(size => `
                <option value="${size}">${size}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="option">
            <label>Color:</label>
            <div class="color-options">
              ${product.colors.map(color => `
                <button style="background-color: ${color.toLowerCase()}" 
                        title="${color}"></button>
              `).join('')}
            </div>
          </div>
          
          <div class="quantity">
            <label>Quantity:</label>
            <div class="quantity-selector">
              <button class="decrease">-</button>
              <input type="number" value="1" min="1" max="10">
              <button class="increase">+</button>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="buy-now" data-id="${product.id}">Buy Now</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  
  // Close modal handlers
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.classList.remove('modal-open');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open');
    }
  });
  
  // Thumbnail click handler
  modal.querySelectorAll('.thumbnails img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = modal.querySelector('.main-image img');
      mainImg.src = thumb.src;
    });
  });
  
  // Quantity handlers
  const quantityInput = modal.querySelector('.quantity input');
  modal.querySelector('.decrease').addEventListener('click', () => {
    if (quantityInput.value > 1) quantityInput.value--;
  });
  modal.querySelector('.increase').addEventListener('click', () => {
    if (quantityInput.value < 10) quantityInput.value++;
  });
  
  // Add to cart handler
  modal.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product.id, quantityInput.value);
    document.body.removeChild(modal);
    document.body.classList.remove('modal-open');
    showNotification(`${product.name} added to cart!`);
  });
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.push({
      productId,
      quantity: parseInt(quantity),
      addedAt: new Date().toISOString()
    });
  }
  
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Dispatch event for other components to listen to
  document.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart }
  }));
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// Notification System
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize cart count on page load
updateCartCount();

// Wishlist functionality
function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const index = wishlist.indexOf(productId);
  
  if (index === -1) {
    wishlist.push(productId);
    showNotification('Added to wishlist!');
  } else {
    wishlist.splice(index, 1);
    showNotification('Removed from wishlist', 'info');
  }
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistButtons();
}

function updateWishlistButtons() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const productId = btn.dataset.id;
    btn.classList.toggle('active', wishlist.includes(productId));
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWishlistButtons();
  
  // Add event listeners for wishlist buttons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.id;
      toggleWishlist(productId);
    });
  });
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.id;
      addToCart(productId);
      showNotification('Product added to cart!');
    });
  });
});

// Product filtering
document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', function() {
    const filter = this.dataset.filter;
    filterProducts(filter);
  });
});

function filterProducts(filter) {
  // In a real app, you would fetch filtered products from your API
  // This is just a simulation
  document.querySelectorAll('.product-card').forEach(card => {
    const cardFilter = card.dataset.category;
    if (filter === 'all' || cardFilter === filter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Search functionality with debounce
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', debounce(function() {
  const query = this.value.trim().toLowerCase();
  if (query.length > 2) {
    searchProducts(query);
  } else {
    // Reset to show all products if search query is too short
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = 'block';
    });
  }
}, 300));

function searchProducts(query) {
  // In a real app, you would make an API call
  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('.product-title').textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Product image zoom on hover
document.querySelectorAll('.product-image-container').forEach(container => {
  container.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) { // Only on desktop
      const img = this.querySelector('img');
      const { left, top, width, height } = this.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
      img.style.transform = 'scale(1.5)';
    }
  });
  
  container.addEventListener('mouseleave', function() {
    const img = this.querySelector('img');
    img.style.transform = 'scale(1)';
  });
});

// Initialize image lazy loading
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  
  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});

async function addToCart(productId, quantity = 1) {
  const userId = localStorage.getItem('userId');
  const response = await fetch('http://localhost:5000/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity })
  });
  const result = await response.json();
  showNotification(`${productId} added to cart!`);
}


function addToOrders(productName) {
  addToCart(productName, 1);
  window.location.href = "cart.html";
}


function addToCartAndRedirect(productName) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.productId === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId: productName, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount(); // This already exists in your code
  window.location.href = "cart.html";
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const fabBadge = document.getElementById('fabCartCount');
  if (fabBadge) fabBadge.textContent = count;
}


function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const index = wishlist.indexOf(productId);

  if (index === -1) {
    wishlist.push(productId);
    showNotification('Added to wishlist!');
  } else {
    wishlist.splice(index, 1);
    showNotification('Removed from wishlist.', 'info');
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistButtons();
}

function updateWishlistButtons() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    btn.classList.toggle('active', wishlist.includes(id));
    btn.innerHTML = wishlist.includes(id)
      ? '<i class="fas fa-heart"></i>'
      : '<i class="far fa-heart"></i>';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateWishlistButtons();
});


function generateBotResponse(userInput) {
  const input = userInput.toLowerCase();

  if (input.includes('track') || input.includes('order')) {
    return `To track your order, go to <a href="cart.html">your cart</a> or tell me your order number. 📦`;
  }

  if (input.includes('return') || input.includes('exchange')) {
    return `Our return policy allows returns within 7 days. Go to <a href="returns.html">Returns Page</a> to begin. 🔁`;
  }

  if (input.includes('wishlist')) {
    return `To manage your wishlist, go to <a href="wishlist.html">My Wishlist</a>. ❤️`;
  }

  if (input.includes('ethnic') || input.includes('dress')) {
    return `Here are some trending ethnic wear items for you: 
    <ul>
      <li>🌸 Designer Sarees</li>
      <li>🌼 Ethnic Lehengas</li>
      <li>🌿 Kurti Sets</li>
    </ul>`;
  }

  const fallback = [
    "I'm here to help with orders, returns, and fashion tips. Ask me anything! 💁‍♀️",
    "Need help finding an outfit? Type something like *show me kurtis* or *track my order*.",
    "Try asking: *Where is my order?*, *Return an item*, or *What’s new in lehengas?*"
  ];

  return fallback[Math.floor(Math.random() * fallback.length)];
}

window.addEventListener("load", () => {
  if (window.location.href.includes("support") || window.location.href.includes("help")) {
    toggleChatbot();
  }
});

window.addEventListener("load", () => {
  if (window.location.href.includes("product")) {
    setTimeout(() => {
      toggleChatbot();
      sendMessage("Still deciding? I can help you choose! 😊", "bot");
    }, 10000);
  }
});


// Advanced AI Chatbot Enhancements
function generateBotResponse(userInput) {
  const input = userInput.toLowerCase();

  // AI Product Recommendations
  if (input.includes("recommend") || input.includes("suggest")) {
    const pastViews = JSON.parse(localStorage.getItem("recentProducts")) || [];
    if (pastViews.length === 0) {
      return "What kind of products are you looking for? (e.g., kurtis, shirts)";
    }
    return `Based on your browsing, you might like:<br>
      - ${pastViews[0]} 🌟<br>
      - ${pastViews[1] || 'More coming soon!'} 👗`;
  }

  // NLP-style product search
  if (input.match(/(black|white|red|blue)/) && input.includes("under")) {
    return `Here are some options matching your style. 💡 Use filters for best results.`;
  }

  // Order Tracking
  if (input.includes("track") || input.includes("order") || input.includes("where is my order")) {
    return `🔍 You can track your order <a href="cart.html">here</a>. Need help with your order ID?`;
  }

  // Returns
  if (input.includes("return") || input.includes("exchange")) {
    return `📦 You can return items within 7 days. <a href="returns.html">Start a return here</a>.`;
  }

  // Size & Fit Guidance
  if (input.includes("size") || input.includes("fit")) {
    return `👗 Our size guide recommends M for most brands. See full chart <a href="size-guide.html">here</a>.`;
  }

  // Stock Availability
  if (input.includes("in stock")) {
    return `✅ Most sizes are available. Please check the product page for exact availability.`;
  }

  // Discounts & Promo Alerts
  if (input.includes("discount") || input.includes("deal") || input.includes("offer")) {
    return `🔥 Use code <strong>FASHION20</strong> to get 20% off. Limited time only!`;
  }

  // Live Support Request
  if (input.includes("talk to human") || input.includes("agent")) {
    return `👩‍💼 Connecting you to a support agent… (simulated). You can also email us at support@vastraa.com.`;
  }

  // Wishlist
  if (input.includes("wishlist")) {
    return `❤️ View your saved items on the <a href="wishlist.html">Wishlist Page</a>.`;
  }

  // Visual Search Placeholder
  if (input.includes("upload") || input.includes("image search")) {
    return `🖼️ Upload image search is coming soon. Stay tuned!`;
  }

  // Product Suggestions
  if (input.includes("ethnic") || input.includes("dress")) {
    return `Here are some trending ethnic wear items:<br>
      - 🌸 Designer Sarees<br>
      - 🌼 Ethnic Lehengas<br>
      - 🌿 Kurti Sets`;
  }

  // Default fallback
  const fallback = [
    "I'm here to help with orders, returns, and fashion tips. Ask me anything! 💁‍♀️",
    "Need help finding an outfit? Try 'Show me kurtis' or 'Track my order'.",
    "Ask me about size guides, delivery, or deals!"
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

// Proactive Chatbot Trigger on Idle or Product Page
let idleTimer;
document.addEventListener('mousemove', () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const bot = document.getElementById('chatbot');
    if (bot && bot.style.display !== 'flex') {
      toggleChatbot();
      sendMessage("Need help finding something? I’m here to help! 💬", 'bot');
    }
  }, 15000);
});

window.addEventListener("load", () => {
  if (window.location.href.includes("product")) {
    setTimeout(() => {
      toggleChatbot();
      sendMessage("Still deciding? I can help you choose! 😊", "bot");
    }, 10000);
  }
});


