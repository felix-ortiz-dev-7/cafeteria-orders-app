// Datos base del menú: categorías y platillos disponibles
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

// Referencias a elementos del DOM
const menuContainer = document.getElementById('menu');
const platilloSeleccionadoElem = document.getElementById('platilloSeleccionado');
const comentarioInput = document.getElementById('comentario');
const confirmarPedidoBtn = document.getElementById('confirmarPedido');
const listaPedidos = document.getElementById('lista-pedidos');
const enviarCocinaBtn = document.getElementById('enviarCocina');
const contadorPedidos = document.getElementById('contadorPedidos');

// Instancia del modal de Bootstrap
const pedidoModal = new bootstrap.Modal(document.getElementById('pedidoModal'));

// Estado actual del platillo seleccionado
let platilloActual = null;

// Lista de pedidos confirmados
const pedidosConfirmados = [];

// Renderiza el menú dinámicamente a partir de los datos
function mostrarMenu() {
  menuContainer.innerHTML = '';

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
            <button class="btn btn-primary w-100">Seleccionar</button>
          </div>
        </div>
      `;

      // Asocia el platillo al modal de confirmación
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

// Agrega un pedido visualmente y lo vincula al botón de eliminación
function agregarPedidoVisual(pedido) {
  const pedidoCard = document.createElement('div');
  pedidoCard.classList.add('card', 'mb-3', 'shadow-sm');

  pedidoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${pedido.nombre} - $${pedido.precio}</h5>
      <p class="card-text"><strong>Comentario:</strong> ${pedido.comentario}</p>
      <p class="card-text text-muted">🕒 ${pedido.hora}</p>
      <button class="btn btn-outline-danger btn-sm">Eliminar</button>
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

// Confirma el pedido y lo guarda en localStorage
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

// Envía todos los pedidos a cocina (simulado)
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

// Recupera pedidos guardados al cargar la página
function cargarPedidosGuardados() {
  const guardados = JSON.parse(localStorage.getItem('pedidosConfirmados')) || [];
  guardados.forEach(pedido => {
    agregarPedidoVisual(pedido);
    pedidosConfirmados.push(pedido);
  });
  actualizarContador();
}

// Actualiza el contador visual de pedidos confirmados
function actualizarContador() {
  contadorPedidos.textContent = pedidosConfirmados.length;
}

// Inicializa la vista
mostrarMenu();
cargarPedidosGuardados();
