const getToken = (req) => {
    // se meus headers nao tiver nada retorna nulo.
    if (!req.headers || !req.headers.authorization) {
        return null;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    return token;
}

module.exports = getToken;