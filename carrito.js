/* CLASE CARRITO (Lógica de Negocio)
  Autor: Persona 2 (Jefrey)
  Responsabilidad: Manejar la lógica de agregar, eliminar y calcular totales.
*/

class Carrito {
  constructor() {
    this.carrito = []; // Inicializamos el carrito vacío
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
    } else {
      console.error(`Error: No hay suficiente stock para el producto ID ${id}`);
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

// 1. Inicializamos tu carrito globalmente para que exista al cargar la página
let miCompra = new Carrito();

// 2. Función que se ejecuta cuando el usuario hace clic en "Seleccionar Producto" en el HTML
function procesarSeleccion(id) {
  // Capturamos el número que el usuario escribió en el input
  const inputCant = document.getElementById(`cant-${id}`);
  const cantidadSeleccionada = parseInt(inputCant.value);

  // Ejecutamos TU método poderoso para agregarlo a la lógica
  miCompra.agregarProducto(id, cantidadSeleccionada);

  // Actualizamos el número de stock visual en la tarjeta
  const productoActualizado = inventario.find((p) => p.id === id);
  document.getElementById(`stock-${id}`).innerText = productoActualizado.stock;

  // Devolvemos el input a 1 por comodidad del usuario
  inputCant.value = 1;

  // Mensaje en consola para que veas cómo se va llenando tu carrito
  console.log("🛒 Carrito actual:", miCompra.carrito);
  console.log("💵 Total a pagar: $", miCompra.calcularTotalCompra());
}
