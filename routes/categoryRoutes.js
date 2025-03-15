const express = require("express");
const router = express.Router();
const {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController
} = require("../controller/categoryController");

router.get("/", getAllCategoriesController);
router.post("/addCategory", createCategoryController);
router.put("/updateCategory/:id", updateCategoryController);
router.delete("/deleteCategory/:id", deleteCategoryController);

module.exports = router;