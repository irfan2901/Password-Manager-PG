const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    registerUserController,
    loginUserController,
    updateUserController,
    deleteUserController,
    getCurrentUserController,
    getAllUsersController
} = require("../controller/userController");

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/current", auth, getCurrentUserController);
router.get("/all", getAllUsersController);
router.put("/update/:id", auth, updateUserController);
router.delete("/delete/:id", auth, deleteUserController);

module.exports = router;