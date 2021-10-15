const conexao = require('../conexao');

function checkData(data) {
    for (item of data) {
        if (item === undefined) {
            return false;
        }
    }

    return true;
}

async function checkEmail(email) {
    try {
        const query = 'select * from usuarios where email = $1';
        const usuario = await conexao.query(query, [email]);

        if (usuario.rowCount > 0) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    checkData,
    checkEmail
};