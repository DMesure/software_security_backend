const connection = require('./connection');

const get = async () =>
    await new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM recipes",
            (err, res) => {
                return err || res.length === 0
                    ? reject({ error: "Cannot retrieve recipes" })
                    : resolve(res);
            }
        );
    });

const getById = async (id) =>
    await new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM recipes WHERE id = ? LIMIT 1",
            [id],
            (err, recipe) => {
                if (err) {
                    return reject({ error: `Cannot store recipe: ${err.message}` });
                } else if (recipe.length === 0) {
                    return reject();
                }
                return resolve(recipe[0])
            }
        );
    });

const getCreator = async (id) =>
    await new Promise((resolve, reject) => {
        connection.query(
            "SELECT created_by FROM recipes WHERE id = ? LIMIT 1",
            [id],
            (err, recipe) => {
                if (err) {
                    return reject();
                } else if (recipe.length === 0) {
                    return reject();
                }
                return resolve(recipe[0].created_by)
            }
        );
    });

const create = async ({ name, description, preparationTime, image }) =>
    await new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO recipes VALUES (NULL, ?, ?, ?, ?)",
            [name, description, preparationTime, image],
            (err, recipe) => {
                if (err || recipe.length === 0) {
                    return reject({ error: `Cannot store recipe: ${err.message}` });
                }
                return resolve(recipe.insertId);
            }
        );
    });

const update = async (
    { name, description, preparationTime, image },
    recipeId) =>
    await new Promise((resolve, reject) => {
        connection.query(
            "UPDATE recipes SET name = ?, description = ?, preparationTime = ?, image = ? WHERE id = ?",
            [name, description, preparationTime, image, recipeId],
            (err, res) => {
                return err || res.length === 0
                    ? reject({ error: `Cannot update recipe: ${err.message}` })
                    : resolve(res);
            }
        );
    });


const destroy = async (recipeId) =>
    await new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM recipes WHERE id = ?",
            [recipeId],
            (err, res) => {
                return err || res.affectedRows === 0 ? reject() : resolve(res);
            }
        );
    });



module.exports = { get, getById, create, update, destroy, getCreator };