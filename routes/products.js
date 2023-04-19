const Router = require("express");
const routerProducts = new Router();
const controller = require("../controller/products");
const passport = require("passport");
const checkAuthentication = require("../config/autentication");
const renderMain = require("../config/render");

routerProducts.get(
  "/",
  checkAuthentication,
  controller.getProducts,
  renderMain,
);

routerProducts.get(
  "/name/:name",
  checkAuthentication,
  controller.getProductByName,
  renderMain,
);

routerProducts.get(
  "/id/:id",
  checkAuthentication,
  controller.getProductById,
  renderMain,
);

routerProducts.post("/", checkAuthentication, controller.postProduct);

routerProducts.put("/id/:id", checkAuthentication, controller.putProductById);

routerProducts.delete(
  "/id/:id",
  checkAuthentication,
  controller.deleteProductById,
);

module.exports = routerProducts;
