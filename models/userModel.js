const pool = require("../config/db");

const registerUser = async (name, email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

const updateUser = async (id, updatedFields) => {
    const setClauses = [];
    const values = [];

    Object.keys(updatedFields).forEach((field, index) => {
        setClauses.push(`${field} = $${index + 1}`);
        values.push(updatedFields[field]);
    });

    values.push(id);

    const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount;
};

const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const getCurrentUser = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

module.exports = { registerUser, updateUser, deleteUser, getUserByEmail, getCurrentUser, getAllUsers };