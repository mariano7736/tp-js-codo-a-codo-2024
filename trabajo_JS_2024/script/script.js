const url ='https://raw.githubusercontent.com/mariano7736/tp-js-codo-a-codo-2024/main/trabajo_JS_2024/data/productos.json';
//const url ='https://raw.githubusercontent.com/matnasama/proyecto-coderhouse/main/data/productos.json';
const file ='../data/productos.json';
const containerProducts = document.getElementById('container-products');
const modal = document.getElementById('ventana-modal');
const carrito = document.getElementById('carrito');
const modalForm = document.getElementById('ventana-form');
const totalCarrito = document.getElementById('total');
const btnClose = document.getElementsByClassName('close')[0];
const btnCloseForm = document.getElementsByClassName('close-form')[0];
const containerCart = document.querySelector('.modal-body');
const iconMenu = document.getElementById('icon-menu');
const myForm = document.getElementById('myForm');
const myNav = document.getElementById('myTopnav');
const btnFinalizar = document.querySelector('#finalizar-compra');
const btnVaciar = document.querySelector('#vaciar-carrito');
const cantidadProductos = document.querySelector('.contador-productos');
const contenedorProductos = document.querySelector('.contenedor-carrito');


let productosCarrito = [];
const clientes = [];

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    width: 300,
    color: 'whitesmoke',
    timer: 1000,
    timerProgressBar: true,
});



class Producto {
    constructor(imagen, nombre, precio, id) {
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.cantidad = 1;
        this.subtotal = 0;
    }

    obtenerTotal() {
        this.subtotal = this.precio * this.cantidad;
    }
}

cargarEventos();

function cargarEventos() {
    iconMenu.addEventListener('click', mostrarMenu);

    document.addEventListener('DOMContentLoaded', () => {
        renderizarProductos();
        cargarCarritoLocalStorage();
        mostrarProductosCarrito();
    });

    containerProducts.addEventListener('click', agregarProducto);
    containerCart.addEventListener('click', eliminarProducto);
    btnFinalizar.addEventListener('click', finalizarCompra);
    btnVaciar.addEventListener('click', vaciarCarrito);

    carrito.onclick = function () {
        modal.style.display = 'block';
    };

    btnClose.onclick = function () {
        modal.style.display = 'none';

    };

    window.onclick = function (event) {
        if (event.target == modal || event.target == modalForm) {
            modal.style.display = 'none';
            modalForm.style.display = 'none';

        }
    };

    myForm.onclick = function () {
        modalForm.style.display = 'block';
    };
    
    btnCloseForm.onclick = function () {
        modalForm.style.display = 'none';
    };

}
function cargarCarritoLocalStorage() {
    productosCarrito = JSON.parse(localStorage.getItem('productosLS')) || [];
}

function eliminarProducto(e) {
    if (e.target.classList.contains('eliminar-producto')) {
        const productoId = parseInt(e.target.getAttribute('id'));
        alertProducto('error', 'producto eliminado', '#FF0000');
        productosCarrito = productosCarrito.filter((producto) => producto.id !== productoId);
        guardarProductosLocalStorage();
        mostrarProductosCarrito();
    }
}

function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoAgregado = e.target.parentElement;
        alertProducto('success', 'producto agregado', '#34b555');
        leerDatosProducto(productoAgregado);
    }
}

function alertProducto(icono, titulo, colorFondo) {
    Toast.fire({
        icon: icono, 
        title: titulo, 
        background: colorFondo, 
    });
}

function leerDatosProducto(producto) {
   
    const datosProducto = new Producto(
        producto.querySelector('img').src,
        producto.querySelector('h4').textContent,
        Number(producto.querySelector('p').textContent.replace('$', '')),
        parseInt(producto.querySelector('a').getAttribute('id'))
    );
    datosProducto.obtenerTotal();
    agregarAlCarrito(datosProducto);
}

function agregarAlCarrito(productoAgregar) {
    const existeEnCarrito = productosCarrito.some((producto) => producto.id === productoAgregar.id);
    if (existeEnCarrito) {
        const productos = productosCarrito.map((producto) => {
        if (producto.id === productoAgregar.id) {
            producto.cantidad++;
            producto.subtotal = producto.precio * producto.cantidad;              
            return producto;
        } else {
                return producto;
            }
    });
        productosCarrito = productos; 
    } else {
        productosCarrito.push(productoAgregar);
    }
    guardarProductosLocalStorage();
    mostrarProductosCarrito();
}

function mostrarProductosCarrito() {
    limpiarHTML();
    productosCarrito.forEach((producto) => {
        const { imagen, nombre, precio, cantidad, subtotal, id } = producto;
        const div = document.createElement('div');
        div.classList.add('contenedor-producto');
        div.innerHTML = `
			<img src="${imagen}" class="img-cart" width="100">
			<P>${nombre}</P>
			<P>$${precio}</P>
			<P>${cantidad}</P>
			<P>$${subtotal}</P>
			<a href="#" class="eliminar-producto" id="${id}"> X </a>
		`;
        containerCart.appendChild(div);
    });
    mostrarCantidadProductos();
    calcularTotal();
}

function calcularTotal() {
    let total = productosCarrito.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0);
    totalCarrito.innerHTML = `Total a Pagar: $${total}`;
}

function limpiarHTML() {
    while (containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild);
    }
}

function guardarProductosLocalStorage() {
    localStorage.setItem('productosLS', JSON.stringify(productosCarrito));
}

async function realizarPeticion(datos) {
    try {
        const response = await fetch(datos);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
      
        console.error(error);
    } 
}

async function renderizarProductos() {
    const productos = await realizarPeticion(url);
    //const productos = await realizarPeticion(file);
    recorrerArray(productos);
}

function recorrerArray(verProductos) {
    verProductos.forEach((producto) => {
        const divCard = document.createElement('div');
        divCard.classList.add('card');
        divCard.innerHTML += `
            <div>
			    <img src="./img/${producto.img}" alt="${producto.nombre}" />
            </div>
            <div>
                <h2>${producto.nombre}</h2>
                <p>Año: ${producto.año}</p>
                <p>Km: ${producto.kilometros}</p>
                <p>Precio $${producto.precio}</p>
            </div>
            <div>
                <a id=${producto.id} class="boton agregar-carrito" href="#">RESERVAR</a>
            </div>

        `;
        containerProducts.appendChild(divCard);
    });
}

function mostrarMenu() {
    let navbar = document.getElementById('myTopnav');
    navbar.className = navbar.className === 'topnav' ? (navbar.className += ' responsive') : (navbar.className = 'topnav');
}


function limpiarContenedorProductos() {
    while (containerProducts.firstChild) {
        containerProducts.removeChild(containerProducts.firstChild);
    }
}

modalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const nombre = document.getElementById('fname').value;
    const apellido = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const cliente = {};
    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.email = email;
    cliente.nombre = nombre.toUpperCase();
    cliente.apellido = apellido.toUpperCase();
    clientes.push(cliente);
    localStorage.setItem('clientesLS', JSON.stringify(clientes));
    modalForm.reset();
    mostrarNombre();

})

function mostrarNombre() {
    clientes.forEach((cliente) => {
        const userName = document.createElement('p');
        userName.classList.add('name');
        userName.innerHTML += `
			Hola ${cliente.nombre}!
        `;
        myNav.appendChild(userName);
        modalForm.style.display = 'none';
        myForm.style.display = 'none';
    });
}

function finalizarCompra() {
    if (productosCarrito.length < 1) {
        Swal.fire({
            title: 'Operación cancelada',
            icon: 'info',
            text: 'El carrito se encuentra vacío',
            timerProgressBar: true,
            timer: 3000,
        });
        modal.style.display = 'none';
    } else {
           Swal.fire({
            icon: 'success',
            title: 'Compra finalizada',
            text: '¡Has finalizado tu compra!',
            timerProgressBar: true,
            timer: 3000,
            });

            eliminarCarritoLS();
            cargarCarritoLocalStorage();
            mostrarProductosCarrito();
            modal.style.display = 'none';
}

}
function vaciarCarrito() {

    Swal.fire({
        title: 'Vaciar carrito',
        text: '¿Confirma que desea vaciar el carrito de compras?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((btnResponse) => {
        if (btnResponse.isConfirmed) {
            Swal.fire({
                title: 'Vaciando Carrito',
                icon: 'success',
                text: 'Su carrito de compras fue vaciado con exito.',
                timerProgressBar: true,
                timer: 3000,
            });
            eliminarCarritoLS();
            cargarCarritoLocalStorage();
            mostrarProductosCarrito();
            modal.style.display = 'none';
    } else {
            Swal.fire({
                title: 'Operación cancelada',
                icon: 'info',
                text: 'La operación de vaciar el carrito de compras fue cancelada',
                timerProgressBar: true,
                timer: 3000,
            });
        }
    });
}

function eliminarCarritoLS() {
    localStorage.removeItem('productosLS');
}

function eliminarProducto(e) {
    if (e.target.classList.contains('eliminar-producto')) {

        const productoId = parseInt(e.target.getAttribute('id'));

        alertProducto('error', 'producto eliminado', '#ac0174');
        productosCarrito = productosCarrito.filter((producto) => producto.id !== productoId);
        guardarProductosLocalStorage();
        mostrarProductosCarrito();
    }
}

function mostrarCantidadProductos() {
    let contarProductos;

    if (productosCarrito.length > 0) {
        contenedorProductos.style.display = 'flex';
        contenedorProductos.style.alignItems = 'center';
        cantidadProductos.style.display = 'flex';
        contarProductos = productosCarrito.reduce((cantidad, producto) => cantidad + producto.cantidad, 0);
        cantidadProductos.innerText = `${contarProductos}`;
    } else {
        contenedorProductos.style.display = 'block';
        cantidadProductos.style.display = 'none';
    }
}



document.querySelector('.scroll-left').addEventListener('click', () => {
    document.querySelector('.container').scrollBy({
        left: -270, // Adjust this to the width of your cards plus margin
        behavior: 'smooth'
    });
});

document.querySelector('.scroll-right').addEventListener('click', () => {
    document.querySelector('.container').scrollBy({
        left: 270, // Adjust this to the width of your cards plus margin
        behavior: 'smooth'
    });
});

/* texto animado*/

class TextoAnimado {
	constructor(id, objetivo) {
		this.texto = document.getElementById(id);
		this.objetivo = document.getElementById(objetivo);
		this.letras = this.texto.innerText.split("");

		this.texto.innerText = '';

		this.letras.forEach((letra) => {
			let caracter = letra === ' ' ? '&nbsp;' : letra;

			this.texto.innerHTML = this.texto.innerHTML + `
				<div>
					<span>${caracter}</span>
					
				</div>
			`;
		});



		setInterval(() => {



			let cuenta = 0;

			const intervalo = setInterval(() => {
				if (cuenta < this.texto.children.length) {
					this.texto.children[cuenta].classList.add('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);

		},4000);



		setInterval(() => {
			let cuenta = 0;

			const intervalo = setInterval(() => {
				if (cuenta < this.texto.children.length) {
					this.texto.children[cuenta].classList.remove('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);

		},5000);


	}
}

new TextoAnimado('logo', 'logotipo');

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("icon-menu");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});
