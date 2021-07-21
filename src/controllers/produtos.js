const conexao = require("../utils/conexao");

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const { min, max } = req.query;

  let contador = 2;
  let query = "select * from produtos where usuario_id = $1";
  let values = [usuario.id];
  if (min) {
    query += ` and preco >= $${contador}`;
    values.push(min);
    contador++;
  }
  if (max) {
    query += ` and preco <= $${contador}`;
    values.push(max);
    contador++;
  }
  try {
    const { rows } = await conexao.query(query, values);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const query = "select * from produtos where id = $1 and usuario_id = $2";
    const { rows, rowCount } = await conexao.query(query, [id, usuario.id]);
    if (rowCount === 0) {
      return res
        .status(404)
        .json("Produto não existe ou não pertence a este usuário.");
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarProduto = async (req, res) => {
  const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
  if (!nome || !estoque || !preco || !descricao) {
    return res
      .status(400)
      .json("Nome, estoque, preço e descrição são obrigatórios.");
  }
  try {
    const query =
      "insert into produtos (usuario_id,nome,estoque,categoria,preco,descricao,imagem) values ($1,$2,$3,$4,$5,$6,$7)";
    const { rowCount } = await conexao.query(query, [
      usuario.id,
      nome,
      estoque,
      categoria,
      preco,
      descricao,
      imagem,
    ]);
    if (rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o produto.");
    }
    return res.status(200).json("Produto cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarProduto = async (req, res) => {
  const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
  const { id } = req.params;
  const { usuario } = req;

  if (!nome && !estoque && !categoria && !preco && !descricao && !imagem) {
    return res.status(400).json("Algum campo deve ser informado.");
  }

  try {
    const queryProduto =
      "select * from produtos where id = $1 and usuario_id = $2";
    const { rowCount, rows } = await conexao.query(queryProduto, [
      id,
      usuario.id,
    ]);

    if (rowCount === 0) {
      return res
        .status(404)
        .json("Nenhum produto encontrado ou este não pertence ao usuário.");
    }

    const produto = rows[0];
    const query =
      "update produtos set nome = $1, estoque = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7";
    const values = [
      nome ?? produto.nome,
      estoque ?? produto.estoque,
      categoria ?? produto.categoria,
      preco ?? produto.preco,
      descricao ?? produto.descricao,
      imagem ?? produto.imagem,
      produto.id,
    ];
    const { rowCount: alterado } = await conexao.query(query, values);
    if (alterado === 0) {
      return res.status(400).json("Não foi possível atualizar o produto.");
    }
    return res.status(200).json("Produto atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  try {
    const query = "select * from produtos where id = $1 and usuario_id = $2";
    const { rowCount } = await conexao.query(query, [id, usuario.id]);
    if (rowCount === 0) {
      return res
        .status(404)
        .json("Nenhum produto encontrado ou este não pertence ao usuário.");
    }

    const queryDeletar = "delete from produtos where id = $1";
    const { rowCount: produtoDeletado } = await conexao.query(queryDeletar, [
      id,
    ]);
    if (produtoDeletado === 0) {
      return res.status(400).json("Não foi possível deletar o produto.");
    }
    return res.status(200).json("Produto deletado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  deletarProduto,
};
