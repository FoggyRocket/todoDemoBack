const router = require("express").Router();
//importar el controlador
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/product.controller");
//middelwares
const { verifyToken, checkRole } = require("../middleware");

//
router.post("/create", verifyToken, checkRole(["Admin"]), createProduct);
router.patch("/:id/update", verifyToken, checkRole(["Admin"]), updateProduct);
router.delete("/:id/delete", verifyToken, checkRole(["Admin"]), deleteProduct);
router.get("/all", getAllProducts);
router.get("/:id/detail", getProductById);

module.exports = router;
