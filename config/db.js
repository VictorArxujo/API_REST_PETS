const mongoose = require('mongoose');

async function connectToDatabase () {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado ao banco");
    }catch(error){
        console.log("ERRO:", error.message);
        process.exit(1);
    }   
}

module.exports = connectToDatabase;