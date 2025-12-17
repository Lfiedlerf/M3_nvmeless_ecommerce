// =========================================
// 1. CONFIGURACIÓN Y DATOS (MODELO)
// =========================================

// A) Catálogo de Productos (Basado en tus HTMLs)
const catalogo = [
    { id: 1, nombre: "Mochila Gothic Cross", precio: 69990, img: "assets/img/mochila-canvas.jpeg" },
    { id: 2, nombre: "Botas Platform", precio: 89990, img: "assets/img/botas-platform.jpeg" },
    { id: 3, nombre: "Chaqueta Denim", precio: 55990, img: "assets/img/chaqueta-denim.jpg" },
    { id: 4, nombre: "Falda Black & Red", precio: 42990, img: "assets/img/falda-goth.jpeg" },
    { id: 5, nombre: "Polera Skull", precio: 24990, img: "assets/img/polera-graphic.jpeg" },
    { id: 6, nombre: "Polerón Oversize", precio: 35990, img: "assets/img/poleron-oversize.jpeg" },
    { id: 7, nombre: "Choker Spikes", precio: 12990, img: "assets/img/choker-spikes.jpeg" }
];

// B) Estado del Carrito y Usuario
let carrito = [];
let descuentoAplicado = false;
const CODIGO_DESCUENTO = "DESC15";

// C) Autenticación
const PASSWORD_MAESTRA = "1234";
let usuarioLogueado = false;

// =========================================
// 2. LÓGICA DEL CARRITO (CONTROLADOR)
// =========================================

/**
 * Agrega un producto al carrito buscándolo por su ID en el catálogo
 */
function agregarProducto(idProducto) {
    const productoEncontrado = catalogo.find(p => p.id === idProducto);
    
    if (productoEncontrado) {
        // Agregamos una copia del producto para no mutar el catálogo original
        carrito.push({ ...productoEncontrado });
        console.log(`Producto agregado: ${productoEncontrado.nombre}`);
        
        // Actualizamos la vista
        actualizarContadorCarrito();
        renderizarCarrito();
        
        // Feedback visual simple (Alerta)
        alert("Producto agregado al carrito");
    } else {
        console.error("Producto no encontrado");
    }
}

/**
 * Elimina UN producto del carrito por su ID (la primera coincidencia)
 */
function quitarProducto(idProducto) {
    const index = carrito.findIndex(p => p.id === idProducto);
    
    if (index !== -1) {
        carrito.splice(index, 1); // Elimina 1 elemento en la posición index
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

/**
 * Aplica el descuento si el código es correcto
 */
function aplicarDescuento() {
    const inputCodigo = document.getElementById("codigoDescuento").value;
    
    if (inputCodigo === CODIGO_DESCUENTO) {
        descuentoAplicado = true;
        alert("¡Código de descuento aplicado exitosamente!");
        renderizarCarrito(); // Re-renderizar para mostrar nuevos totales
    } else {
        alert("Código inválido.");
        descuentoAplicado = false;
        renderizarCarrito();
    }
}

/**
 * Calcula el total a pagar
 */
function calcularTotal() {
    let total = 0;
    
    // Suma simple de precios
    carrito.forEach(producto => {
        total += producto.precio;
    });

    // Aplicar descuento si corresponde
    if (descuentoAplicado) {
        total = total * 0.85; // Resta el 15%
    }

    return total;
}

// =========================================
// 3. LÓGICA DE INTERFAZ (VISTA)
// =========================================

/**
 * Renderiza la tabla del carrito dentro del Modal
 */
function renderizarCarrito() {
    const cuerpoTabla = document.getElementById("cuerpoTablaCarrito");
    const totalElemento = document.getElementById("totalCarrito");
    
    // Limpiamos la tabla
    cuerpoTabla.innerHTML = "";

    // Llenamos la tabla dinámicamente
    carrito.forEach(prod => {
        const fila = `
            <tr>
                <td>${prod.nombre}</td>
                <td>$ ${prod.precio.toLocaleString('es-CL')}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="quitarProducto(${prod.id})">Quitar</button>
                </td>
            </tr>
        `;
        cuerpoTabla.innerHTML += fila;
    });

    // Actualizamos el total en el DOM
    const totalFinal = calcularTotal();
    totalElemento.innerText = `$ ${totalFinal.toLocaleString('es-CL')}`;
}

/**
 * Actualiza el numerito (0) en el Navbar
 */
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if(contador) {
        contador.innerText = `Carro (${carrito.length})`;
    }
}

// =========================================
// 4. AUTENTICACIÓN
// =========================================

function intentarLogin() {
    const emailInput = document.getElementById("emailInput").value;
    const passInput = document.getElementById("passInput").value;

    if (passInput === PASSWORD_MAESTRA) {
        usuarioLogueado = true;
        alert(`Bienvenido/a, ${emailInput}`);
        
        // Cerramos el modal (usando la API de Bootstrap)
        const modalElement = document.getElementById('loginModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // Cambiamos el botón de Login por "Logout" o Usuario
        const loginBtn = document.getElementById("loginBtn");
        loginBtn.innerHTML = `<span class="text-success fw-bold">Hola, Usuario</span>`;
        loginBtn.onclick = null; // Deshabilitamos el click para que no abra el modal de nuevo
        
    } else {
        alert("Contraseña incorrecta. Intente con 1234");
    }
}