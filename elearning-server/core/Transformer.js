class Transformer {
     #data;
     constructor(resource) {
          if (Array.isArray(resource)) {
               this.#data = resource.map((item) => this.response(item));
          } else {
               this.#data = this.response(resource);
          }
          return this.#data;
     }
}
module.exports = Transformer;