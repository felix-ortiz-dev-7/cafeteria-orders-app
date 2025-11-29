// Datos base del menú
const data = {
  categorias: [
    {
      id: 1,
      nombre: "Bebidas",
      platillos: [
        { id: 101, nombre: "Café Americano", descripcion: "Café negro recién hecho", precio: 25 },
        { id: 102, nombre: "Capuchino", descripcion: "Espresso con leche espumada", precio: 35 }
      ]
    },
    {
      id: 2,
      nombre: "Waffles",
      platillos: [
        { id: 201, nombre: "Waffle Clásico", descripcion: "Con mantequilla y miel de maple", precio: 50 }
      ]
    }
  ]
};

// Referencias generales
const menuContainer = document.getElementById('menu');
const platilloSeleccionadoElem = document.getElementById('platilloSeleccionado');
const comentarioInput = document.getElementById('comentario');
const confirmarPedidoBtn = document.getElementById('confirmarPedido');
const listaPedidos = document.getElementById('lista-pedidos');
const enviarCocinaBtn = document.getElementById('enviarCocina');
const contadorPedidos = document.getElementById('contadorPedidos');

// Modal de pedido
const pedidoModal = new bootstrap.Modal(document.getElementById('pedidoModal'));
let platilloActual = null;
const pedidosConfirmados = [];

// Renderiza el menú
function mostrarMenu() {
  menuContainer.innerHTML = '';
  data.categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));

  data.categorias.forEach(categoria => {
    const categoriaTitulo = document.createElement('h4');
    categoriaTitulo.classList.add('col-12', 'mt-3');
    categoriaTitulo.textContent = categoria.nombre;
    menuContainer.appendChild(categoriaTitulo);

    categoria.platillos.forEach(platillo => {
      const platilloCard = document.createElement('div');
      platilloCard.classList.add('col-12', 'col-sm-6');
      platilloCard.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${platillo.nombre}</h5>
            <p class="card-text text-muted">${platillo.descripcion}</p>
            <p class="fw-bold">$${platillo.precio}</p>
            <button class="btn btn-primary w-100">
            <i class="bi bi-cart-plus"></i> Seleccionar
            </button>
          </div>
        </div>
      `;
      platilloCard.querySelector('button').addEventListener('click', () => {
        platilloActual = platillo;
        platilloSeleccionadoElem.textContent = `${platillo.nombre} - $${platillo.precio}`;
        comentarioInput.value = '';
        pedidoModal.show();
      });
      menuContainer.appendChild(platilloCard);
    });
  });
}

// Agrega pedido visual
function agregarPedidoVisual(pedido) {
  const pedidoCard = document.createElement('div');
  pedidoCard.classList.add('card', 'mb-3', 'shadow-sm');
  pedidoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${pedido.nombre} - $${pedido.precio}</h5>
      <p class="card-text"><strong>Comentario:</strong> ${pedido.comentario}</p>
      <p class="card-text text-muted">🕒 ${pedido.hora}</p>
      <button class="btn btn-outline-danger btn-sm">
  <i class="bi bi-trash"></i>
</button>

    </div>
  `;
  pedidoCard.querySelector('button').addEventListener('click', () => {
    listaPedidos.removeChild(pedidoCard);
    const index = pedidosConfirmados.indexOf(pedido);
    if (index !== -1) pedidosConfirmados.splice(index, 1);
    localStorage.setItem('pedidosConfirmados', JSON.stringify(pedidosConfirmados));
    actualizarContador();
  });
  listaPedidos.appendChild(pedidoCard);
}

// Confirmar pedido
confirmarPedidoBtn.addEventListener('click', () => {
  const comentario = comentarioInput.value.trim();
  const pedido = {
    nombre: platilloActual.nombre,
    precio: platilloActual.precio,
    comentario: comentario || "Sin comentarios",
    hora: new Date().toLocaleString()
  };
  pedidosConfirmados.push(pedido);
  localStorage.setItem('pedidosConfirmados', JSON.stringify(pedidosConfirmados));
  agregarPedidoVisual(pedido);
  pedidoModal.hide();
  actualizarContador();
});

// Enviar pedidos
enviarCocinaBtn.addEventListener('click', () => {
  if (pedidosConfirmados.length === 0) {
    alert("No hay pedidos para enviar.");
    return;
  }
  console.log("Pedidos enviados a cocina:");
  pedidosConfirmados.forEach(pedido => {
    console.log(`- ${pedido.nombre} ($${pedido.precio}) | Comentario: ${pedido.comentario}`);
  });
  alert("Pedidos enviados a cocina ✅");
  listaPedidos.innerHTML = '';
  pedidosConfirmados.length = 0;
  localStorage.removeItem('pedidosConfirmados');
  actualizarContador();
});

// Cargar pedidos guardados
function cargarPedidosGuardados() {
  const guardados = JSON.parse(localStorage.getItem('pedidosConfirmados')) || [];
  guardados.forEach(pedido => {
    agregarPedidoVisual(pedido);
    pedidosConfirmados.push(pedido);
  });
  actualizarContador();
}

// Contador visual
function actualizarContador() {
  contadorPedidos.textContent = pedidosConfirmados.length;
}

// Cargar categorías guardadas
function cargarCategoriasGuardadas() {
  const guardadas = JSON.parse(localStorage.getItem('categorias'));
  if (guardadas) data.categorias = guardadas;
}

// Formulario categoría
const formCategoria = document.getElementById('form-categoria');
const nombreCategoriaInput = document.getElementById('nombreCategoria');
const estadoAdmin = document.getElementById('estadoAdmin');

formCategoria.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = nombreCategoriaInput.value.trim();
  if (!nombre) return;
  const existe = data.categorias.some(cat => cat.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    estadoAdmin.textContent = `La categoría "${nombre}" ya existe.`;
    return;
  }
  const nuevaCategoria = { id: Date.now(), nombre, platillos: [] };
  data.categorias.push(nuevaCategoria);
  localStorage.setItem('categorias', JSON.stringify(data.categorias));
  mostrarMenu();
  actualizarSelectCategorias();
  mostrarListaCategorias();
  mostrarListaPlatillos();

  estadoAdmin.textContent = `Categoría "${nombre}" agregada correctamente.`;
  nombreCategoriaInput.value = '';
});

// Formulario platillo
const formPlatillo = document.getElementById('form-platillo');
const categoriaPlatilloSelect = document.getElementById('categoriaPlatillo');
const nombrePlatilloInput = document.getElementById('nombrePlatillo');
const descripcionPlatilloInput = document.getElementById('descripcionPlatillo');
const precioPlatilloInput = document.getElementById('precioPlatillo');

function actualizarSelectCategorias() {
  categoriaPlatilloSelect.innerHTML = '';
  data.categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.id;
    option.textContent = categoria.nombre;
    categoriaPlatilloSelect.appendChild(option);
  });
}

formPlatillo.addEventListener('submit', (e) => {
  e.preventDefault();
  const categoriaId = parseInt(categoriaPlatilloSelect.value);
  const nombre = nombrePlatilloInput.value.trim();
  const descripcion = descripcionPlatilloInput.value.trim();
  const precio = parseFloat(precioPlatilloInput.value);
  if (!nombre || isNaN(precio)) return;
  const categoria = data.categorias.find(cat => cat.id === categoriaId);
  if (!categoria) return;
  const nuevoPlatillo = { id: Date.now(), nombre, descripcion, precio };
  categoria.platillos.push(nuevoPlatillo);
  localStorage.setItem('categorias', JSON.stringify(data.categorias));
  mostrarMenu();
  actualizarSelectCategorias();
  mostrarListaPlatillos();

  nombrePlatilloInput.value = '';
  descripcionPlatilloInput.value = '';
  precioPlatilloInput.value = '';
});
// Modal edición de categoría
const modalEditarCategoria = new bootstrap.Modal(document.getElementById('modalEditarCategoria'));
const formEditarCategoria = document.getElementById('formEditarCategoria');
const idCategoriaEditar = document.getElementById('idCategoriaEditar');
const nombreCategoriaEditar = document.getElementById('nombreCategoriaEditar');
const listaCategorias = document.getElementById('listaCategorias');

// Renderiza la lista de categorías con botón de edición
function mostrarListaCategorias() {
  listaCategorias.innerHTML = '';
  data.categorias.forEach(categoria => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.innerHTML = `
      <span>${categoria.nombre}</span>
      <button class="btn btn-sm btn-outline-secondary">
  <i class="bi bi-pencil-square"></i>
</button>

    `;
    item.querySelector('button').addEventListener('click', () => {
      idCategoriaEditar.value = categoria.id;
      nombreCategoriaEditar.value = categoria.nombre;
      modalEditarCategoria.show();
    });
    listaCategorias.appendChild(item);
  });
}

// Maneja el envío del formulario de edición de categoría
formEditarCategoria.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(idCategoriaEditar.value);
  const nuevoNombre = nombreCategoriaEditar.value.trim();
  if (!nuevoNombre) return;

  const categoria = data.categorias.find(cat => cat.id === id);
  if (!categoria) return;

  categoria.nombre = nuevoNombre;
  localStorage.setItem('categorias', JSON.stringify(data.categorias));
  modalEditarCategoria.hide();
  mostrarMenu();
  actualizarSelectCategorias();
  mostrarListaCategorias();
  mostrarListaPlatillos();
});

// Modal edición de platillo
const modalEditarPlatillo = new bootstrap.Modal(document.getElementById('modalEditarPlatillo'));
const formEditarPlatillo = document.getElementById('formEditarPlatillo');
const idCategoriaPlatilloEditar = document.getElementById('idCategoriaPlatilloEditar');
const idPlatilloEditar = document.getElementById('idPlatilloEditar');
const nombrePlatilloEditar = document.getElementById('nombrePlatilloEditar');
const descripcionPlatilloEditar = document.getElementById('descripcionPlatilloEditar');
const precioPlatilloEditar = document.getElementById('precioPlatilloEditar');
const listaPlatillos = document.getElementById('listaPlatillos');

// Renderiza la lista de platillos con botón de edición
function mostrarListaPlatillos() {
  listaPlatillos.innerHTML = '';
  data.categorias.forEach(categoria => {
    categoria.platillos.forEach(platillo => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      item.innerHTML = `
        <span><strong>${platillo.nombre}</strong> (${categoria.nombre}) - $${platillo.precio}</span>
        <button class="btn btn-sm btn-outline-secondary">
  <i class="bi bi-pencil-square"></i>
</button>

      `;
      item.querySelector('button').addEventListener('click', () => {
        idCategoriaPlatilloEditar.value = categoria.id;
        idPlatilloEditar.value = platillo.id;
        nombrePlatilloEditar.value = platillo.nombre;
        descripcionPlatilloEditar.value = platillo.descripcion;
        precioPlatilloEditar.value = platillo.precio;
        modalEditarPlatillo.show();
      });
      listaPlatillos.appendChild(item);
    });
  });
}

// Maneja el envío del formulario de edición de platillo
formEditarPlatillo.addEventListener('submit', (e) => {
  e.preventDefault();

  const idCat = parseInt(idCategoriaPlatilloEditar.value);
  const idPlat = parseInt(idPlatilloEditar.value);
  const nombre = nombrePlatilloEditar.value.trim();
  const descripcion = descripcionPlatilloEditar.value.trim();
  const precio = parseFloat(precioPlatilloEditar.value);

  if (!nombre || isNaN(precio)) return;

  const categoria = data.categorias.find(cat => cat.id === idCat);
  if (!categoria) return;

  const platillo = categoria.platillos.find(p => p.id === idPlat);
  if (!platillo) return;

  platillo.nombre = nombre;
  platillo.descripcion = descripcion;
  platillo.precio = precio;

  localStorage.setItem('categorias', JSON.stringify(data.categorias));
  modalEditarPlatillo.hide();
  mostrarMenu();
  mostrarListaPlatillos();
});

// Inicialización final
cargarCategoriasGuardadas();
actualizarSelectCategorias();
mostrarMenu();
cargarPedidosGuardados();
mostrarListaCategorias();
mostrarListaPlatillos();
