const WHATSAPP = '50685369305';

const productos = [
  {id:1,nombre:'Perfume Allaf Gold 100ml',categoria:'hombre',precio:18500,img:'img/perfume1.jpg',desc:'Fragancia elegante, intensa y duradera. Ideal para noche, oficina o eventos formales.'},
  {id:2,nombre:'Bufar Rose Femme 100ml',categoria:'mujer',precio:19900,img:'img/perfume2.jpg',desc:'Aroma femenino con notas florales y dulces. Perfecto para uso diario.'},
  {id:3,nombre:'Allaf Blue Ocean 100ml',categoria:'hombre',precio:17500,img:'img/perfume3.jpg',desc:'Fragancia fresca con notas marinas. Excelente para clima cálido y uso casual.'},
  {id:4,nombre:'Bufar Vanilla Secret 100ml',categoria:'mujer',precio:21000,img:'img/perfume4.jpg',desc:'Perfume cálido con vainilla, suave y elegante. Muy recomendado para regalo.'},
  {id:5,nombre:'Allaf Oud Premium 100ml',categoria:'unisex',precio:24500,img:'img/perfume5.jpg',desc:'Fragancia unisex con oud, madera y especias. Aroma fuerte y sofisticado.'},
  {id:6,nombre:'Bufar Citrus Fresh 100ml',categoria:'unisex',precio:16500,img:'img/perfume6.jpg',desc:'Aroma cítrico, limpio y moderno. Ideal para todos los días.'},
  {id:7,nombre:'Naco 100ml',categoria:'mujer',precio:12000,img:'img/perfume7.jpg',desc:'Fragancia china Perfecta para la noche.'},
  {id:8,nombre:'India 100ml',categoria:'hombre',precio:2000,img:'img/perfume8.jpg',desc:'Fragancia Para Conquistar.'},
];

let carrito = JSON.parse(localStorage.getItem('carritoAllaf')) || [];
let productoActual = null;
let categoriaActual = 'todos';

const listaProductos = document.getElementById('listaProductos');
const buscar = document.getElementById('buscar');
const modal = document.getElementById('modalProducto');
const carritoPanel = document.getElementById('carritoPanel');
const checkoutPanel = document.getElementById('checkoutPanel');

function formatoCRC(valor){ return '₡' + valor.toLocaleString('es-CR'); }
function guardar(){ localStorage.setItem('carritoAllaf', JSON.stringify(carrito)); }

function renderProductos(){
  const texto = buscar.value.toLowerCase();
  const filtrados = productos.filter(p =>
    (categoriaActual === 'todos' || p.categoria === categoriaActual) &&
    p.nombre.toLowerCase().includes(texto)
  );

  listaProductos.innerHTML = filtrados.map(p => `
    <article class="producto">
      <img src="${p.img}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'" onclick="abrirModal(${p.id})">
      <h3>${p.nombre}</h3>
      <p>${p.desc}</p>
      <div class="producto-footer">
        <span class="precio">${formatoCRC(p.precio)}</span>
        <button class="btn-mas" onclick="agregarAlCarrito(${p.id},1)">+</button>
      </div>
    </article>
  `).join('');
}

function abrirModal(id){
  productoActual = productos.find(p => p.id === id);
  document.getElementById('modalImg').src = productoActual.img;
  document.getElementById('modalNombre').textContent = productoActual.nombre;
  document.getElementById('modalDescripcion').textContent = productoActual.desc;
  document.getElementById('modalPrecio').textContent = formatoCRC(productoActual.precio);
  document.getElementById('cantidadModal').value = 1;
  modal.classList.add('activo');
}

function cerrarModal(){ modal.classList.remove('activo'); }

function agregarAlCarrito(id, cantidad){
  const producto = productos.find(p => p.id === id);
  const existe = carrito.find(item => item.id === id);
  if(existe) existe.cantidad += cantidad;
  else carrito.push({...producto, cantidad});
  guardar();
  renderCarrito();
}

function cambiarCantidad(id, cambio){
  const item = carrito.find(p => p.id === id);
  if(!item) return;
  item.cantidad += cambio;
  if(item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
  guardar();
  renderCarrito();
}

function renderCarrito(){
  const contenedor = document.getElementById('itemsCarrito');
  const totalItems = carrito.reduce((acc,p)=>acc+p.cantidad,0);
  const total = carrito.reduce((acc,p)=>acc+(p.precio*p.cantidad),0);

  document.getElementById('contadorCarrito').textContent = totalItems;
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalCarrito').textContent = formatoCRC(total);

  contenedor.innerHTML = carrito.length ? carrito.map(p => `
    <div class="item-carrito">
      <img src="${p.img}" onerror="this.src='img/placeholder.jpg'" alt="${p.nombre}">
      <div>
        <h4>${p.nombre}</h4>
        <p>${formatoCRC(p.precio)}</p>
      </div>
      <div class="item-controles">
        <button onclick="cambiarCantidad(${p.id},-1)">−</button>
        <span>${p.cantidad}</span>
        <button onclick="cambiarCantidad(${p.id},1)">+</button>
      </div>
    </div>
  `).join('') : '<p>El carrito está vacío.</p>';
}

function enviarWhatsApp(e){
  e.preventDefault();
  if(carrito.length === 0){ alert('El carrito está vacío.'); return; }

  const nombre = document.getElementById('nombreCliente').value.trim();
  const celular = document.getElementById('celularCliente').value.trim();
  const direccion = document.getElementById('direccionCliente').value.trim();
  const comentarios = document.getElementById('comentariosCliente').value.trim();
  const total = carrito.reduce((acc,p)=>acc+(p.precio*p.cantidad),0);

  let detalle = carrito.map(p => `• ${p.nombre} x${p.cantidad} - ${formatoCRC(p.precio*p.cantidad)}`).join('\n');

  const mensaje = `Hola, quiero hacer este pedido en Allaf-Bufar:%0A%0A` +
    `Nombre: ${encodeURIComponent(nombre)}%0A` +
    `Celular: ${encodeURIComponent(celular)}%0A` +
    `Dirección: ${encodeURIComponent(direccion)}%0A` +
    `Entrega: Domicilio%0A%0A` +
    `Productos:%0A${encodeURIComponent(detalle)}%0A%0A` +
    `Total: ${encodeURIComponent(formatoCRC(total))}%0A` +
    `Comentarios: ${encodeURIComponent(comentarios || 'Ninguno')}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${mensaje}`, '_blank');
}

document.querySelectorAll('.categoria').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.categoria').forEach(b => b.classList.remove('activa'));
    btn.classList.add('activa');
    categoriaActual = btn.dataset.categoria;
    renderProductos();
  });
});

buscar.addEventListener('input', renderProductos);
document.getElementById('cerrarModal').addEventListener('click', cerrarModal);
document.getElementById('menosModal').addEventListener('click', () => {
  const input = document.getElementById('cantidadModal');
  input.value = Math.max(1, Number(input.value) - 1);
});
document.getElementById('masModal').addEventListener('click', () => {
  const input = document.getElementById('cantidadModal');
  input.value = Number(input.value) + 1;
});
document.getElementById('agregarModal').addEventListener('click', () => {
  agregarAlCarrito(productoActual.id, Number(document.getElementById('cantidadModal').value));
  cerrarModal();
  carritoPanel.classList.add('activo');
});
document.getElementById('btnCarrito').addEventListener('click', () => carritoPanel.classList.add('activo'));
document.getElementById('cerrarCarrito').addEventListener('click', () => carritoPanel.classList.remove('activo'));
document.getElementById('vaciarCarrito').addEventListener('click', () => { carrito=[]; guardar(); renderCarrito(); });
document.getElementById('btnComprar').addEventListener('click', () => {
  if(carrito.length === 0){ alert('El carrito está vacío.'); return; }
  checkoutPanel.classList.add('activo');
});
document.getElementById('volverCarrito').addEventListener('click', () => checkoutPanel.classList.remove('activo'));
document.getElementById('formPedido').addEventListener('submit', enviarWhatsApp);

renderProductos();
renderCarrito();
