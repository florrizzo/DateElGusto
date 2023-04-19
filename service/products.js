const DAO = require("../persistence/data");
const ProductosDao = DAO[0];
const container = ProductosDao.getInstance();
const logger = require("../config/logger");

const ProductsValidation = require("../config/validation");

async function getProducts() {
  let resultado = await container.getAll();
  return resultado;
}

async function getProductByName(name) {
  let result = await container.getByName(name);
  if (!result || result.length < 1) {
    return "No se encontró ningún producto";
  }
  return result;
}

async function getProductById(id) {
  let result = await container.getById(id);
  if (!result) {
    return "No se encontró ningún producto";
  }
  return result;
}

async function postProduct(title, price, thumbnail) {
  const { error, value } = await ProductsValidation.validate({
    title: title,
    price: price,
    thumbnail: thumbnail,
  });
  if (error) {
    logger.log("info", "Error de posteo: " + error);
    return "No se pudo postear el producto";
  }
  let result = await container.save(title, price, thumbnail);
  return result;
}

async function putProductById(id, title, price, thumbnail) {
  let result = await container.getById(id);
  if (!result) {
    return "No se encontró ningún producto";
  }
  const { error, value } = await ProductsValidation.validate({
    title: title,
    price: price,
    thumbnail: thumbnail,
  });
  if (error) {
    logger.log("info", "Error de posteo: " + error);
    return "No se pudo postear el producto";
  } else {
    let result = await container.replace(id, title, price, thumbnail);
    return result;
  }
}

async function deleteProductById(id) {
  let result = await container.getById(id);
  if (!result) {
    return "No se encontró ningún producto";
  } else {
    let result = await container.deleteById(id);
    return result;
  }
}

module.exports = {
  getProducts,
  getProductByName,
  getProductById,
  postProduct,
  putProductById,
  deleteProductById,
};
