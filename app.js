const perfumes = [
  {id:1,name:'Santal 33',brand:'Le Labo',category:'Woody',price:145,detail:'Sandalwood · Cardamom · Leather',badge:'BESTSELLER',image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80'},
  {id:2,name:'Good Girl',brand:'Carolina Herrera',category:'Floral',price:128,detail:'Jasmine · Tonka · Cocoa',badge:'ICONIC',image:'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=80'},
  {id:3,name:'Oud for Greatness',brand:'Initio Parfums',category:'Oriental',price:190,detail:'Saffron · Oud · Patchouli',badge:'THE EDIT',image:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'},
  {id:4,name:'Wood Sage & Sea Salt',brand:'Jo Malone',category:'Fresh',price:112,detail:'Sea Salt · Sage · Driftwood',badge:'',image:'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=80'},
  {id:5,name:'Libre',brand:'Yves Saint Laurent',category:'Floral',price:135,detail:'Lavender · Orange Blossom · Vanilla',badge:'',image:'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=80'},
  {id:6,name:'Bleu de Chanel',brand:'Chanel',category:'Woody',price:155,detail:'Citrus · Incense · Cedar',badge:'',image:'https://images.unsplash.com/photo-1590156221922-c9cfa2b47f11?auto=format&fit=crop&w=700&q=80'},
  {id:7,name:'Baccarat Rouge 540',brand:'Maison Francis Kurkdjian',category:'Oriental',price:325,detail:'Saffron · Amberwood · Fir Resin',badge:'SIGNATURE',image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80'},
  {id:8,name:'Aqua Universalis',brand:'Maison Francis Kurkdjian',category:'Fresh',price:175,detail:'Bergamot · White Flowers · Musk',badge:'',image:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'}
];
const money = n => `$${n.toFixed(2)}`;
let activeCategory = 'All';
let cart = JSON.parse(localStorage.getItem('faisal-perfumes-cart') || '{}');
const grid = document.querySelector('#products');
const searchInput = document.querySelector('#search-input');
function filteredPerfumes(){
  const term = searchInput.value.trim().toLowerCase();
  let items = perfumes.filter(p => (activeCategory==='All'||p.category===activeCategory) && `${p.name} ${p.brand} ${p.detail} ${p.category}`.toLowerCase().includes(term));
  const sort = document.querySelector('#sort').value;
  if(sort==='low') items.sort((a,b)=>a.price-b.price);
  if(sort==='high') items.sort((a,b)=>b.price-a.price);
  return items;
}
function renderProducts(){
  const items=filteredPerfumes();
  grid.innerHTML=items.map(p=>`<article class="product-card"><div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name} by ${p.brand}" loading="lazy">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}<button class="quick-add" data-add="${p.id}">ADD TO BAG &nbsp; +</button></div><div class="product-meta"><div><p class="product-brand">${p.brand}</p><h3 class="product-name">${p.name}</h3></div><span class="product-price">${money(p.price)}</span></div><p class="product-detail">${p.detail}</p></article>`).join('');
  document.querySelector('.empty-state').hidden=items.length>0;
}
function saveCart(){localStorage.setItem('faisal-perfumes-cart',JSON.stringify(cart));renderCart()}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();showToast(`${perfumes.find(p=>p.id===id).name} added to your bag`)}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);
  const count=entries.reduce((sum,[,qty])=>sum+qty,0);
  const total=entries.reduce((sum,[id,qty])=>sum+perfumes.find(p=>p.id===Number(id)).price*qty,0);
  document.querySelector('.cart-count').textContent=count;
  document.querySelector('.drawer-count').textContent=`(${count})`;
  document.querySelector('.subtotal b').textContent=money(total);
  document.querySelector('.cart-empty').style.display=count?'none':'block';
  document.querySelector('.cart-items').innerHTML=entries.map(([id,qty])=>{const p=perfumes.find(item=>item.id===Number(id));return `<div class="cart-line"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${p.brand}</p><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div class="cart-line-price">${money(p.price*qty)}<button class="remove-item" data-remove="${id}">Remove</button></div></div>`}).join('');
  document.querySelector('.checkout').disabled=count===0;
}
const drawer=document.querySelector('.cart-drawer');
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.querySelector('.overlay').hidden=false;document.body.classList.add('cart-open')}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.querySelector('.overlay').hidden=true;document.body.classList.remove('cart-open')}
let toastTimer;
function showToast(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');if(add){addToCart(Number(add.dataset.add));return}
  const qty=e.target.closest('[data-qty]');if(qty){const id=qty.dataset.qty;cart[id]=Math.max(0,(cart[id]||0)+Number(qty.dataset.delta));if(!cart[id])delete cart[id];saveCart();return}
  const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];saveCart();return}
  const category=e.target.closest('.category');if(category){activeCategory=category.dataset.category;document.querySelectorAll('.category').forEach(button=>button.classList.toggle('active',button===category));renderProducts()}
});
document.querySelector('.cart-button').addEventListener('click',openCart);
document.querySelector('.close-cart').addEventListener('click',closeCart);
document.querySelector('.overlay').addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
searchInput.addEventListener('input',renderProducts);
document.querySelector('#sort').addEventListener('change',renderProducts);
document.querySelector('#clear-search').addEventListener('click',()=>{searchInput.value='';renderProducts();searchInput.focus()});
document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('#shop').scrollIntoView({behavior:'smooth'});setTimeout(()=>searchInput.focus(),350)});
document.querySelector('.menu-toggle').addEventListener('click',e=>{const nav=document.querySelector('.main-nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false')}));
document.querySelector('.checkout').addEventListener('click',()=>showToast('Checkout is ready to connect to your payment provider.'));
document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();showToast('Thank you for joining the Faisal Perfumes list!');e.currentTarget.reset()});
document.querySelector('#year').textContent=new Date().getFullYear();
renderProducts();renderCart();
