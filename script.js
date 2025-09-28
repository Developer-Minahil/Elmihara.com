// Loading Animation
window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("loading").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
    }, 500);
  }, 2000);
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Navbar scroll effect
const navbar = document.getElementById("navbar");
const logo = document.getElementById("logo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("navbar-scroll");
    logo.classList.remove("text-white");
    logo.classList.add("text-gray-900");

    // Change nav links color
    const navLinks = navbar.querySelectorAll("a");
    navLinks.forEach((link) => {
      if (!link.closest("#mobile-menu")) {
        link.classList.remove("text-white", "hover:text-purple-300");
        link.classList.add("text-gray-900", "hover:text-purple-600");
      }
    });

    // Change cart and mobile menu button color
    document
      .getElementById("cart-btn")
      .classList.remove("text-white", "hover:text-purple-300");
    document
      .getElementById("cart-btn")
      .classList.add("text-gray-900", "hover:text-purple-600");
    mobileMenuBtn.classList.remove("text-white");
    mobileMenuBtn.classList.add("text-gray-900");
  } else {
    navbar.classList.remove("navbar-scroll");
    logo.classList.add("text-white");
    logo.classList.remove("text-gray-900");

    // Revert nav links color
    const navLinks = navbar.querySelectorAll("a");
    navLinks.forEach((link) => {
      if (!link.closest("#mobile-menu")) {
        link.classList.add("text-white", "hover:text-purple-300");
        link.classList.remove("text-gray-900", "hover:text-purple-600");
      }
    });

    // Revert cart and mobile menu button color
    document
      .getElementById("cart-btn")
      .classList.add("text-white", "hover:text-purple-300");
    document
      .getElementById("cart-btn")
      .classList.remove("text-gray-900", "hover:text-purple-600");
    mobileMenuBtn.classList.add("text-white");
    mobileMenuBtn.classList.remove("text-gray-900");
  }
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  .forEach((el) => {
    observer.observe(el);
  });

// Product filtering
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    // Update active button
    filterBtns.forEach((b) => {
      b.classList.remove(
        "active",
        "bg-gradient-to-r",
        "from-purple-600",
        "to-blue-600",
        "text-white"
      );
      b.classList.add("text-gray-600");
    });
    btn.classList.add(
      "active",
      "bg-gradient-to-r",
      "from-purple-600",
      "to-blue-600",
      "text-white"
    );
    btn.classList.remove("text-gray-600");

    // Filter products
    productCards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// Initialize first filter as active
document
  .querySelector('.filter-btn[data-filter="all"]')
  .classList.add(
    "bg-gradient-to-r",
    "from-purple-600",
    "to-blue-600",
    "text-white"
  );

// Shopping Cart Functionality
let cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", function () {
    const product = {
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image,
      quantity: 1,
    };

    addToCart(product);

    // Add bounce animation to cart icon
    cartBtn.classList.add("cart-bounce");
    setTimeout(() => {
      cartBtn.classList.remove("cart-bounce");
    }, 500);
  });
});

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCartUI();
    }
  }
}

function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "flex items-center space-x-4 p-4 border rounded-lg";
      cartItem.innerHTML = `
                        <img src="${item.image}" alt="${
        item.name
      }" class="w-16 h-16 object-cover rounded">
                        <div class="flex-1">
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-gray-600">$${item.price}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity('${item.id}', ${
        item.quantity - 1
      })" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">-</button>
                            <span class="w-8 text-center">${
                              item.quantity
                            }</span>
                            <button onclick="updateQuantity('${item.id}', ${
        item.quantity + 1
      })" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">+</button>
                        </div>
                        <button onclick="removeFromCart('${
                          item.id
                        }')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
      cartItems.appendChild(cartItem);
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
}
// Cart modal functionality
cartBtn.addEventListener("click", () => {
  cartModal.classList.add("show");
});
closeCart.addEventListener("click", () => {
  cartModal.classList.remove("show");
});
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("show");
  }
});
// Checkout functionality
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert(
    "Thank you for your purchase! Your order has been placed successfully."
  );
  cart = [];
  updateCartUI();
  cartModal.classList.remove("show");
});

// Form submission
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you for your message! We will get back to you soon.");
  this.reset();
});

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;