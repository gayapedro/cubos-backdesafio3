const express = require("express");
const produtos = require("../controllers/produtos");
const rotas = express();

//produtos
rotas.get("/produtos", produtos.listarProdutos);
rotas.get("/produtos/:id", produtos.obterProduto);
rotas.post("/produtos", produtos.cadastrarProduto);
rotas.put("/produtos/:id", produtos.atualizarProduto);
rotas.delete("/produtos/:id", produtos.deletarProduto);

module.exports = rotas;
