const Router = require("express");
const routerUsers = new Router();
const controller = require("../controller/users");
const passport = require("passport");
const checkAuthentication = require("../config/autentication")
const renderMain = require("../config/render")

routerUsers.get("/", checkAuthentication, renderMain);

routerUsers.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  controller.postLogin
);

routerUsers.get("/login", controller.getLogin);

routerUsers.get("/register", controller.getRegister);

routerUsers.post(
  "/register",
  passport.authenticate("signup", { failureRedirect: "/failRegister" }),
  controller.postSignup
);

routerUsers.get("/failLogin", (req, res) => {
  res.render("failLogin");
});

routerUsers.get("/failRegister", (req, res) => {
  res.render("failRegister");
});

routerUsers.get("/showsession", (req, res) => {
  res.json(req.session);
});

routerUsers.get("/logout", controller.getLogout);

module.exports = routerUsers;
