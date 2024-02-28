const fs = require('fs');

class ProductManager {

  constructor(file) {
    //ruta del archivo donde se van a guardar los datos
    this.path = file;
  };

  async getProducts(){
    try {
      if(fs.existsSync(this.path)) {
         const productsJSON = await fs.promises.readFile(this.path, 'utf-8');
         return JSON.parse(productsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
    };
  };

  async addProduct(title, description, price, thumbnail, code, stock) {

    try {
    const newProduct = {
      id : this.#newId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock: stock ? stock : 0,
    };

    const products = await this.getProducts();

    //verificar codigo del producto
    const checkCode = products.find((product)=> product.code === code);
    console.log("verificación de codigo: ",checkCode) //error
    if (checkCode){
      return "product code error";
    };

    //verificar que todos los campos del producto esten completos
    if(!this.#checkProduct(newProduct)){
      console.log("product error")
      return "product error" 
  };
 
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    console.log("lista de productos: ", products);

    } catch (error) {
      console.log(error);
    };
  };

  #newId(){
    if(this.products.length < 1) return 1
    const newId = this.products.length + 1;
    console.log("nuevo Id: ", newId)
    return newId;
  };

  #checkProduct(product){

    for (let clave in product) {
        if (product[clave] === null || product[clave] === undefined) {
          return false;
        };
      };

    return true;
  };

  async getProductById(id){

    const products = await this.getProducts();
    const productById = products.find((product) => product.id === id);

    if(!productById){
        return "error Id Product"
    };

    return productById;
  };

};

//test

const products = new ProductManager('./products.json');

const test = async ()=>{

  const productConsult = await products.getProducts()
  console.log(productConsult)
}

test();
//node ./productManager.js