const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const insertarPost = async (usuario, url, descripcion) => {
  const consulta = {
    text: "INSERT INTO posts(usuario, url, descripcion, likes) VALUES($1, $2, $3, 0) RETURNING *",
    values: [usuario, url, descripcion],
  };
  const result = await pool.query(consulta);
  return result.rows[0];
};

const obtenerPosts = async () => {
  const result = await pool.query("SELECT * FROM posts");
  return result.rows;
};

const aumentarLikes = async (id) => {
  const consulta = {
    text: "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
    values: [id],
  };
  const result = await pool.query(consulta);
  return result.rows[0];
};

module.exports = { insertarPost, obtenerPosts, aumentarLikes };
