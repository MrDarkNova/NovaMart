const items = [
  { id: 1, name: 'Nova Buds', price: 18500 },
  { id: 2, name: 'ChargePack 20k', price: 14200 },
  { id: 3, name: 'Desk Lamp', price: 9800 },
  { id: 4, name: 'Cable Kit', price: 3500 },
  { id: 5, name: 'Laptop Sleeve', price: 7200 },
  { id: 6, name: 'USB Hub', price: 6100 },
];
const cart = [];
const naira = (n) => '₦' + n.toLocaleString();
function render() {
  document.querySelector('.grid').innerHTML = items.map((p) => `
    <article class="card"><h3>${p.name}</h3><p class="price">${naira(p.price)}</p>
    <button data-id="${p.id}">Add</button></article>`).join('');
  const lines = cart.map((c) => `${c.name} × ${c.qty} — ${naira(c.price * c.qty)}`);
  document.getElementById('cartList').innerHTML = lines.map((l) => `<p>${l}</p>`).join('') || '<p>Empty</p>';
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('total').textContent = 'Total ' + naira(total);
  document.getElementById('count').textContent = cart.reduce((s, c) => s + c.qty, 0);
  const msg = encodeURIComponent('NovaMart demo order:\n' + lines.join('\n') + '\nTotal ' + naira(total));
  document.getElementById('wa').href = 'https://wa.me/2349034115677?text=' + msg;
}
document.querySelector('.grid').addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  const p = items.find((x) => x.id === id);
  const row = cart.find((x) => x.id === id);
  if (row) row.qty += 1; else cart.push({ ...p, qty: 1 });
  render();
});
render();
