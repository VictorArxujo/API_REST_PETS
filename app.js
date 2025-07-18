const express = require('express');
require('dotenv').config();
const app = express();
const connectToDatabase = require('./config/db');
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

connectToDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Sevidor Rodando na porta ${process.env.PORT}`))
    });