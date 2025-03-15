const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUser, updateUser, deleteUser, getUserByEmail, getCurrentUser, getAllUsers } = require("../models/userModel");

const registerUserController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('All fields are required');
            error.status = 400;
            return next(error);
        }
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.status = 400;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await registerUser(name, email, hashedPassword);

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
};

const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('All fields are required');
            error.status = 400;
            return next(error);
        }

        const user = await getUserByEmail(email);

        if (!user) {
            const error = new Error('User does not exist with this email');
            error.status = 401;
            return next(error);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.status = 401;
            return next(error);
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        return next(error);
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const id = req.params.id;

        const user = await getCurrentUser(id);

        if (!user) {
            const error = new Error('User does not exist');
            error.status = 404;
            return next(error);
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await updateUser(id, { name: user.name, email: user.email, password: user.password });

        return res.status(200).json(updatedUser);

    } catch (error) {
        return next(error);
    }
};

const deleteUserController = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await deleteUser(id);

        if (result > 0) {
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
            const error = new Error("User not found or could not be deleted");
            error.status = 404;
            return next(error);
        }

    } catch (error) {
        return next(error);
    }
};

const getCurrentUserController = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await getCurrentUser(id);

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            return next(error);
        }

        return res.status(200).json({ user });
    } catch (error) {
        return next(error);
    }
};

const getAllUsersController = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json({ users });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    registerUserController,
    loginUserController,
    updateUserController,
    deleteUserController,
    getCurrentUserController,
    getAllUsersController
};