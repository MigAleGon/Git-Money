// variables constantes que detectan el 
// elemento con ese id en el HTML(document)

const botonIngreso = document.getElementById("btn-ingreso");
const botonGasto = document.getElementById("btn-gasto");
const dialogoMovimiento = document.getElementById("dialogo-movimiento");
const botonCerrar = document.getElementById("btn-cerrar")

// Función para detectar eventos que ocurren en el html
botonIngreso.addEventListener("click", function() {
    // Muestra el elemento oculto dialog
    dialogoMovimiento.showModal();
});

botonCerrar.addEventListener("click", function() {
    // Cierra dialog
    dialogoMovimiento.close();
})

botonGasto.addEventListener("click", function() {
    console.log("wep wep :c");
});