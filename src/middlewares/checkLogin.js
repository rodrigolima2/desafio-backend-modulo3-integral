const jwt = require('jsonwebtoken');
const secret = require('../jwt_secret');
const conexao = require('../conexao');

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json({ mensagem: 'Token não informado.' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, secret);
        const query = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await conexao.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido.' });
    }
}

module.exports = {
    checkLogin
};