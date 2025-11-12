// Minimal cart logic (front-end) to support addToCart calls from HTML buttons
const CART_KEY = 'michi_cart_v1';

function getCart() {
	try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function formatCurrency(n) { return Number(n).toFixed(2); }

function renderCart() {
	const cart = getCart();
	const itemsEl = document.getElementById('cart-items');
	const totalEl = document.getElementById('cart-total');
	const countEl = document.getElementById('cart-count');
	if (!itemsEl || !totalEl || !countEl) return; // offcanvas may not be present on every page
	itemsEl.innerHTML = '';
	let total = 0;
	cart.forEach((item, idx) => {
		total += item.price * (item.qty || 1);
		const div = document.createElement('div');
		div.className = 'd-flex align-items-center mb-2';
		div.innerHTML = `
			<img src="${item.img}" alt="${item.name}" width="64" height="64" class="rounded me-2" />
			<div class="flex-grow-1">
				<div class="fw-bold">${item.name}</div>
				<div>$${formatCurrency(item.price)} x ${item.qty || 1}</div>
			</div>
		`;
		itemsEl.appendChild(div);
	});
	totalEl.textContent = formatCurrency(total);
	countEl.textContent = cart.reduce((s, i) => s + (i.qty || 1), 0);
}

function addToCart(product) {
	const cart = getCart();
	const existing = cart.find(i => i.name === product.name);
	if (existing) existing.qty = (existing.qty || 1) + 1;
	else { product.qty = 1; cart.push(product); }
	saveCart(cart);
	renderCart();
	console.log('addToCart:', product, 'cart now', getCart());
}


function increaseQty(idx) {
	const cart = getCart();
	if (cart[idx]) {
		cart[idx].qty = (cart[idx].qty || 1) + 1;
		saveCart(cart);
		renderCart();
	}
}

function decreaseQty(idx) {
	const cart = getCart();
	if (cart[idx]) {
		cart[idx].qty = (cart[idx].qty || 1) - 1;
		if (cart[idx].qty <= 0) cart.splice(idx, 1);
		saveCart(cart);
		renderCart();
	}
}

function clearCart() {
	saveCart([]);
	renderCart();
	console.log('clearCart called');
}

function checkout() {
	const cart = getCart();
	if (!cart || cart.length === 0) {
		alert('El carrito está vacío.');
		return;
	}
	const total = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
	alert('Simulación: pedido enviado. Total: $' + Number(total).toFixed(2));
	clearCart();
}

window.addEventListener('DOMContentLoaded', () => {
	renderCart();
	const clearBtn = document.getElementById('clear-cart');
	const checkoutBtn = document.getElementById('checkout');
	if (clearBtn) clearBtn.addEventListener('click', clearCart);
	if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
	// Optional: delegate increase/decrease if future UI adds buttons
});

