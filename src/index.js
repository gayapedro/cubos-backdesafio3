require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rotasUsuarios = require('./routes/usuarios');
const rotasProdutos = require('./routes/produtos');
const app = express();

app.use(express.json());
app.use(cors());
app.use(rotasUsuarios);
app.use(rotasProdutos);

app.listen(process.env.PORT || 3000);
