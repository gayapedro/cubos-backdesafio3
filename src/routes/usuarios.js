const express = require("express");
const usuarios = require("../controllers/usuarios");
const verificaLogin = require("../middlewares/verificaLogin");
const rotas = express();

//cadastrar
rotas.post("/cadastro", usuarios.cadastrarUsuario);

//login
rotas.post("/login", usuarios.logarUsuario);

rotas.use(verificaLogin); //filtro

//perfil
rotas.get("/perfil", usuarios.visualizarPerfil);
rotas.put("/perfil", usuarios.editarPerfil);

module.exports = rotas;
