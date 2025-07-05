        let storeInventory = [];

        async function loadProducts() {
            try {
                const response = await fetch("products.json");
                storeInventory = await response.json();
                initGallery();
            } catch (err) {
                console.error("Failed to load products:", err);
            }
        }


        const gallery = document.getElementById('gallery');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutContainer = document.getElementById('checkout-container');
        const backToCartBtn = document.getElementById('back-to-cart');
        const completeOrderBtn = document.getElementById('complete-order');
        const orderSummary = document.getElementById('order-summary');
        const orderTotal = document.getElementById('order-total');
        const continueShoppingBtn = document.getElementById('continue-shopping');
        const checkoutForm = document.getElementById('checkout-form');
        const confirmation = document.getElementById('confirmation');
        const overlay = document.getElementById('overlay');
        const notificationContainer = document.getElementById('notification-container');

        let cart = {};
        let notificationCount = 0;

        function updateCart() {
            cartItems.innerHTML = '';
            let total = 0;

            // Check if cart is empty
            if (Object.keys(cart).length === 0) {
                cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty.<br>Add some delicious treats!</div>';
                cartTotal.innerText = 'Total: $0.00';
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.6';
                checkoutBtn.style.cursor = 'not-allowed';
                return;
            }

            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';

            for (let itemName in cart) {
                const cartItem = cart[itemName];
                total += cartItem.price * cartItem.quantity;

                const div = document.createElement('div');
                div.className = 'cart-item';

                div.innerHTML = `
                    <img src="${cartItem.image}" alt="${cartItem.name}">
                    <div class="cart-item-details">
                        <strong>${cartItem.name}</strong>
                        <div>$${cartItem.price.toFixed(2)}</div>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="decreaseItem('${itemName}')">-</button>
                        <span>${cartItem.quantity}</span>
                        <button onclick="increaseItem('${itemName}')">+</button>
                    </div>
                    <button class="delete-button" onclick="removeItem('${itemName}')"><i class="fas fa-trash"></i></button>
                `;

                cartItems.appendChild(div);
            }

            cartTotal.innerText = `Total: $${total.toFixed(2)}`;
        }

        function addToCart(item) {
            if (cart[item.name]) {
                cart[item.name].quantity += 1;
            } else {
                cart[item.name] = {
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image: item.image
                };
            }
            updateCart();
            
            // Show success notification
            showNotification(`${item.name} added to cart!`);
        }

        function increaseItem(itemName) {
            cart[itemName].quantity += 1;
            updateCart();
        }

        function decreaseItem(itemName) {
            cart[itemName].quantity -= 1;
            if (cart[itemName].quantity <= 0) {
                delete cart[itemName];
            }
            updateCart();
        }

        function removeItem(itemName) {
            delete cart[itemName];
            updateCart();
        }

        function showNotification(message) {
            const id = `notification-${notificationCount++}`;
            const notification = document.createElement('div');
            notification.id = id;
            notification.className = 'notification';
            notification.innerText = message;
            
            // Add to container (newest on top)
            notificationContainer.prepend(notification);
            
            // Set timeout to remove notification after 2.5 seconds
            setTimeout(() => {
                notification.classList.add('notification-removing');
                
                // After animation completes, remove element and shift others
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2500);
        }

        function initGallery() {
            storeInventory.forEach(item => {
                const div = document.createElement('div');
                div.className = 'product-card';
                
                div.innerHTML = `
                    <div class="product-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="product-info">
                        <h3>${item.name}</h3>
                        <div class="product-price">$${item.price.toFixed(2)}</div>
                        <div class="description-container">
                            <div class="short-description">${item.shortDesc}</div>
                            <button class="expand-description">
                                <i class="fas fa-chevron-down"></i>
                                <span class="expand-text">More details</span>
                            </button>
                            <div class="full-description">${item.fullDesc}</div>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class='add-to-cart-btn' onclick='addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})'>
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                `;
                
                gallery.appendChild(div);
            });
            
            // Add event listeners for expand/collapse
            document.querySelectorAll('.expand-description').forEach(button => {
                button.addEventListener('click', function() {
                    const container = this.closest('.description-container');
                    const expandText = this.querySelector('.expand-text');
                    
                    container.classList.toggle('expanded');
                    
                    // Toggle text between "More details" and "Less details"
                    if (container.classList.contains('expanded')) {
                        expandText.textContent = 'Less details';
                    } else {
                        expandText.textContent = 'More details';
                    }
                });
            });
        }

        function showCheckout() {
            overlay.style.display = 'block';
            checkoutContainer.classList.add('active');
            updateOrderSummary();
        }

        function hideCheckout() {
            overlay.style.display = 'none';
            checkoutContainer.classList.remove('active');
        }

        function updateOrderSummary() {
            orderSummary.innerHTML = '';
            let total = 0;

            if (Object.keys(cart).length === 0) {
                orderTotal.innerText = '$0.00';
                return;
            }
            
            for (let itemName in cart) {
                const item = cart[itemName];
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const summaryItem = document.createElement('div');
                summaryItem.className = 'summary-item';
                summaryItem.innerHTML = `
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                `;
                orderSummary.appendChild(summaryItem);
            }
            
            orderTotal.innerText = `$${total.toFixed(2)}`;
        }

        function completeOrder() {
            // Basic form validation
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zip = document.getElementById('zip').value;
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            
            if (!fullName || !email || !address || !city || !state || !zip || 
                !cardName || !cardNumber || !expiry || !cvv) {
                showNotification('Please fill all required fields!');
                return;
            }
            
            // Generate random order ID
            const orderId = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('order-id').textContent = orderId;
            
            // Show confirmation
            checkoutForm.style.display = 'none';
            confirmation.style.display = 'block';
            
            // Clear cart
            cart = {};
            updateCart();
        }

        function resetCheckoutForm() {
            checkoutForm.style.display = 'block';
            confirmation.style.display = 'none';
            document.getElementById('checkout-form').reset();
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            loadProducts();
            updateCart();
            
            // Event listeners
            checkoutBtn.addEventListener('click', showCheckout);
            backToCartBtn.addEventListener('click', hideCheckout);
            completeOrderBtn.addEventListener('click', completeOrder);
            continueShoppingBtn.addEventListener('click', () => {
                hideCheckout();
                resetCheckoutForm();
            });
            overlay.addEventListener('click', hideCheckout);
        });
\nif (typeof module !== 'undefined') { module.exports = { updateCart, cart, checkoutBtn, cartItems, cartTotal }; }
