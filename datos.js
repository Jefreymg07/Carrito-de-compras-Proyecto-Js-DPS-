class Producto {
  constructor(id, nombreProducto, precio, stock) {
    this.id = id;
    this.nombreProducto = nombreProducto;
    this.precio = precio;
    this.stock = stock;
  }
}

const inventario = [
  new Producto(1, "Pupusas", 3.50, 50),
  new Producto(2, "Empanadas", 1.50, 30),
  new Producto(3, "Pastelitos", 2.00, 40),
  new Producto(4, "Tamales", 4.00, 20),
  new Producto(5, "Arroz en leche", 2.50, 25),
  new Producto(6, "Yuca frita", 3.00, 15),
  
];