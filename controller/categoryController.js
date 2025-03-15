const {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
} = require("../models/categoryModel");

const createCategoryController = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            const error = new Error('Category name is required');
            error.status = 400;
            return next(error);
        }

        const category = await createCategory(name);

        return res.status(201).json({ category });
    } catch (error) {
        return next(error);
    }
};

const updateCategoryController = async (req, res, next) => {
    try {
        const { name } = req.body;
        const id = req.params.id;

        const category = await updateCategory(name, id);
        return res.status(200).json({ category });
    } catch (error) {
        return next(error);
    }
};

const deleteCategoryController = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await deleteCategory(id);

        if (result > 0) {
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
            const error = new Error("Category not found or could not be deleted");
            error.status = 404;
            return next(error);
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCategoriesController = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({ categories });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController
};