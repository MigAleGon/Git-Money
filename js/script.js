// Referencias a los elementos de la interfaz.
const botonIngreso = document.getElementById("btn-ingreso")
const botonGasto = document.getElementById("btn-gasto")
const botonCerrar = document.getElementById("btn-cerrar")
const botonGuardar = document.getElementById("btn-guardar")
const botonesFiltros = document.querySelectorAll(".btn-filtro")
const botonDesde = document.getElementById("boton-desde")
const botonHasta = document.getElementById("boton-hasta")

const dialogoMovimiento = document.getElementById("dialogo-movimiento")
const tituloMovimiento = document.getElementById("titulo-movimiento")
const formularioMovimiento = document.getElementById("formulario-movimiento")
const campoProcedencia = document.getElementById("campo-procedencia")
const procedencia = document.getElementById("procedencia")
const campoMedioPago = document.getElementById("campo-medio-pago")
const medioPago = document.getElementById("medioPago")
const fecha = document.getElementById("fecha")
const hora = document.getElementById("hora")
const categoriaMovimiento = document.getElementById("categoria-movimiento")
const saldosCuentas = document.getElementById("saldos-cuentas")
const cuentaMovimiento = document.getElementById("cuenta-movimiento")
const concepto = document.getElementById("concepto")
const importe = document.getElementById("importe")
const notas = document.getElementById("notas")
const tarjetaBalance = document.getElementById("tarjeta-balance")
const tarjetaIngresos = document.getElementById("tarjeta-ingresos")
const tarjetaGastos = document.getElementById("tarjeta-gastos")
const cuerpoTabla = document.querySelector("tbody")

const errorCargaMovimientos = document.getElementById("error-carga-movimientos")
const errorTabla = document.getElementById("error-tabla")
const errorFormulario = document.getElementById("error-formulario")

// Datos del servidor y selección actual de la interfaz.
let categorias = []
let movimientos = []
let cuentas = []
let tipoMovimiento
let idMovimientoEditar = null
let datosFiltro = "todos"
let datosCargados = false
const borradosEnCurso = new Set()

function mostrarAviso(aviso, mensaje = "") {
    aviso.hidden = mensaje === ""
    aviso.textContent = mensaje
}

// Sin datos se hace un GET. Con datos se envía un POST en JSON.
async function solicitarJson(ruta, mensajeError, datos) {
    const opciones = datos === undefined
        ? undefined
        : {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datos)
        }

    let respuesta
    let contenido
    try {
        respuesta = await fetch(ruta, opciones)
        contenido = await respuesta.json()
    } catch {
        throw new Error(mensajeError)
    }

    if (!respuesta.ok) {
        if (respuesta.status >= 400 && respuesta.status < 500 && contenido?.mensaje) {
            //los backticks `` permiten escribir un error personalizado
            throw new Error(`${mensajeError} ${contenido.mensaje}`)
        }
        throw new Error(mensajeError)
    }

    return contenido
}

async function cargarCategorias() {
    const mensaje = "No se pudieron cargar las categorías. Recarga la página para reintentar."
    const datos = await solicitarJson("php/listar-categorias.php", mensaje)
    
    // Array.isArray comprueba si el parámetro es un array
    if (!Array.isArray(datos)) {
        throw new Error(mensaje)
    }

    return datos
}

async function cargarCuentas(){
    const mensaje = "No se pudieron cargar las cuentas. Regarga la página para reintentar"
    const datos = await solicitarJson("php/listar-cuentas.php", mensaje)

    if (!Array.isArray(datos)){
        throw new Error(mensaje)
    }

    return datos
}

async function cargarMovimientos() {
    const mensaje = "No se pudieron cargar los movimientos. Recarga la página para reintentar."
    const datos = await solicitarJson("php/listar-movimientos.php", mensaje)
   
    // some() comprueba si al menos 1 de los elementos 
    // del array cumple la condición
    // movimiento => es una función, la flecha equivale a un return
    // ? evita que se produzca un error si movimiento es null o undefined
    if (!Array.isArray(datos) || datos.some(movimiento => typeof movimiento?.hora !== "string")) {
        throw new Error(mensaje)
    }

    // map() recorre un array, aplica una función a cada elemento
    // y devuelve otro array con los resultados
    return datos.map(normalizarMovimiento)
}

function normalizarMovimiento(movimiento) {
    return {
        // ... tiene las propiedades restantes de movimiento
        // también crea un objeto identico a movimiento
        ...movimiento,
        id: Number(movimiento.id),
        importe: Number(movimiento.importe),
        categoria: String(movimiento.categoria),
        hora: movimiento.hora.slice(0, 5)
    }
}

// Reutiliza el formulario para ingresos y gastos, reiniciando sus valores.
function abrirVentana(textoTitulo, tipo, movimientoEditar = null) {
    tipoMovimiento = tipo
    formularioMovimiento.reset()
    mostrarAviso(errorFormulario)

    dialogoMovimiento.setAttribute("data-tipo", tipo)

    if (tipo === "ingreso") {
        campoProcedencia.hidden = false
        procedencia.disabled = false
        procedencia.required = true
        campoMedioPago.hidden = true
        medioPago.disabled = true
        medioPago.required = false
    } else if (tipo === "gasto") {
        campoProcedencia.hidden = true
        procedencia.disabled = true
        procedencia.required = false
        campoMedioPago.hidden = false
        medioPago.disabled = false
        medioPago.required = true
    }

    // Usa la fecha y hora locales para rellenar los campos del formulario.
    const ahora = new Date()
    const anio = String(ahora.getFullYear())
    const mes = String(ahora.getMonth() + 1).padStart(2, "0")
    const dia = String(ahora.getDate()).padStart(2, "0")
    const fechaActual = anio + "-" + mes + "-" + dia

    const horaNum = String(ahora.getHours()).padStart(2, "0")
    const minutos = String(ahora.getMinutes()).padStart(2, "0")
    const horaActual = horaNum + ":" + minutos

    tituloMovimiento.textContent = textoTitulo
    fecha.value = fechaActual
    hora.value = horaActual

    categoriaMovimiento.replaceChildren()
    const categoriaDef = new Option("Selecciona una categoría", "")
    categoriaMovimiento.add(categoriaDef)

    cuentaMovimiento.replaceChildren()
    const cuentaDef = new Option("Selecciona una cuenta", "")
    cuentaMovimiento.add(cuentaDef)

    // Ofrece únicamente categorías del mismo tipo que el movimiento.
    const categoriasDisponibles = categorias.filter(function(categoria) {
        return categoria.tipo === tipo
    })
    for(const categoria of categoriasDisponibles){
        const categoriaOpcion = new Option(categoria.nombre, categoria.id)
        categoriaMovimiento.add(categoriaOpcion)
    }

    for(const cuenta of cuentas){
        const cuentaOpcion = new Option(cuenta.nombre, cuenta.id)
        cuentaMovimiento.add(cuentaOpcion)
    }

    if (movimientoEditar !== null) {
        idMovimientoEditar = movimientoEditar.id
        concepto.value = movimientoEditar.concepto
        importe.value = movimientoEditar.importe
        categoriaMovimiento.value = movimientoEditar.categoria
        cuentaMovimiento.value = movimientoEditar.cuenta
        fecha.value = movimientoEditar.fecha
        hora.value = movimientoEditar.hora
        notas.value = movimientoEditar.notas ?? ""

        if (tipoMovimiento === "ingreso"){
            procedencia.value = movimientoEditar.procedencia
        } else if (tipoMovimiento === "gasto") {
            medioPago.value = movimientoEditar.medioPago?.toLowerCase() ?? ""
        }
    } else {
        idMovimientoEditar = null
    }

    dialogoMovimiento.showModal()
}

// Calcula ingresos y gastos del mes actual, y el balance de todo el historial.
function calcularMovimiento() {
    let totalIngresos = 0
    let totalGastos = 0
    let totalBalance = 0
    const ahora = new Date()

    for (const movimiento of movimientos) {
        const anio = movimiento.fecha.split("-")[0]
        const mes = movimiento.fecha.split("-")[1]

        if (anio === String(ahora.getFullYear()) &&
           mes === String((ahora.getMonth() + 1)).padStart(2, "0")) {
            if (movimiento.tipo === "ingreso") {
                totalIngresos += movimiento.importe
            } else if (movimiento.tipo === "gasto") {
                totalGastos -= movimiento.importe
            }
        }

        if (movimiento.tipo === "ingreso") {
            totalBalance += movimiento.importe
        } else if(movimiento.tipo === "gasto"){
            totalBalance -= movimiento.importe
        }
    }

    tarjetaIngresos.textContent = totalIngresos.toFixed(2) + " €"
    tarjetaGastos.textContent = totalGastos.toFixed(2) + " €"
    tarjetaBalance.textContent = totalBalance.toFixed(2) + " €"

    mostrarSaldosCuentas()
}

function calcularSaldoCuenta(cuenta){
    let saldoInicial = Number(cuenta.saldoInicial)

    for (const movimiento of movimientos) {
        if (String(movimiento.cuenta) === String(cuenta.id)) {
            if (movimiento.tipo === "ingreso") {
                saldoInicial += movimiento.importe
            } else if (movimiento.tipo === "gasto") {
                saldoInicial -= movimiento.importe
            }
        }
    }

    return saldoInicial
}

function mostrarSaldosCuentas(){
    saldosCuentas.replaceChildren()

    for (const saldoCuenta of cuentas) {
        const listaCuenta = document.createElement("li")
        listaCuenta.textContent = `${saldoCuenta.nombre}: ${calcularSaldoCuenta(saldoCuenta).toFixed(2)} €`
        
        saldosCuentas.appendChild(listaCuenta)
    }
}

// Apertura y cierre del formulario.
botonIngreso.addEventListener("click", function() {
    abrirVentana("Registrar ingreso" , "ingreso")
})

botonGasto.addEventListener("click", function() {
    abrirVentana("Registrar gasto", "gasto")
})

botonCerrar.addEventListener("click", function() {
    dialogoMovimiento.close()
})

dialogoMovimiento.addEventListener("cancel", function(evento) {
    if (botonGuardar.disabled) {
        evento.preventDefault()
    }
})

// Menú de usuario aparcado: sus elementos HTML también están comentados.
/*
const botonUsuario = document.getElementById("boton-usuario")
const panelUsuario = document.getElementById("panel-usuario")
const menuUsuario = document.querySelector(".usuario-menu")

botonUsuario.addEventListener("click", function() {
    panelUsuario.hidden = !panelUsuario.hidden

    botonUsuario.setAttribute("aria-expanded", !panelUsuario.hidden)
})

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && !panelUsuario.hidden) {
        panelUsuario.hidden = true
        botonUsuario.setAttribute("aria-expanded", "false")
        botonUsuario.focus()
    }
})

document.addEventListener("click", function(evento) {
    if (!panelUsuario.hidden && !menuUsuario.contains(evento.target)) {
        panelUsuario.hidden = true
        botonUsuario.setAttribute("aria-expanded", "false")
    }
})
*/

botonDesde.addEventListener("change", function(){
    mostrarMovimientos()
})

botonHasta.addEventListener("change", function(){
    mostrarMovimientos()
})
// Recoge el formulario, envía los datos y actualiza la vista local.
formularioMovimiento.addEventListener("submit", async function(evento) {
    evento.preventDefault()

    if (!datosCargados || botonGuardar.disabled) {
        return
    }

    mostrarAviso(errorFormulario)
    const conceptoValor = concepto.value.trim()
    const importeValor = Number(importe.value)
    const categoriaValor = categoriaMovimiento.value
    const cuentaValor = cuentaMovimiento.value
    const fechaValor = fecha.value
    const horaValor = hora.value
    const notasValor = notas.value
    let procedenciaValor
    let medioPagoValor

    if(conceptoValor === "") {
        mostrarAviso(errorFormulario, "Escribe un concepto para el movimiento.")
        
        // coloca el foco (tab) en el concepto
        concepto.focus()
        return
    }

    if (tipoMovimiento === "ingreso") {
        procedenciaValor = procedencia.value.trim()
        medioPagoValor = null
    } else if (tipoMovimiento === "gasto") {
        procedenciaValor = null
        medioPagoValor = medioPago.value
    }

    const movimiento = {
        concepto: conceptoValor,
        importe: importeValor,
        categoria: categoriaValor,
        cuenta: cuentaValor,
        fecha: fechaValor,
        hora: horaValor,
        procedencia: procedenciaValor,
        medioPago: medioPagoValor,
        notas: notasValor,
        tipo: tipoMovimiento
    }

    const esEdicion = idMovimientoEditar !== null
    if (esEdicion) {
        movimiento.id = idMovimientoEditar
    }

    const ruta = esEdicion ? "php/editar-movimiento.php" : "php/guardar-movimiento.php"
    const mensajeError = esEdicion ? "No se pudo editar el movimiento." : "No se pudo guardar el movimiento."
    botonGuardar.disabled = true
    botonCerrar.disabled = true
    botonGuardar.textContent = "Guardando…"

    let guardado
    try {
        const respuesta = await solicitarJson(ruta, mensajeError, movimiento)
        const id = Number(respuesta?.id)

        // comprueba que un valor sea un número entero 
        // dentro del rango de enteros que JavaScript puede representar con precisión
        if (!Number.isSafeInteger(id) || id <= 0 || (esEdicion && id !== movimiento.id)) {
            throw new Error(mensajeError)
        }
        guardado = esEdicion
            ? normalizarMovimiento({...movimiento, ...respuesta})
            : {...movimiento, id}
    } catch (error) {
        mostrarAviso(errorFormulario, error.message)
        return
    } finally {
        botonGuardar.disabled = false
        botonCerrar.disabled = false
        botonGuardar.textContent = "Guardar"
    }

    if (esEdicion) {
        const original = movimientos.find(elemento => elemento.id === guardado.id)
        if (original) {

            // toma como parámetros dos objetos
            // compara el primero con el segundo
            // el primero lo copia y le añade las propiedades del segundo,
            // si existen dos claves iguales, las del segundo sobreescriben las del primero
            Object.assign(original, guardado)
        }
    } else {
        movimientos.push(guardado)
    }

    calcularMovimiento()
    mostrarMovimientos()

    dialogoMovimiento.close()
})

// Mantiene un único filtro activo y vuelve a dibujar la tabla.
for (const boton of botonesFiltros){
    boton.addEventListener("click", function() {
        for(const botonFiltro of botonesFiltros){
            botonFiltro.setAttribute("aria-pressed", "false")
        }
        boton.setAttribute("aria-pressed" , "true")

        datosFiltro = boton.dataset.filtro
        mostrarMovimientos()
    })
}

// Reconstruye la tabla según el filtro, con los movimientos más recientes primero.
function mostrarMovimientos(){
    if (!datosCargados) {
        return
    }

    cuerpoTabla.replaceChildren()

    // Ordena una copia para conservar el orden de la lista original.
    let movimientosCopia = movimientos.slice()

    movimientosCopia.sort(function(a, b) {
        const fechaHoraA = a.fecha + "T" + a.hora
        const fechaHoraB = b.fecha + "T" + b.hora

        if(fechaHoraA > fechaHoraB) {
            return -1
        } else if(fechaHoraA < fechaHoraB) {
            return 1
        } else {
            return 0
        }
    })

    const desde = botonDesde.value
    const hasta = botonHasta.value

    for(const movimiento of movimientosCopia){
        const rangoFecha = (desde === "" || movimiento.fecha >= desde) &&
            (hasta === "" || movimiento.fecha <= hasta)

        if((datosFiltro === "todos" || datosFiltro === movimiento.tipo) && rangoFecha){
            const fila = document.createElement("tr")
            const botonesContenedor = document.createElement("span")
            const celdaConcepto = document.createElement("td")
            const celdaCategoria = document.createElement("td")
            const celdaFecha = document.createElement("td")
            const celdaHora = document.createElement("td")
            const celdaImporte = document.createElement("td")
            const botonEditar = document.createElement("button")
            const botonBorrar = document.createElement("button")

            // Convierte la fecha ISO (AAAA-MM-DD) al formato DD/MM/AAAA.
            const partesFecha = movimiento.fecha.split("-")
            const anio = partesFecha[0]
            const mes = partesFecha[1]
            const dia = partesFecha[2]
            const fechaFormateada = dia + "/" + mes + "/" + anio

            const categoriaEncontrada = categorias.find(function(categoria){
                return String(categoria.id) === movimiento.categoria
            })

            fila.classList.add("fila-movimiento")
            fila.setAttribute("role", "row")
            const celdas = [celdaConcepto, celdaCategoria, celdaFecha, celdaHora, celdaImporte]
            for (const celda of celdas) {
                celda.setAttribute("role", "cell")
            }
            celdaConcepto.classList.add("movimiento-concepto")
            celdaCategoria.classList.add("movimiento-categoria")
            celdaFecha.classList.add("movimiento-fecha")
            celdaHora.classList.add("movimiento-hora")
            celdaImporte.classList.add("movimiento-importe")

            celdaConcepto.textContent = movimiento.concepto
            celdaCategoria.textContent = categoriaEncontrada?.nombre ?? "Categoría no disponible"
            celdaFecha.textContent = fechaFormateada
            celdaHora.textContent = movimiento.hora
            botonEditar.setAttribute("aria-label", "Editar movimiento")
            botonEditar.type = "button"
            botonEditar.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M4 16l-1 5 5-1L21 7l-4-4L4 16Z M14 6l4 4"/>
                        </svg>
                    `
            botonEditar.classList.add("boton-tabla", "boton-editar")
            botonBorrar.setAttribute("aria-label", "Borrar movimiento")
            botonBorrar.type = "button"
            botonBorrar.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7"/>
                        </svg>
                    `
            botonBorrar.classList.add("boton-tabla", "boton-borrar")
            botonesContenedor.classList.add("acciones-movimiento")

            botonBorrar.addEventListener("click", async function() {
                if (borradosEnCurso.has(movimiento.id) || !confirm("¿Seguro que quieres borrar este movimiento?")) {
                    return
                }

                mostrarAviso(errorTabla)
                borradosEnCurso.add(movimiento.id)
                botonBorrar.disabled = true
                try {
                    await solicitarJson("php/borrar-movimiento.php", "No se pudo borrar el movimiento.", {id: movimiento.id})
                } catch (error) {
                    mostrarAviso(errorTabla, error.message)
                    return
                } finally {
                    borradosEnCurso.delete(movimiento.id)
                    botonBorrar.disabled = false
                }

                movimientos = movimientos.filter(function(otroMovimiento) {
                    return movimiento.id !== otroMovimiento.id
                })

                mostrarMovimientos()
                calcularMovimiento()
            })

            botonEditar.addEventListener("click", function() {
                if (!borradosEnCurso.has(movimiento.id)) {
                    abrirVentana("Editar movimiento", movimiento.tipo, movimiento)
                }
            })

            if(movimiento.tipo === "ingreso"){
                celdaImporte.textContent = "+" + movimiento.importe.toFixed(2) + " €"

                celdaImporte.classList.add("importe-ingreso")
            } else if(movimiento.tipo === "gasto"){
                celdaImporte.textContent = "-" + movimiento.importe.toFixed(2) + " €"
                celdaImporte.classList.add("importe-gasto")
            }

            botonesContenedor.append(botonEditar)
            botonesContenedor.append(botonBorrar)
            celdaImporte.append(botonesContenedor)
            fila.append(...celdas)

            cuerpoTabla.append(fila)
        }
    }

    // Muestra un mensaje cuando el filtro no produce filas.
    if(cuerpoTabla.children.length === 0){
        const filaVacia = document.createElement("tr")
        const celdaVacia = document.createElement("td")

        filaVacia.classList.add("fila-vacia")
        filaVacia.setAttribute("role", "row")
        celdaVacia.colSpan = 5
        celdaVacia.setAttribute("role", "cell")
        celdaVacia.classList.add("celda-vacia")

        
        if (desde !== "" && hasta !== "" && desde > hasta) {
            celdaVacia.textContent = "La fecha  <Desde> debe ser anterior o igual a la fecha <Hasta>"
        } else if (movimientos.length === 0) {
            celdaVacia.textContent = "Aún no se han registrado movimientos"
        } else {
            celdaVacia.textContent = "No hay movimientos que coincidan con los filtros"
        }
           

        filaVacia.append(celdaVacia)
        cuerpoTabla.append(filaVacia)
    }
}

// Dibuja el estado inicial e inicia las peticiones de datos.

async function iniciarPagina(){
    try {
        const [categoriasGuardadas, movimientosGuardados, cuentasGuardadas] = 
        // En lugar de esperar a que inicie una y luego otra como haríamos con await
        // Aquí inician las dos a la vez
        // como hacer los await simultaneamente
        // luego devuelve un array con los resultados de las funciones
            await Promise.all([
                cargarCategorias(), 
                cargarMovimientos(),
                cargarCuentas()
            ])
        categorias = categoriasGuardadas
        movimientos = movimientosGuardados
        cuentas = cuentasGuardadas
    } catch (error) {
        mostrarAviso(errorCargaMovimientos, error.message)
        return
    }

    datosCargados = true
    botonIngreso.disabled = false
    botonGasto.disabled = false
    mostrarMovimientos()
    calcularMovimiento()
}


iniciarPagina()
