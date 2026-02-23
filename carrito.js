/* CLASE CARRITO (Lógica de Negocio)
  Autor: Persona 2 (Jefrey)
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
      alert(`Lo sentimos, no hay suficiente stock.`);
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

// 2. Función que se ejecuta cuando el usuario hace clic en "Seleccionar Producto"
function procesarSeleccion(id) {
  const inputCant = document.getElementById(`cant-${id}`);
  const cantidadSeleccionada = parseInt(inputCant.value);

  // Ejecutamos TU método poderoso
  miCompra.agregarProducto(id, cantidadSeleccionada);

  // Actualizamos el número de stock visual en la tarjeta
  const productoActualizado = inventario.find((p) => p.id === id);
  document.getElementById(`stock-${id}`).innerText = productoActualizado.stock;

  // Devolvemos el input a 1
  inputCant.value = 1;

  console.log("🛒 Carrito actual:", miCompra.carrito);
  console.log("💵 Total a pagar: $", miCompra.calcularTotalCompra());
}
