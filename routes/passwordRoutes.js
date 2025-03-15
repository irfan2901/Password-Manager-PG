const express = require("express");
const router = express.Router();
const { addPasswordController, updatePasswordController, showCategorypasswordsController, deletePasswordController } = require("../controller/passwordController");
const auth = require("../middleware/auth");

router.get("/all/:categoryName", auth, showCategorypasswordsController);
router.post("/addPassword/:categoryName", auth, addPasswordController);
router.put("/update/:categoryName/:passwordId", auth, updatePasswordController);
router.delete("/delete/:categoryName/:passswordId", auth, deletePasswordController);

module.exports = router;