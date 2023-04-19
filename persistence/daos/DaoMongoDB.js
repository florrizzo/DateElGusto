const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { ModeloProductos } = require("../models/products");
const { ModeloCarritos } = require("../models/carts");
const logger = require("../../config/logger");

let instance = null;
class Singleton {
  constructor() {
    (async () => {
      try {
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
        });
        logger.log("info", "Conectado a mongo! ✅");
      } catch (e) {
        logger.log("error", e);
        throw "can not connect to the db";
      }
    })();
  }
  static getInstance() {
    if (!instance) {
      instance = new Singleton();
    }
    return instance;
  }
}

Singleton.getInstance();

class ContenedorMongoDB {
  constructor({ name, schema }) {
    this.model = mongoose.model(name, schema);
  }

  async getAll() {
    const resultado = await this.model.find({});
    return resultado;
  }

  async getByName(name) {
    const resultado = await this.model.find(
      { title: { $regex: name, $options: "i" } },
      { _id: false, __v: false }
    );
    return resultado;
  }

  async getById(id) {
    try {
      const result = await this.model.find(
        { _id: id },
        { __v: false }
      );
      return result;
    } 
    catch {
      return false;
    }
    
  }

  async replace(id, title, thumbnail, price) {
    await ProductsModel.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            thumbnail: thumbnail,
            price: price
          },
        }
      );
      let result = await this.getById(id)
      return result[0]
  }

  async deleteById(id) {
    await this.model.deleteOne({ _id: id });
    return `Se eliminó con exito`;
  }

  async save(title, price, thumbnail) {
    try {
      const productoNuevo = new ModeloProductos({
        title: title,
        price: price,
        thumbnail: thumbnail,
      });
      let result = await productoNuevo.save();
      return result
    } catch {
      logger.log("error", "Se ha producido un error al guardar el producto");
      return "Se ha producido un error";
    }
  }

  async getCartProducts(username) {
    const carritoUsuario = await this.model.find(
      { username: username },
      { _id: false, __v: false }
    );
    if (carritoUsuario.length > 0) {
      return carritoUsuario[0].productos;
    } else {
      return false;
    }
  }

  async addToCart(username, product) {
    const carritoUsuario = await this.model.find(
      { username: username },
      { _id: false, __v: false }
    );
    if (carritoUsuario.length > 0) {
      const productosCarrito = carritoUsuario[0].productos;
      productosCarrito.push(product);
      console.log(username);
      await this.model.updateOne(
        { username: username },
        {
          $set: {
            productos: productosCarrito,
          },
        }
      );
    } else {
      try {
        const carritoNuevo = new ModeloCarritos({
          username: username,
          productos: [ product ],
        });
        console.log(carritoNuevo)
        await carritoNuevo.save();
      } catch {
        logger.log("error", "Se ha producido un error");
        return "Se ha producido un error";
      }
    }
  }

  async deleteFromCart(username, product) {
    const carritoUsuario = await this.model.find(
      { username: username },
      { _id: false, __v: false }
    );
    const productosCarrito = carritoUsuario[0].productos;
    const indexProduct = productosCarrito.findIndex(
      (object) => object.title == product.title
    );
    productosCarrito.splice(indexProduct, 1);
    await this.model.updateOne(
      { username: username },
      {
        $set: {
          productos: productosCarrito,
        },
      }
    );
  }

  async emptyCart(username) {
    await this.model.deleteOne({ username: username });
  }

 
}

let instanceProduct = null;
class ProductosDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super({
      name: "productos",
      schema: ModeloProductos.ProductosSchema,
    });
  }

  static getInstance() {
    if (!instanceProduct) {
      instanceProduct = new ProductosDaoMongoDB();
    }
    return instanceProduct;
  }
}

let instanceCart = null;
class CarritosDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super({
      name: "carritos",
      schema: ModeloCarritos.CarritosSchema,
    });
  }

  static getInstance() {
    if (!instanceCart) {
      instanceCart = new CarritosDaoMongoDB();
    }
    return instanceCart;
  }
}

class MensajesDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super({
      name: "mensajes",
      schema: ModeloMensajes.MensajesSchema,
    });
  }
}

module.exports = [ProductosDaoMongoDB, CarritosDaoMongoDB, MensajesDaoMongoDB];
