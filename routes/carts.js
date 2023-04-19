const Router = require("express");
const routerCarts = new Router();
const controller = require("../controller/carts");
const renderMain = require("../config/render");

routerCarts.post("/enviarCarrito", controller.postEnviarCarrito);

routerCarts.post("/addToCart", controller.postAddToCart, renderMain);

routerCarts.post("/deleteFromCart", controller.deleteFromCart, renderMain);

routerCarts.post("/emptyCart", controller.postEmptyCart, renderMain);

module.exports = routerCarts;
