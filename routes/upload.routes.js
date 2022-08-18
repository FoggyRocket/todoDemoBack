const router = require("express").Router();
//importar el controlador 
const { uploadProcess, deleteImage } = require("../controllers/upload.controller")
//vamos a importar mi helper 
const uploadCloud = require("../helpers/cloudinary")
//middleware para verificar si esta loggeado
const {verifyToken} = require("../middleware")
//multiples                       //req.files
router.post("/uploads",verifyToken,uploadCloud.array("images", 3), uploadProcess)
//una sola                       //req.file
router.post("/single",verifyToken,uploadCloud.single("image"), uploadProcess)
//
router.delete("/delete-image/:name",verifyToken,deleteImage)

module.exports = router;