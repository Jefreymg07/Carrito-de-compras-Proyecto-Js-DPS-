class Producto {
  constructor(id, nombreProducto, precio, stock) {
    this.id = id;
    this.nombreProducto = nombreProducto;
    this.precio = precio;
    this.stock = stock;
  }
}

const inventario = [
  new Producto(1, "Laptop", 750.0, 15),
  new Producto(2, "Samsung", 1500.0, 20),
  new Producto(3, "Monitor MSI", 200.0, 5),
];

class Carrito {

  constructor() {
    this.carrito = [];
  }
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
    }
  }
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
  eliminarUnidades(id, cantidad) {
    const unidadProducto = this.carrito.find((producto) => producto.id === id);

    if (unidadProducto) {
      const unidadesInventario = inventario.find(
        (producto) => producto.id === unidadProducto.id,
      );
      unidadesInventario.stock += cantidad;

      unidadProducto.cantidad -= cantidad;
    }
  }
  calcularTotalCompra() {
    const pagaTotal = this.carrito.reduce((pagaAcumulada, producto) => {
      return pagaAcumulada + producto.precio * producto.cantidad;
    }, 0);
    return pagaTotal;
  }
}

let miCompra = new Carrito();
miCompra.agregarProducto(1, 3);
miCompra.agregarProducto(2, 3);
console.log(miCompra.carrito);

console.log(inventario[0].stock, inventario[1].stock);

miCompra.eliminarProducto(1);

console.log(inventario[0].stock);

miCompra.eliminarUnidades(2, 2)

console.log(inventario)