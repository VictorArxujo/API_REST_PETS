const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

module.exports = class UserController {
    
    static async register (req, res) {
        
        const {name, email, password, phone} = req.body;
        
        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' });
            return;
        }

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!' });
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.' });
            return;
        }

        if(!phone) {
            res.status(422).json({ message: 'O número de contato é obrigatório!' });
            return;
        }

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' });
            return;
        }

        // Verifica Email

        const userExists = await User.findOne({email: email});
        if (userExists) {
            res.status(422).json({message: "Este Email ja existe"});
            return
        }
       
        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt); // super senha

        const user = new User({
            name: name,
            email: email,
            password: passwordHash,
            phone: phone,
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        }catch(err){
            res.status(500).json({ message: error });
            return;
        }
    }

    static async listarUsuarios(req, res){

        try{
            const {name} = req.query;
            const filter = {};

            if (name) {
                filter.name = {$regex: new RegExp(name, 'i')};
            }

            const user = await User.find(filter);
            res.status(200).json({user})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async listarUsuarioId (req, res) {
        const id = req.params.id;
        try {
            const user = await User.findOne({ _id: id });
            if (!user) {
            res.status(404).json({ message: "Nenhum usuario encontrado" });
            return;
            } else {
            res.status(200).json({ message: user });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

     static async login(req, res) {
        
        const { email, password } = req.body;

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!' });
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.' });
            return;
        }

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' });
            return;
        }


        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Não há usuário cadastrado com este e-mail.' });
        }

        // Esta comparação agora vai funcionar
        const checkPassword = await bcrypt.compare(password, user.password);
        
        if (!checkPassword) {
            return res.status(401).json({ message: 'Senha inválida!' });
        }
        
        await createUserToken(user, req, res);
    }


    static async checkUser(req, res) {
        let currentUser;

        if(req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined;   
        } else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
     }

    static async editUser(req, res) {
        
        const id = req.params.id;
        const loggedInUserId = req.user.id;

        // Medida de segurança: Garante que o usuário só pode editar o seu próprio perfil
        if (loggedInUserId !== id) {
            return res.status(403).json({ message: "Acesso negado!" });
        }

        // 2. Usar o ObjectId importado para validar o ID
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        const { name, email, phone, password, confirmpassword } = req.body;
        
        // Cria um objeto com os dados a serem atualizados
        const updateData = { name, email, phone };
        
        // Valida se o e-mail já está em uso por outro usuário
        const userExists = await User.findOne({ email: email });
        if (userExists && userExists._id.toString() !== id) {
            return res.status(422).json({ message: "E-mail já em uso." });
        }
        if (password) {
            if (password !== confirmpassword) {
                return res.status(422).json({ message: "As senhas não conferem!" });
            }
            const salt = await bcrypt.genSalt(12);
            updateData.password = await bcrypt.hash(password, salt);
        }

        try {
            // Atualiza o usuário no banco de dados
            await User.findByIdAndUpdate(id, updateData);
            res.status(200).json({ message: "Usuário atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
    static async deleteUser(req, res) {
        const  id  = req.params.id;
    
        // Verifica Id
        if(!ObjectId.isValid(id)) {
           return res.status(400).json({ message: 'ID Inválido!' });
        }

        // Verifica se o usuário existe pelo id
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Verifica se o usuário logado possui o mesmo id que será removido
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(user._id.toString() !== decoded.id.toString()) {
            res.status(403).json({ message: 'Acesso Negado. Não é possível processar sua solicitação.' });
            return;
        }

        try {
            await User.deleteOne({ _id: id });
            res.status(200).json({ message: 'Usuário removido com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde.' });
            return;
        }
    }
     

}

