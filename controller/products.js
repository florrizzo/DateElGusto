const service = require("../service/products");
const test = process.env.TEST;

async function getProducts(req, res, next) {
  let result = await service.getProducts();
  if (test == "True") {
    res.status(200).json(result);
  }
  next();
}

async function getProductByName(req, res, next) {
  let { name } = req.params;
  let result = await service.getProductByName(name);
  if (test == "True") {
    res.status(200).json(result);
  }
  if (result != "No se encontró ningún producto") {
    req.body.productosEncontrados = result;
  }
  next();
}

async function getProductById(req, res, next) {
  let { id } = req.params;
  let result = await service.getProductById(id);
  if (test == "True") {
    res.status(200).json(result);
  }
  if (result != "No se encontró ningún producto") {
    req.body.productosEncontrados = result;
  }
  next();
}

async function postProduct(req, res) {
  let result = await service.postProduct(
    req.body.title,
    parseInt(req.body.price),
    req.body.thumbnail
  );
  if (test == "True") {
    res.status(201).json(result);
  }
  res.redirect("/api/products");
}

async function putProductById(req, res) {
  let { id } = req.params;
  let result = await service.putProductById(
    id,
    req.body.title,
    req.body.price,
    req.body.thumbnail
  );
  res.status(201).json(result);
}

async function deleteProductById(req, res) {
  let { id } = req.params;
  let result = await service.deleteProductById(id);
  res.status(202).json(result);
}

module.exports = {
  getProducts,
  getProductByName,
  getProductById,
  postProduct,
  putProductById,
  deleteProductById,
};
