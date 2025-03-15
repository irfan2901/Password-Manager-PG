const {
    addPassword,
    updateUserPassword,
    deletePassword,
    showCurrentPassword,
    showCategoryPasswords
} = require("../models/passwordModel");
const { getCategory } = require("../models/categoryModel");
const { getCurrentUser } = require("../models/userModel");
const bcrypt = require("bcryptjs");

const addPasswordController = async (req, res, next) => {
    try {
        const { website, username, password } = req.body;

        if (!website || !username || !password) {
            const error = new Error("All fieldds are required");
            error.status = 400;
            return next(error);
        }

        const id = req.user.id;
        const user = await getCurrentUser(id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        const category = await getCategory(req.params.categoryName);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newPassword = await addPassword(website, username, hashedPassword, user.id, category.id);
        return res.status(201).json({ newPassword });
    } catch (error) {
        return next(error);
    }
};

const updatePasswordController = async (req, res, next) => {
    try {
        const { website, username, password } = req.body;

        const category = await getCategory(req.params.categoryName);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const id = req.user.id;
        const user = await getCurrentUser(id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        const updatedPassword = await showCurrentPassword(id, category.id, req.params.passwordId);

        if (!updatedPassword) {
            const error = new Error("Password not found");
            error.status = 404;
            return next(error);
        }

        if (website) updatedPassword.website = website
        if (username) updatedPassword.username = username
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword.password = await bcrypt.hash(password, salt);
        }

        const savedPasswword = await updateUserPassword(id, category.id, updatedPassword.id, { website: updatedPassword.website, username: updatedPassword.username, password: updatedPassword.password });
        return res.status(200).json({ savedPasswword });
    } catch (error) {
        return next(error);
    }
};

const showCategorypasswordsController = async (req, res, next) => {
    try {
        const id = req.user.id;

        const category = await getCategory(req.params.categoryName);

        if (!category) {
            const error = new Error("Cateegory not found");
            error.status = 404;
            return next(error);
        }

        const passwords = await showCategoryPasswords(id, category.id);
        return res.status(200).json({ passwords });
    } catch (error) {
        return next(error);
    }
};

const deletePasswordController = async (req, res, next) => {
    try {
        const id = req.user.id;

        const category = await getCategory(req.params.categoryName);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const passwordId = req.params.passswordId;

        const result = await deletePassword(id, category.id, passwordId);

        if (result > 0) {
            return res.status(200).json({ message: "Password deleted successfully" });
        } else {
            const error = new Error("Password not found or could not be deleteted");
            error.status = 404;
            return next(error);
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { addPasswordController, updatePasswordController, showCategorypasswordsController, deletePasswordController };