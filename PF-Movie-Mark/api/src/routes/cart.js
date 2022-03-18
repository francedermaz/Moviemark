const { Router } = require('express');
const router = Router();
const controllers = require("../controllers/cart");

router.get("/products", controllers.getProducts);
router.get("/products-cart", controllers.getProductsCart);

/* POST */
router.post("/products-cart", controllers.addProductCart);

/* PUT */
router.put("/products-cart/:productId", controllers.putProduct);

/* DELETE */
router.delete("/products-cart/:productId", controllers.deleteProduct);

module.exports = router;