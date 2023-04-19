const logger = require("../../config/logger");

class ContenedorMemoria {
  constructor(list) {
    this.list = list;
  }

  async getAll() {
    return this.list;
  }

  async getByName(name) {
    try {
      const index = this.list.findIndex(
        (object) => object.title.toLowerCase() == name.toLowerCase()
      );
      const resultado = [];
      if (this.list[index]) {
        resultado.push(this.list[index]);
        return resultado;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async getById(id) {
    try {
      const index = this.list.findIndex((object) => object.id == id);
      const resultado = [];
      if (this.list[index]) {
        resultado.push(this.list[index]);
        return resultado;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async save(title, thumbnail, price) {
    try {
      const lista = this.list;
      let highestid = Math.max(...lista.map((el) => el.id));
      let id = highestid + 1;
      let productoNuevo = {
        id: id,
        title: nombre,
        thumbnail: foto,
        price: precio,
      };
      this.list.push(productoNuevo);
      return id;
    } catch {
      logger.log("warn", "Se ha producido un error");
      return "Se ha producido un error";
    }
  }

  async getCartProducts(username) {
    try {
      const lista = this.list;
      const index = lista.findIndex((object) => object.username == username);
      if (lista[index]) {
        return lista[index].productos;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async addToCart(username, producto) {
    const lista = this.list;
    const index = lista.findIndex((object) => object.username == username);
    lista[index].productos.push(producto);
  }

  async deleteFromCart(username, product) {
    const index = this.list.findIndex((object) => object.username == username);

    const productosCarrito = this.list[index].productos;
    const indexProduct = productosCarrito.findIndex(
      (object) => object.title == product.title
    );
    this.list[index].productos.splice(indexProduct, 1);
  }

  async emptyCart(username) {
    const index = this.list.findIndex((object) => object.username == username);
    this.list[index].productos = [];
  }
}

let instanceProduct = null;
class ProductosDaoMemoria extends ContenedorMemoria {
  constructor() {
    super([
      {
        id: 1,
        title: "Red Velvet",
        thumbnail:
          "https://www.elmundoeats.com/wp-content/uploads/2018/05/Red-Velvet-Cake-1.jpg",
        price: 2000,
      },
      {
        id: 2,
        title: "Budín de limon",
        thumbnail:
          "https://www.cucinare.tv/wp-content/uploads/2020/01/Dise%C3%B1o-sin-t%C3%ADtulo-32.png",
        price: 1000,
      },
      {
        id: 3,
        title: "Brownie",
        thumbnail:
          "https://img2.rtve.es/imagenes/aqui-tierra-receta-brownie-jesus-monedero/1585576217689.JPG",
        price: 1500,
      },
    ]);
  }

  static getInstance() {
    if (!instanceProduct) {
      instanceProduct = new ProductosDaoMemoria();
    }
    return instanceProduct;
  }
}

let instanceCart = null;
class CarritosDaoMemoria extends ContenedorMemoria {
  constructor() {
    super([
      {
        id: 1,
        username: "jazmin@gmail.com",
        productos: [],
      },
      {
        id: 2,
        username: "flor.rizzo@gmail.com",
        productos: [],
      },
    ]);
  }

  static getInstance() {
    if (!instanceCart) {
      instanceCart = new CarritosDaoMemoria();
    }
    return instanceCart;
  }
}

module.exports = [ProductosDaoMemoria, CarritosDaoMemoria];
