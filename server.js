/* Imports */
const express = require("express");
const MongoStore = require("connect-mongo");
const Socket = require("socket.io").Server;
const session = require("express-session");
const LocalStrategy = require("./config/passport");
const passport = require("passport");
const logger = require("./config/logger");

/* Express server */
const app = express();

if (process.env.MODE != "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

//IMPLEMENTACION
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () => {
  logger.log("info", `App escuchando en el puerto http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

/* Passport */
app.use(passport.initialize());
app.use(passport.session());

const routerUsers = require("./routes/users");
app.use("/api/users", routerUsers);

const routerProducts = require("./routes/products");
app.use("/api/products", routerProducts);

const routerCarts = require("./routes/carts");
app.use("/api/carts", routerCarts);

app.get("/*", (req, res) => {
  res.redirect("/api/users/login");
});

const mensajes = [
  {
    alias: "Date el gusto",
    text: "Bienvenido a la página de Date el Gusto! En que podemos ayudarte?",
  },
];
/* Sockets */
io.on("connection", async (socket) => {
  logger.log("info", "Usuario conectado");
  io.sockets.emit("msg-list", mensajes);

  socket.on("msg", async (data) => {
    mensajes.push(data);
    io.sockets.emit("msg-list", mensajes);
  });
});
