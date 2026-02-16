/* CLASE CARRITO (Lógica de Negocio)
  Autor: Persona 2 (Jefrey)
  Responsabilidad: Manejar la lógica de agregar, eliminar y calcular totales.
*/

class Carrito {
  constructor() {
    this.carrito = []; // Inicializamos el carrito vacío
  }

  // --- MÉTODO 1: AGREGAR PRODUCTO ---
  // Verifica stock, agrega al carrito y resta del inventario global.
  agregarProducto(id, cantidad) {
    const buscarProducto = inventario.find((producto) => producto.id === id);

    // Validamos si el producto existe y si hay suficiente stock
    if (buscarProducto && buscarProducto.stock >= cantidad) {
      
      // Buscamos si ya existe en el carrito para no duplicarlo
      const carritoProductos = this.carrito.find(
        (carritoProductoActual) => carritoProductoActual.id === buscarProducto.id
      );

      if (carritoProductos) {
        // Si ya está, solo sumamos la cantidad
        carritoProductos.cantidad += cantidad;
      } else {
        // Si no está, lo agregamos como nuevo objeto
        this.carrito.push({
          id: buscarProducto.id,
          nombre: buscarProducto.nombreProducto,
          precio: buscarProducto.precio,
          cantidad: cantidad,
        });
      }
      
      // Restamos el stock del inventario global (Simulación de base de datos)
      buscarProducto.stock -= cantidad;
    } else {
      console.error(`Error: No hay suficiente stock para el producto ID ${id}`);
    }
  }

  // --- MÉTODO 2: ELIMINAR PRODUCTO COMPLETO ---
  // Elimina el ítem del carrito y devuelve TODO el stock a la tienda.
  eliminarProducto(id) {
    const productoParaEliminar = this.carrito.find((producto) => producto.id === id);

    if (productoParaEliminar) {
      const productOriginal = inventario.find(
        (productoDevuelto) => productoDevuelto.id === productoParaEliminar.id
      );

      // Devolvemos todo el stock
      productOriginal.stock += productoParaEliminar.cantidad;

      // Filtramos para quitar el producto del carrito
      this.carrito = this.carrito.filter(
        (productosActuales) => productosActuales.id !== id
      );
    }
  }

  // --- MÉTODO 3: ELIMINAR POR UNIDADES ---
  // Resta una cantidad específica y devuelve stock parcial.
  eliminarUnidades(id, cantidad) {
    const unidadProducto = this.carrito.find((producto) => producto.id === id);

    if (unidadProducto) {
      const unidadesInventario = inventario.find(
        (producto) => producto.id === unidadProducto.id
      );
      
      // 1. Devolvemos stock a la tienda
      unidadesInventario.stock += cantidad;

      // 2. Restamos cantidad del carrito
      unidadProducto.cantidad -= cantidad;

      // 3. Validación de limpieza: Si llega a 0, se borra del carrito
      if (unidadProducto.cantidad <= 0) {
        this.carrito = this.carrito.filter(
          (productosActuales) => productosActuales.id !== id
        );
      }
    }
  }

  // --- MÉTODO 4: CALCULAR TOTAL ---
  // Usa reduce para sumar (Precio * Cantidad) de todos los items.
  calcularTotalCompra() {
    const pagaTotal = this.carrito.reduce((pagaAcumulada, producto) => {
      return pagaAcumulada + producto.precio * producto.cantidad;
    }, 0);
    return pagaTotal;
  }
}