require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(430).json({ message: "Token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.ststus(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

module.exports = auth;