const items = [
  { id: 1, name: 'Nova Buds', price: 18500, blurb: 'Wireless, 24h case' },
  { id: 2, name: 'ChargePack 20k', price: 14200, blurb: '20,000 mAh pack' },
  { id: 3, name: 'Desk Lamp', price: 9800, blurb: 'USB-C, 3 temps' },
  { id: 4, name: 'Cable Kit', price: 3500, blurb: 'USB-C + Lightning' },
  { id: 5, name: 'Laptop Sleeve', price: 7200, blurb: '13–14 inch' },
  { id: 6, name: 'USB Hub', price: 6100, blurb: '4-port + HDMI' },
];
const KEY = 'novamart-cart-v1';
const naira = (n) => '₦' + Number(n).toLocaleString();
let cart = JSON.parse(localStorage.getItem(KEY) || '[]');
const persist = () => localStorage.setItem(KEY, JSON.stringify(cart));

function render() {
  document.querySelector('.grid').innerHTML = items.map((p) => `
    <article class="card">
      <h3>${p.name}</h3>
      <p class="muted">${p.blurb}</p>
      <p class="price">${naira(p.price)}</p>
      <button data-add="${p.id}">Add to bag</button>
    </article>`).join('');
  const rows = cart.map((c) => `
    <div class="line">
      <span>${c.name}</span>
      <span>
        <button data-dec="${c.id}">−</button>
        ${c.qty}
        <button data-inc="${c.id}">+</button>
      </span>
      <b>${naira(c.price * c.qty)}</b>
    </div>`);
  document.getElementById('cartList').innerHTML = rows.join('') || '<p class="muted">Bag is empty.</p>';
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('total').textContent = 'Total ' + naira(total);
  document.getElementById('count').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function bump(id, d) {
  const row = cart.find((x) => x.id === id);
  if (!row) {
    const p = items.find((x) => x.id === id);
    if (p && d > 0) cart.push({ ...p, qty: 1 });
  } else {
    row.qty += d;
    if (row.qty <= 0) cart = cart.filter((x) => x.id !== id);
  }
  persist();
  render();
}

document.body.addEventListener('click', (e) => {
  const add = e.target.dataset.add;
  const inc = e.target.dataset.inc;
  const dec = e.target.dataset.dec;
  if (add) bump(Number(add), 1);
  if (inc) bump(Number(inc), 1);
  if (dec) bump(Number(dec), -1);
});

document.getElementById('order').onsubmit = (e) => {
  e.preventDefault();
  if (!cart.length) { alert('Add something first.'); return; }
  const data = Object.fromEntries(new FormData(e.target));
  const lines = cart.map((c) => `${c.name} x${c.qty} = ${naira(c.price * c.qty)}`);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const msg = encodeURIComponent(
    `NovaMart order\n${data.buyer} / ${data.phone}\n${lines.join('\n')}\nTotal ${naira(total)}\n${data.note || ''}`
  );
  window.open('https://wa.me/2349034115677?text=' + msg, '_blank');
};

render();
