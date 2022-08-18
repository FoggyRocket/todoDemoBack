const router = require("express").Router();
//importar el controlador 
const {signupProcess,loginProcess,logoutProcess} = require("../controllers/demoAuthAsycn.controller")
//middelwares

router.post("/signup", signupProcess);

//login Logout
router.post("/login",loginProcess);

router.get("/logout",logoutProcess);
//.-
module.exports = router;
