const pool = require("../config/db");

const addPassword = async (website, username, hashedPassword, userId, categoryId) => {
    const result = await pool.query(
        `INSERT INTO passwords (website, username, password, user_id, category_id) 
        SELECT $1, $2, $3, $4, $5 
        WHERE EXISTS (SELECT 1 FROM users WHERE id = $4) 
        AND EXISTS (SELECT 1 FROM categories WHERE id = $5) 
         RETURNING *`,
        [website, username, hashedPassword, userId, categoryId]
    );
    return result.rows[0];
};


const updateUserPassword = async (userId, categoryId, passwordId, fieldsToUpdate) => {
    let query = 'UPDATE passwords SET ';
    const values = [];
    let counter = 1;

    Object.keys(fieldsToUpdate).forEach((field, index, array) => {
        query += `${field} = $${counter}${index < array.length - 1 ? ', ' : ''}`;
        values.push(fieldsToUpdate[field]);
        counter++;
    });

    query += ` WHERE user_id = $${counter} AND category_id = $${counter + 1} AND id = $${counter + 2} RETURNING *`;

    values.push(userId, categoryId, passwordId);

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deletePassword = async (userId, categoryId, passwordId) => {
    const result = await pool.query(
        `DELETE FROM passwords 
        WHERE user_id = $1 AND category_id = $2 AND password_id = $3 
        RETURNING *`,
        [userId, categoryId, passwordId]
    );
    return result.rowCount;
};

const showCurrentPassword = async (userId, categoryId, passwordId) => {
    const result = await pool.query(
        'SELECT * FROM passwords WHERE user_id = $1 AND category_id = $2 AND id = $3',
        [userId, categoryId, passwordId]
    );
    return result.rows[0];
};

const showCategoryPasswords = async (userId, categoryId) => {
    const result = await pool.query('SELECT * FROM passwords WHERE user_id = $1 AND category_id = $2', [userId, categoryId]);
    return result.rows;
};

module.exports = {
    addPassword,
    updateUserPassword,
    deletePassword,
    showCurrentPassword,
    showCategoryPasswords
};