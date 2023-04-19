const DAO = require("../persistence/data");
const ProductosDao = DAO[0];
const CarritosDao = DAO[1];
const contenedor = ProductosDao.getInstance();
const contenedorCarrito = CarritosDao.getInstance();

async function renderMain(req, res) {
  const { username, password } = req.user;
  const productos = await contenedor.getAll();
  const cartProducts = await contenedorCarrito.getCartProducts(username);
  let sum = 0;
  if (cartProducts.length > 0) {
    cartProducts.forEach((element) => {
      sum += element.price;
    });
  }

  let productosEncontrados = [];
  if (req.body.productosEncontrados) {
    productosEncontrados = req.body.productosEncontrados;
  }
  const datos = {
    productos: productos,
    usuario: req.user.username,
    nombre: req.user.nombre,
    direccion: req.user.direccion,
    edad: req.user.edad,
    telefono: req.user.telefono,
    url: req.user.url,
    productosEncontrados: productosEncontrados,
    productosCarrito: cartProducts,
    total: sum,
  };

  res.render("productslists", datos);
}

module.exports = renderMain;
