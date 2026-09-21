const items = [
  { id:1, cat:'Phones', name:'Nova Buds Pro', price:18500, old:24900, badge:'Official Store', tone:'#ffe8cc' },
  { id:2, cat:'Power', name:'ChargePack 20,000mAh', price:14200, old:18900, badge:'-25%', tone:'#e8f4ff' },
  { id:3, cat:'Home', name:'LED Desk Lamp', price:9800, old:12500, badge:'Flash', tone:'#fff3d6' },
  { id:4, cat:'Cables', name:'USB-C + Lightning kit', price:3500, old:5200, badge:'-33%', tone:'#ece8ff' },
  { id:5, cat:'Bags', name:'14" Laptop sleeve', price:7200, old:9900, badge:'Official Store', tone:'#e7ffe8' },
  { id:6, cat:'Hubs', name:'4-port USB Hub + HDMI', price:6100, old:8500, badge:'-28%', tone:'#ffe8f0' },
  { id:7, cat:'Phones', name:'Nova Clip fan', price:4500, old:6000, badge:'Flash', tone:'#e8fff8' },
  { id:8, cat:'Power', name:'33W wall brick', price:3900, old:5500, badge:'-29%', tone:'#fff0e0' },
];
const KEY = 'novamart-cart-v2';
const naira = (n) => '₦' + Number(n).toLocaleString();
let cart = JSON.parse(localStorage.getItem(KEY) || '[]');
let filter = 'All';
const persist = () => localStorage.setItem(KEY, JSON.stringify(cart));
const cats = ['All', ...new Set(items.map((i) => i.cat))];

function pct(p) { return Math.round((1 - p.price / p.old) * 100) + '%'; }

function render() {
  document.getElementById('cats').innerHTML = cats.map((c) =>
    `<button class="${c===filter?'on':''}" data-cat="${c}">${c}</button>`
  ).join('');
  const list = items.filter((p) => filter==='All' || p.cat===filter);
  document.getElementById('grid').innerHTML = list.map((p) => `
    <article class="card">
      <div class="pic" style="background:${p.tone}"><span>${p.badge}</span></div>
      <h3>${p.name}</h3>
      <p class="price">${naira(p.price)} <s>${naira(p.old)}</s></p>
      <p class="off">-${pct(p)}</p>
      <button data-add="${p.id}">Add to cart</button>
    </article>`).join('');
  const rows = cart.map((c) => `
    <div class="line">
      <span>${c.name}</span>
      <span>
        <button data-dec="${c.id}">−</button> ${c.qty}
        <button data-inc="${c.id}">+</button>
      </span>
      <b>${naira(c.price * c.qty)}</b>
    </div>`);
  document.getElementById('cartList').innerHTML = rows.join('') || '<p>Cart is empty.</p>';
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
  persist(); render();
}

document.body.addEventListener('click', (e) => {
  if (e.target.dataset.cat) { filter = e.target.dataset.cat; render(); }
  if (e.target.dataset.add) bump(Number(e.target.dataset.add), 1);
  if (e.target.dataset.inc) bump(Number(e.target.dataset.inc), 1);
  if (e.target.dataset.dec) bump(Number(e.target.dataset.dec), -1);
});
document.getElementById('openCart').onclick = () => document.getElementById('drawer').classList.add('show');
document.getElementById('closeCart').onclick = () => document.getElementById('drawer').classList.remove('show');
document.getElementById('search').onsubmit = (e) => {
  e.preventDefault();
  const q = new FormData(e.target).get('q').toLowerCase();
  filter = 'All';
  render();
  [...document.querySelectorAll('.card')].forEach((el) => {
    el.style.display = el.querySelector('h3').textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};
document.getElementById('order').onsubmit = (e) => {
  e.preventDefault();
  if (!cart.length) { alert('Cart is empty'); return; }
  const data = Object.fromEntries(new FormData(e.target));
  const lines = cart.map((c) => `${c.name} x${c.qty} = ${naira(c.price * c.qty)}`);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const msg = encodeURIComponent(`NovaMart order\n${data.buyer} / ${data.phone}\n${lines.join('\n')}\nTotal ${naira(total)}\n${data.note||''}`);
  window.open('https://wa.me/2349034115677?text=' + msg, '_blank');
};
render();
