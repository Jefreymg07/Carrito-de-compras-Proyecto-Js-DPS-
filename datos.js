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