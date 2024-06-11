CREATE DATABASE likeme;

CREATE TABLE posts (
    id SERIAL,
    usuario VARCHAR(25),
    url VARCHAR(1000),
    descripcion VARCHAR(255),
    likes INT
);

SELECT * FROM posts