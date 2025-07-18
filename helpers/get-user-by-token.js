const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para pegar o usuário a partir de um token JWT
const getUserByToken = async (token) => {
    if (!token) {
        return res.status(401).json({message: 'Acesso Negado!'});
    }

    try {
        // Decodifica o token para obter o ID do usuário
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Busca o usuário no banco de dados pelo ID
        const user = await User.findOne({ _id: userId });
        
        return user;

    } catch (error) {
        // Se o token for inválido ou ocorrer outro erro
        return null;
    }
};

module.exports = getUserByToken;