/* CLASE CARRITO (Lógica de Negocio)
  Responsabilidad: Manejar la lógica de agregar, eliminar y guardar en LocalStorage.
*/

class Carrito {
  constructor() {
    // 1. Cuando la página carga, buscamos si ya había un carrito guardado en el navegador
    const carritoGuardado = localStorage.getItem("carritoLS");

    // Si hay datos guardados, los usamos. Si no, iniciamos el array vacío []
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  // --- NUEVO MÉTODO: Guarda el carrito y el inventario en el disco duro del navegador ---
  sincronizarStorage() {
    localStorage.setItem("carritoLS", JSON.stringify(this.carrito));
    localStorage.setItem("inventarioLS", JSON.stringify(inventario));
  }

  // --- MÉTODO 1: AGREGAR PRODUCTO ---
  agregarProducto(id, cantidad) {
    const buscarProducto = inventario.find((producto) => producto.id === id);

    if (buscarProducto && buscarProducto.stock >= cantidad) {
      const carritoProductos = this.carrito.find(
        (carritoProductoActual) =>
          carritoProductoActual.id === buscarProducto.id,
      );

      if (carritoProductos) {
        carritoProductos.cantidad += cantidad;
      } else {
        this.carrito.push({
          id: buscarProducto.id,
          nombre: buscarProducto.nombreProducto,
          precio: buscarProducto.precio,
          cantidad: cantidad,
        });
      }
      buscarProducto.stock -= cantidad;

      // ¡AQUÍ GUARDAMOS LOS CAMBIOS!
      this.sincronizarStorage();
    } else {
      Swal.fire({
        text: "Lo sentimos, no hay suficiente stock.",
        icon: "info",
        confirmButtonText: "Aceptar",
      });
    }
  }

  // --- MÉTODO 2: ELIMINAR PRODUCTO COMPLETO ---
  eliminarProducto(id) {
    const productoParaEliminar = this.carrito.find(
      (producto) => producto.id === id,
    );

    if (productoParaEliminar) {
      const productOriginal = inventario.find(
        (productoDevuelto) => productoDevuelto.id === productoParaEliminar.id,
      );

      productOriginal.stock += productoParaEliminar.cantidad;

      this.carrito = this.carrito.filter(
        (productosActuales) => productosActuales.id !== id,
      );

      // ¡AQUÍ GUARDAMOS LOS CAMBIOS!
      this.sincronizarStorage();
    }
  }

  // --- MÉTODO 3: ELIMINAR POR UNIDADES ---
  eliminarUnidades(id, cantidad) {
    const unidadProducto = this.carrito.find((producto) => producto.id === id);

    if (unidadProducto) {
      const unidadesInventario = inventario.find(
        (producto) => producto.id === unidadProducto.id,
      );

      unidadesInventario.stock += cantidad;
      unidadProducto.cantidad -= cantidad;

      if (unidadProducto.cantidad <= 0) {
        this.carrito = this.carrito.filter(
          (productosActuales) => productosActuales.id !== id,
        );
      }

      // ¡AQUÍ GUARDAMOS LOS CAMBIOS!
      this.sincronizarStorage();
    }
  }

  // --- MÉTODO 4: CALCULAR TOTAL ---
  calcularTotalCompra() {
    const pagaTotal = this.carrito.reduce((pagaAcumulada, producto) => {
      return pagaAcumulada + producto.precio * producto.cantidad;
    }, 0);
    return pagaTotal;
  }
}

// ==========================================
// 🔌 CONEXIÓN CON EL HTML (INTERACTIVIDAD)
// ==========================================

// 1. Inicializamos tu carrito globalmente
let miCompra = new Carrito();

// Imágenes de los productos
const imagenesProductos = {
  1: "https://comedera.com/wp-content/uploads/sites/9/2023/05/Pupusas-de-queso-shutterstock_1803502444.jpg",
  2: "https://www.recetassalvador.com/base/stock/Recipe/empanadas-salvadorenas/empanadas-salvadorenas_web.jpg.webp",
  3: "https://i.ytimg.com/vi/XFIHpE1R9D0/maxresdefault.jpg",
  4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPOYRVusfLn6-52F1JMY_xe4rwzh9H6vjAwg&s",
  5: "https://peopleenespanol.com/thmb/O4bAeAl5OXtRrGPmtCsHh4UpzDM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/recetas-1092-arroz-con-leche-2000-ac1485846508488e8da95f5f9c8de793.jpg",
  6: "https://i.ytimg.com/vi/dp6oQ7cekPc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD_uCGqj37uh-_NzS1hLcYF4KvUxA",
};

//Seleccionamos los elementos del DOM que vamos a usar para mostrar el carrito y manejar eventos
const elementosUI = {
  btnCarrito: document.getElementById("btn-carrito"),
  modalCarrito: document.getElementById("modal-carrito"),
  cerrarModal: document.getElementById("cerrar-modal-carrito"),
  btnCancelar: document.getElementById("btn-cancelar-carrito"),
  btnPagar: document.getElementById("btn-pagar-carrito"),
  contenedorItems: document.getElementById("carrito-items"),
  total: document.getElementById("carrito-total"),
  contador: document.getElementById("contador-carrito"),
  factura: document.getElementById("factura"),
  modalFactura: document.getElementById("modal-factura"),
  btnCerrar: document.getElementById("btn-cerrar-factura"),
  btnImprimir: document.getElementById("btn-imprimir-factura"),
  subtotalFactura: document.getElementById("subtotal"),
  totalFactura: document.getElementById("factura-total"),
  propinas: document.getElementById("propina"),
  FechaHoras: document.getElementById("hora"),
};

function formatearDinero(valor) {
  return `$ ${valor.toFixed(2)}`;
}

//Inventario disponible
function actualizarStocksVisuales() {
  inventario.forEach((producto) => {
    const stockElemento = document.getElementById(`stock-${producto.id}`);
    if (stockElemento) {
      stockElemento.innerText = producto.stock;
    }
  });
}
// Actualiza el contador del carrito en la esquina del botón cada vez que se agrega o elimina un producto
function actualizarContadorCarrito() {
  const totalUnidades = miCompra.carrito.reduce(
    (acumulado, producto) => acumulado + producto.cantidad,
    0,
  );
  elementosUI.contador.innerText = totalUnidades;
}

//Oculta y hace aparecer la factura
function abrirFactura() {
  elementosUI.modalFactura.classList.remove("oculto");
}

function cerrarFactura() {
  elementosUI.modalFactura.classList.add("oculto");
}

//Oculta y hace aparecer el carrito
function abrirModalCarrito() {
  renderizarCarritoEnModal();
  elementosUI.modalCarrito.classList.remove("oculto");
}

function cerrarModalCarrito() {
  elementosUI.modalCarrito.classList.add("oculto");
}

function renderizarCarritoEnModal() {
  if (!miCompra.carrito.length) {
    elementosUI.contenedorItems.innerHTML =
      '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    elementosUI.total.innerText = "Total a Pagar: $ 0.00";
    return;
  }

  elementosUI.contenedorItems.innerHTML = miCompra.carrito
    .map((producto) => {
      const subtotal = producto.precio * producto.cantidad;
      const imagenProducto =
        imagenesProductos[producto.id] || "https://via.placeholder.com/100";

      return `
        <article class="item-carrito">
          <img src="${imagenProducto}" alt="${producto.nombre}" />
          <div>
            <h3>${producto.nombre}</h3>
            <p class="item-precio">${formatearDinero(producto.precio)}</p>
            <div class="item-controles">
              <label for="cant-modal-${producto.id}">Cantidad:</label>
              <input
                id="cant-modal-${producto.id}"
                class="form-control input-cantidad-item"
                type="number"
                min="1"
                value="${producto.cantidad}"
                data-id="${producto.id}"
              />
              <button class="btn btn-danger btn-eliminar-item" data-id="${producto.id}">Eliminar</button>
            </div>
            <p class="item-subtotal">Subtotal: ${formatearDinero(subtotal)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  elementosUI.total.innerText = `Total a Pagar: ${formatearDinero(
    miCompra.calcularTotalCompra(),
  )}`;
}

//Convertir html en imagen para luego pasar a pdf
function ImprimirFactura() {
  html2canvas(elementosUI.modalFactura, { useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("factura.pdf");

    console.log("Factura impresa");
  });
}

elementosUI.btnCarrito.addEventListener("click", abrirModalCarrito);
elementosUI.cerrarModal.addEventListener("click", cerrarModalCarrito);
elementosUI.btnCancelar.addEventListener("click", cerrarModalCarrito);
elementosUI.btnCerrar.addEventListener("click", cerrarFactura);
elementosUI.btnImprimir.addEventListener("click", ImprimirFactura);

//Factura de carrito:
function generar_factura() {
  elementosUI.factura.innerHTML = miCompra.carrito
    .map((producto) => {
      abrirFactura();

      const subtotal = producto.precio * producto.cantidad;

      return `
        <div>
          <table>
            <tbody>
              <tr>
                <td class="cantidad2">${producto.cantidad}</td>
                <td class="producto2">${producto.nombre}</td>
                <td class="precio-unidad2">${formatearDinero(producto.precio)}</td>
                <td class="total2">${formatearDinero(subtotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    })
    .join("");

  //Subtotal factura
  elementosUI.subtotalFactura.innerHTML = `SUBTOTAL ${formatearDinero(
    miCompra.calcularTotalCompra(),
  )}`;

  const propina = 1.25;
  const ahora = new Date();

  let suma = propina + miCompra.calcularTotalCompra();

  elementosUI.propinas.innerHTML = `PROPINA  $ ${propina}`;

  elementosUI.totalFactura.innerHTML = `TOTAL A PAGAR $ ${suma}`;

  elementosUI.FechaHoras.innerHTML = `Fecha: ${ahora.toLocaleDateString()} - Hora: ${ahora.toLocaleTimeString()}`;

  //reseteo de compra
  miCompra.carrito = [];
  miCompra.sincronizarStorage();
  renderizarCarritoEnModal();
  actualizarContadorCarrito();
}

elementosUI.btnPagar.addEventListener("click", () => {
  if (!miCompra.carrito.length) {
    Swal.fire({
      text: `Tu carrito esta vacio`,
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    cerrarModalCarrito();
    return;
  }

  //Factura:
  generar_factura();
});

elementosUI.modalCarrito.addEventListener("click", (event) => {
  if (event.target === elementosUI.modalCarrito) {
    cerrarModalCarrito();
  }
});

elementosUI.contenedorItems.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-eliminar-item")) {
    const id = parseInt(event.target.dataset.id);
    miCompra.eliminarProducto(id);
    actualizarStocksVisuales();
    actualizarContadorCarrito();
    renderizarCarritoEnModal();
  }
});

elementosUI.contenedorItems.addEventListener("change", (event) => {
  if (!event.target.classList.contains("input-cantidad-item")) {
    return;
  }

  const id = parseInt(event.target.dataset.id);
  const nuevaCantidad = parseInt(event.target.value);
  const productoCarrito = miCompra.carrito.find(
    (producto) => producto.id === id,
  );

  if (!productoCarrito || Number.isNaN(nuevaCantidad) || nuevaCantidad < 1) {
    renderizarCarritoEnModal();
    return;
  }

  if (nuevaCantidad > productoCarrito.cantidad) {
    miCompra.agregarProducto(id, nuevaCantidad - productoCarrito.cantidad);
  } else if (nuevaCantidad < productoCarrito.cantidad) {
    miCompra.eliminarUnidades(id, productoCarrito.cantidad - nuevaCantidad);
  }

  actualizarStocksVisuales();
  actualizarContadorCarrito();
  renderizarCarritoEnModal();
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarStocksVisuales();
  actualizarContadorCarrito();
});

// 2. Función que se ejecuta cuando el usuario hace clic en "Seleccionar Producto"
function procesarSeleccion(id) {
  const inputCant = document.getElementById(`cant-${id}`);
  const cantidadSeleccionada = parseInt(inputCant.value);

  if (Number.isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1) {
    Swal.fire({
      title: "Error",
      text: "Debes ingresar una cantidad valida",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    inputCant.value = 1;
    return;
  }

  // Ejecutamos TU método poderoso
  miCompra.agregarProducto(id, cantidadSeleccionada);

  // Actualizamos el número de stock visual en la tarjeta
  const productoActualizado = inventario.find((p) => p.id === id);
  document.getElementById(`stock-${id}`).innerText = productoActualizado.stock;

  // Devolvemos el input a 1
  inputCant.value = 1;

  actualizarContadorCarrito();
  if (!elementosUI.modalCarrito.classList.contains("oculto")) {
    renderizarCarritoEnModal();
  }

  console.log("🛒 Carrito actual:", miCompra.carrito);
  console.log("💵 Total a pagar: $", miCompra.calcularTotalCompra());
}
