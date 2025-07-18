const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
   
    //Create Token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret" );

    // return token

    res.status(200).json({
        message: 'Voce está autenticado',
        token: token,
        userId: user._id,
    });
}

module.exports = createUserToken;
