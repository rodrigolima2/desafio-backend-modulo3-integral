const conexao = require('../conexao');
const { checkData, checkEmail } = require('../functions/validations');

const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret");

const detalharUsuario = async (req, res) => {
    res.status(200).json(req.usuario);
}

const cadastrarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;
    const validEmail = await checkEmail(email);

    if (!checkData([nome, nome_loja, email, senha])) {
        return res.status(400).json({ mensagem: "Os campos nome, nome_loja, email e senha devem ser preenchidos." });
    }

    if (!validEmail) {
        return res.status(400).json({ mensagem: 'O email já existe ou contém erros.' });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);
        const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const usuario = await conexao.query(query, [nome, nome_loja, email, hash]);

        if (usuario.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel cadastrar o usuário' });
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const atualizarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;
    const validEmail = await checkEmail(email);
    const usuarioId = req.usuario.id;

    if (!checkData([nome, nome_loja, email, senha])) {
        return res.status(400).json({ mensagem: 'Os campos nome, nome_loja, email e senha devem ser preenchidos.' });
    }

    if (!validEmail) {
        return res.status(400).json({ mensagem: 'O email já existe ou contém erros.' });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);
        const query = 'update usuarios set nome = $1, nome_loja = $2, email = $3, senha = $4 where id = $5';
        const usuario = await conexao.query(query, [nome, nome_loja, email, hash, usuarioId]);

        if (usuario.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel atualizar o usuário' });
        }

        res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!checkData([email, senha])) {
        return res.status(400).json({ mensagem: "Os campos email e senha são obrigatórios." });
    }

    try {
        const query = 'select * from usuarios where email = $1';
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const usuario = usuarios.rows[0];

        const result = await bcrypt.compare(senha, usuario.senha);

        if (!result) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const token = jwt.sign({
            id: usuario.id,
        }, jwtSecret);

        return res.status(201).json({ token: token });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    detalharUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    loginUsuario
};