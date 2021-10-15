CREATE DATABASE market_cubos;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios(
  id serial NOT NULL PRIMARY KEY,
  nome varchar(100) NOT NULL,
  nome_loja varchar(100) NOT NULL,
  email varchar(150) UNIQUE NOT NULL,
  senha text NOT NULL
);

DROP TABLE IF EXISTS produtos;

CREATE TABLE IF NOT EXISTS produtos(
  id serial NOT NULL PRIMARY KEY,
  usuario_id int NOT NULL REFERENCES usuarios(id),
  nome varchar(150) NOT NULL,
  quantidade int NOT NULL,
  categoria varchar(150),
  preco int NOT NULL,
  descricao text,
  imagem text
);