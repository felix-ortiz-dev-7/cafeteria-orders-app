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

const menuContainer = document.getElementById('menu');
const platilloSeleccionadoElem = document.getElementById('platilloSeleccionado');
const comentarioInput = document.getElementById('comentario');
const confirmarPedidoBtn = document.getElementById('confirmarPedido');

// Instancia del modal de Bootstrap
const pedidoModal = new bootstrap.Modal(document.getElementById('pedidoModal'));

let platilloActual = null; // Guardará el platillo que se selecciona

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

      // Evento para abrir el modal
      platilloCard.querySelector('button').addEventListener('click', () => {
        platilloActual = platillo;
        platilloSeleccionadoElem.textContent = `${platillo.nombre} - $${platillo.precio}`;
        comentarioInput.value = ''; // Limpiamos el campo
        pedidoModal.show();
      });

      menuContainer.appendChild(platilloCard);
    });
  });
}

// Evento para confirmar pedido
confirmarPedidoBtn.addEventListener('click', () => {
  const comentario = comentarioInput.value.trim();
  console.log("Pedido confirmado:", {
    platillo: platilloActual.nombre,
    precio: platilloActual.precio,
    comentario: comentario || "Sin comentarios"
  });
  pedidoModal.hide();
});

mostrarMenu();
