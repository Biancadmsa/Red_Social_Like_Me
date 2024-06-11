const express = require("express");
const { insertarPost, obtenerPosts, aumentarLikes } = require("./consultas");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/post", async (req, res) => {
  const { usuario, URL, descripcion } = req.body;
  try {
    const result = await insertarPost(usuario, URL, descripcion);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el post" });
  }
});

app.put("/post", async (req, res) => {
  const { id } = req.query;
  try {
    const result = await aumentarLikes(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al aumentar los likes" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await obtenerPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

app.listen(PORT, () => {
  console.log(`Este servidor está corriendo el port http://localhost:${PORT} 😎`);
});
