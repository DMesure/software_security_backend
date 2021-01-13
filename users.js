"use strict";
const connection = require("./connection");

const getId = async ({ sub }) =>
  await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `id` FROM users WHERE `sub` = ?",
      [sub],
      (err, res) => {
        return err || res.length === 0
          ? reject()
          : resolve(res[0].id);
      }
    );
  });

const isAdmin = async (userId) =>
  await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `isAdmin` FROM users WHERE `id` = ?",
      [userId],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve(res[0].isAdmin);
      }
    );
  });

const getById = async (userId, { sub = undefined }) => {
  let query = "SELECT * FROM users WHERE `id` = ?";
  let filters = [userId];
  if (!userId) {
    query = "SELECT * FROM users WHERE `sub` = ?";
    filters = [sub];
  }

  return await new Promise((resolve, reject) => {
    connection.query(query, filters, (err, user) => {
      if (err || user.length === 0) {
        return reject();
      }
      return resolve(user[0]);
    });
  });
};

const create = async ({ sub }) =>
  await new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users VALUES (NULL, ?, 0)",
      [sub],
      (err, user) => {
        return err || user.length === 0 ? reject() : resolve(user.insertId);
      }
    );
  });

const update = async (userId, { isAdmin = 0 }) =>
  await new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET `isAdmin` = ? WHERE `id` = ?",
      [isAdmin, userId],
      (err, res) => {
        return err || res.length === 0 ? reject() : resolve();
      }
    );
  });

const destroy = async (userId) =>
  await new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM users WHERE `id` = ?",
      [userId],
      (err, res) => {
        return err || res.affectedRows === 0 ? reject() : resolve();
      }
    );
  });

module.exports = {
  getId,
  isAdmin,
  getById,
  create,
  update,
  destroy,
};
