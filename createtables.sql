drop database if exists market_cubos;
create database market_cubos;

drop table if exists usuarios cascade;
create table usuarios (
  id serial primary key,
  nome varchar(50) not null,
  nome_loja varchar(50) not null,
  email varchar(70) not null,
  senha text not null
);

drop table if exists produtos;
create table produtos (
  id serial primary key,
  usuario_id integer not null references usuarios(id),
  nome varchar(100) not null,
  estoque integer not null,
  categoria varchar(50),
  preco integer not null,
  descricao text not null,
  imagem text
);