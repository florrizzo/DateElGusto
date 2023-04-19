const DAO = require("../persistence/data");
const ProductosDao = DAO[0];
const CarritosDao = DAO[1];
const contenedor = ProductosDao.getInstance();
const contenedorCarrito = CarritosDao.getInstance();
const logger = require("../config/logger");

/* Nodemailer */
const { createTransport } = require("nodemailer");

const TEST_MAIL = process.env.AdminMail || "florenciam.rizzo@hotmail.com";
const mailUser = process.env.Ethereal_Mail || "hailey.brown@ethereal.email";
const mailPass = process.env.Ethereal_Pass || "s6hb6pXVzFcPtsHGgC";

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

/* async function datosMain(username, datosUsuario, productosEncontrados) {
  const productos = await contenedor.getAll();
  const cartProducts = await contenedorCarrito.getCartProducts(username);
  let sum = 0;
  if (cartProducts.length > 0) {
    cartProducts.forEach((element) => {
      sum += element.price;
    });
  }
  const datos = {
    productos: productos,
    usuario: username,
    nombre: datosUsuario.nombre,
    direccion: datosUsuario.direccion,
    edad: datosUsuario.edad,
    telefono: datosUsuario.telefono,
    url: datosUsuario.url,
    productosEncontrados: [],
    productosCarrito: cartProducts,
    total: sum,
  };

  if (productosEncontrados) {
    productosEncontrados.forEach((element) => {
      datos.productosEncontrados.push(element);
    });
  }

  return datos;
} */

async function signUpMail(username) {
  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo registro",
    html:
      '<h1 style="color: blue;">Se registró un usuario nuevo: <span style="color: green;">' +
      username +
      "</span></h1>",
  };

/*   try {
    const enviarMail = async () => {
      const info = await transporter.sendMail(mailOptions);
      logger.log("info", info);
    };
    enviarMail();
  } catch (err) {
    logger.log("error", err);
  } */
}

module.exports = {
/*   datosMain, */
  signUpMail,
};
