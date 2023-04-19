const service = require("../service/users");

async function getMain(req, res) {
  const { username, password } = req.user;
  const datos = await service.datosMain(
    username,
    req.user,
    req.body.productosEncontrados
  );

  res.render("productslists", datos);
}

function postLogin(req, res) {
  const { username, password } = req.user;
  res.redirect("/api/users");
}

function getLogin(req, res) {
  res.render("login");
}

function getRegister(req, res) {
  res.render("register");
}

function postSignup(req, res) {
  const { username, password, nombre } = req.user;
  service.signUpMail(username);
  res.redirect("/api/users");
}

function getLogout(req, res) {
  const { username, password } = req.user;
  req.session.destroy((err) => {
    if (err) {
      res.send("No se pudo deslogear");
    } else {
      res.render("logout", { usuario: username });
    }
  });
}

module.exports = {
  postSignup,
  getLogin,
  getRegister,
  postLogin,
  getMain,
  getLogout,
};
