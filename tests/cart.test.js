const { JSDOM } = require('jsdom');

// Set up a simple DOM
const dom = new JSDOM(`<!DOCTYPE html><body>
  <div id="cart-items"></div>
  <div id="cart-total"></div>
  <button id="checkout-btn"></button>
</body>`);

global.document = dom.window.document;

const { updateCart, cart, checkoutBtn, cartItems, cartTotal } = require('../main.js');

// Ensure cart is empty
for (const key of Object.keys(cart)) {
  delete cart[key];
}

updateCart();

test('checkout button disabled when cart empty', () => {
  expect(checkoutBtn.disabled).toBe(true);
});

test('empty cart message shown', () => {
  expect(cartItems.innerHTML).toContain('Your cart is empty');
  expect(cartTotal.innerText).toBe('Total: $0.00');
});
