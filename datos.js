class Producto {
  constructor(id, nombreProducto, precio, stock) {
    this.id = id;
    this.nombreProducto = nombreProducto;
    this.precio = precio;
    this.stock = stock;
  }
}

// 1. Definimos el inventario base (por si es la primera vez que el cliente entra a la página)
const inventarioBase = [
  new Producto(1, "Pupusas", 3.5, 50), // Ojo: FER debe decidir si son 50 o 100 como dice en su HTML
  new Producto(2, "Empanadas", 1.5, 30),
  new Producto(3, "Pastelitos", 2.0, 40),
  new Producto(4, "Tamales", 4.0, 20), // Ojo: FER debe decidir si vale $4.00 o $1.00 como dice en su HTML
  new Producto(5, "Arroz en leche", 2.5, 25),
  new Producto(6, "Yuca frita", 3.0, 15),
];

// 2. Revisamos si ya existe un inventario guardado en la memoria del navegador por compras anteriores
const inventarioGuardado = localStorage.getItem("inventarioLS");

// 3. Si existe, cargamos el guardado. Si no existe (es la primera vez), cargamos el base.
const inventario = inventarioGuardado
  ? JSON.parse(inventarioGuardado)
  : inventarioBase;
