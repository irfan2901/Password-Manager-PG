const pool = require("../config/db");

const createCategory = async (name) => {
    const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    return result.rows[0];
};

const updateCategory = async (name, id) => {
    const result = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    return result.rows[0];
};

const deleteCategory = async (id) => {
    const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount;
};

const getCategory = async (categoryName) => {
    const result = await pool.query('SELECT * FROM categories WHERE name = $1', [categoryName]);
    return result.rows[0];
};

const getAllCategories = async () => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories
};