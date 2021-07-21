const conexao = require("../utils/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../utils/jwtSecret");

const verificaEmail = async email => {
  const queryEmail = "select * from usuarios where email = $1";
  const { rowCount, rows } = await conexao.query(queryEmail, [email]);
  return { rows, rowCount };
};

const cadastrarUsuario = async (req, res) => {
  const { nome, nome_loja, email, senha } = req.body;
  if (!nome) {
    return res.status(400).json("Nome é obrigatório.");
  }
  if (!nome_loja) {
    return res.status(400).json("Nome_loja é obrigatório.");
  }
  if (!email) {
    return res.status(400).json("Email é obrigatório.");
  }
  if (!senha) {
    return res.status(400).json("Senha é obrigatório.");
  }
  try {
    const { rowCount: qtdEmail } = await verificaEmail(email);
    if (qtdEmail > 0) {
      return res.status(400).json("Email já cadastrado.");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryCadastro =
      "insert into usuarios (nome,nome_loja,email,senha) values ($1,$2,$3,$4)";
    const { rowCount } = await conexao.query(queryCadastro, [
      nome,
      nome_loja,
      email,
      senhaCriptografada,
    ]);
    if (rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o usuário.");
    }
    return res.status(200).json("Usuário cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body;
  if (!email) {
    return res.status(400).json("Email é obrigatório.");
  }
  if (!senha) {
    return res.status(400).json("Senha é obrigatório.");
  }

  try {
    const { rows, rowCount } = await verificaEmail(email);
    if (rowCount === 0) {
      return res.status(404).json("Usuário não encontrado.");
    }
    const usuario = rows[0];

    const verificarSenha = await bcrypt.compare(senha, usuario.senha);

    if (!verificarSenha) {
      return res.status(400).json("Email ou senha incorretos.");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
      },
      secret,
      { expiresIn: "1d" }
    );
    const { senha: userPass, ...infoUsuario } = usuario;

    return res.status(200).json({ infoUsuario, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const visualizarPerfil = async (req, res) => {
  const { usuario } = req;
  return res.status(200).json(usuario);
};

const editarPerfil = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome && !email && !senha && !nome_loja) {
    return res
      .status(400)
      .json("Algum dado deve ser fornecido para realizar alteração.");
  }
  try {
    if (email !== usuario.email) {
      const { rowCount } = await verificaEmail(email);
      if (rowCount > 0) {
        return res.status(400).json("Email já cadastrado");
      }
    }

    if (senha) {
      const query =
        "update usuarios set nome = $1, email = $2, nome_loja = $3, senha = $4 where id = $5";
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const values = [
        nome ?? usuario.nome,
        email ?? usuario.email,
        nome_loja ?? usuario.nome_loja,
        senhaCriptografada,
        usuario.id,
      ];
      const { rowCount } = await conexao.query(query, values);
      if (rowCount === 0) {
        return res.status(400).json("Não foi possível atualizar o usuário.");
      }
      return res.status(200).json("Usuário atualizado com sucesso.");
    }
    const query =
      "update usuarios set nome = $1, email = $2, nome_loja = $3 where id = $4";

    const values = [
      nome ?? usuario.nome,
      email ?? usuario.email,
      nome_loja ?? usuario.nome_loja,
      usuario.id,
    ];
    const { rowCount } = await conexao.query(query, values);
    if (rowCount === 0) {
      return res.status(400).json("Não foi possível atualizar o usuário.");
    }
    return res.status(200).json("Usuário atualizado com sucesso.");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  logarUsuario,
  visualizarPerfil,
  editarPerfil,
};
