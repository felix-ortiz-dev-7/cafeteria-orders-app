# Wake Up! – Sistema de Pedidos  
### Changelog (notas personales)

## [Unreleased]
- Ideas futuras: exportar pedidos a PDF, modo oscuro, animaciones en pedidos.

---

## [1.0.0] - 2025-12-28
### Layout
- Reacomodé todo en dos columnas (menú/mesera a la izquierda, admin a la derecha).
- Quité un `</div>` extra que estaba rompiendo el scroll.
- El fondo con el logo ya no se duplica y el scroll funciona bien.

### Branding
- El logo blanco (`logo.png`) se ve bien en el header oscuro.
- Ajusté el fondo con `logoBlack.png` para que aparezca solo una vez y con opacidad baja.

### Vista Mesera
- Menú dinámico con categorías y platillos cargados desde `localStorage`.
- Modal de pedido funcionando: selecciona platillo, agrega comentario y confirma.
- Contador de pedidos actualizado en tiempo real.
- Filtro por estado de pedido (Pendiente, En preparación, Listo, Entregado).
- Alertas cada 15 min para pedidos que no avanzan.

### Vista Administración
- Formularios para agregar categorías y platillos.
- Validación para evitar duplicados (ahora con `alert()` en vez de `estadoAdmin`).
- Listas editables con botones de editar y eliminar.
- Modales para editar categorías y platillos funcionando.

### General
- IDs sincronizados entre HTML y JS (ya no hay referencias rotas).
- Inicialización carga todo desde `localStorage` (categorías, platillos y pedidos).
- Todo el flujo de agregar, editar, eliminar y confirmar está completo.
