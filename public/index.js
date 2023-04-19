const carrito = [];

function renderizarCarrito() {
  let html = "";
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += parseInt(carrito[i].precio);
    html += `
        <div> ${carrito[i].nombre} - $ ${carrito[i].precio}  <button class="btn-cart" onclick="eliminarProducto(${i})">Eliminar</button> </div>`;
  }
  const carritoJSON = JSON.stringify(carrito);
  html += `<div> <em> Total: - $ ${sum} <em/> <div/>
  <form name="sendCart" action="/enviarCarrito" method="POST">
    <textarea class="hidden" name="cart">${carritoJSON}</textarea>
    <input type="submit" class="action-button" /> 
  </form>`;
  document.getElementById("div-cart-products").innerHTML = html;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
}

function agregarProducto(producto) {
  let nombre = producto.slice(0, producto.lastIndexOf("-"));
  let precio = producto.slice(producto.lastIndexOf("-") + 1, producto.length);
  let productoAgregado = { nombre: nombre, precio: precio };
  carrito.push(productoAgregado);
  renderizarCarrito();
}

const socket = io();

socket.on("connect", () => {
  console.log("me conecte!");
});

socket.on("msg-list", (data) => {
  let html = "";
  data.forEach((element) => {
    html += `
        <div> 
        <span class="bolded">${element.alias}</span>: <em>${element.text}</em>
        <div/>`;
  });
  document.getElementById("div-list-msgs").innerHTML = html;
});

function enviarMsg() {
  const alias = document.getElementById("input-alias").value;
  const msgParaEnvio = document.getElementById("input-msg").value;
  socket.emit("msg", {
    alias: alias,
    text: msgParaEnvio,
  });
}
