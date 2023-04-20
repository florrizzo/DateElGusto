const DAO = require("../persistence/data");
const ProductosDao = DAO[0];
const CarritosDao = DAO[1];
const contenedor = ProductosDao.getInstance();
const contenedorCarrito = CarritosDao.getInstance();
const logger = require("../config/logger");

/* Nodemailer */
const { createTransport } = require("nodemailer");

const TEST_MAIL = process.env.AdminMail || "florenciam.rizzo@hotmail.com";
const mailUser = process.env.Ethereal_Mail || "princess.lesch@ethereal.email";
const mailPass = process.env.Ethereal_Pass || "JaC93uNpeaHP44nCra";

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

async function enviarCarrito(username, nombre, telefono) {
  let carrito = await contenedorCarrito.getCartProducts(username);
  let htmlcarrito = "";
  let wappcarrito = "";
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += parseInt(carrito[i].price);
    htmlcarrito += `
          <div> ${carrito[i].title} - $ ${carrito[i].price}</div>`;
    wappcarrito += `
          ${carrito[i].title} - $ ${carrito[i].price}`;
  }
  htmlcarrito += `<div> <em> Total: - $ ${sum} <em/> <div/>`;
  wappcarrito += `Total: - $ ${sum}`;
  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo pedido de " + nombre + ": " + username,
    html: `<h1>El usuario ${nombre} realizó el siguiente pedido:</h1>
      <p>${htmlcarrito}</p>`,
  };

    try {
    const enviarMail = async () => {
      const info = await transporter.sendMail(mailOptions);
      logger.log("info", info);
    };
    enviarMail();
  } catch (err) {
    logger.log("error", err);
  }
}

async function agregarCarrito(product, username) {
  let addProduct = await contenedor.getByName(product);
  await contenedorCarrito.addToCart(username, addProduct[0]);
}

async function vaciarCarrito(username) {
  await contenedorCarrito.emptyCart(username);
}

async function eliminarDeCarrito(product, username) {
  let deleteProduct = await contenedor.getByName(product);
  await contenedorCarrito.deleteFromCart(username, deleteProduct[0]);
}

module.exports = {
  enviarCarrito,
  agregarCarrito,
  vaciarCarrito,
  eliminarDeCarrito,
};
