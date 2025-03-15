require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/password", passwordRoutes);

app.use((err, req, res, next) => {
    console.log(err.message);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
