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

// Criterio 2: Permitir seleccionar productos e ingresar cantidad deseada
function procesarSeleccion(id) {
    // 1. Obtener la cantidad que el usuario ingresó en el input
    const inputCant = document.getElementById(`cant-${id}`);
    const cantidadSeleccionada = parseInt(inputCant.value);

    // 2. Buscar el producto en el inventario para validar stock
    const producto = inventario.find(p => p.id === id);

    if (producto && producto.stock >= cantidadSeleccionada) {
        // Si hay stock, se "selecciona" (en este caso, simulamos la resta del stock disponible)
        producto.stock -= cantidadSeleccionada;
        
        // Actualizamos visualmente el stock en la card (Punto 1 dinámico)
        document.getElementById(`stock-${id}`).innerText = producto.stock;
        
        alert(`Has seleccionado ${cantidadSeleccionada} unidad(es) de ${producto.nombreProducto}`);
    } else {
        alert("Lo sentimos, no hay suficiente cantidad disponible.");
    }
}