const Pet = require('../models/Pet');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;


module.exports = class PetController {

    static async getpets (req, res) {

        try{
            const {name} = req.query;
            const filter = {};

            if (name) {
                filter.name = {$regex: new RegExp(name, 'i')};
            }
            const pet = await Pet.find(filter);
            res.status(200).json({pet})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }


    static async register (req, res) {

        // Pega os dados do pet do corpo da requisição
        const { name, age, weight, color } = req.body;
        
        // O pet começa como disponível para adoção
        const available = true;

        // Validações dos campos
        if (!name) {
            return res.status(422).json({ message: 'O nome é obrigatório!' });
        }
        if (!age) {
            return res.status(422).json({ message: 'A idade é obrigatória!' });
        }
        if (!weight) {
            return res.status(422).json({ message: 'O peso é obrigatório!' });
        }
        if (!color) {
            return res.status(422).json({ message: 'A cor é obrigatória!' });
        }

        // Pega o dono do pet (o usuário que está logado)
        const token = getToken(req);
        const user = await getUserByToken(token);
        console.log(user)

        // Cria o objeto do pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
            },
        });

        try {
            const newPet = await pet.save();
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    //  Rota GET que retorne todos os pets do usuário logado (*validar token)

    static async getmypets (req, res) {

        const token = getToken(req);
        const user = await getUserByToken(token);
        if (!user) {
            res.status(422).json({message: "Usuário Não encontrado"});
        }

        try{
            // Busca os pets, de acordo com id do token.

            const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');
            res.status(200).json({ pets });
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

    // ● Rota GET que retorne um pet a partir do seu ID
    static async getbyid (req, res){
        
        const id  = req.params.id;

        try{
            const pets = await Pet.findById(id);
            res.status(200).json({ pets });

        }catch(err){
            res.status(500).json({ error: err.message });

        }

    }

    // Rota PATCH para atualização de um pet a partir do seu ID (*validar token)

    static async updatePetById(req, res) {
        
        const id = req.params.id;
        const { name, age, weight, color } = req.body;

        const updatedData = {};

        // Valida se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        // Encontra o pet no banco
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' });
        }

        // Verifica se o usuário logado é o dono do pet
        const token = getToken(req);
        const user = await getUserByToken(token);
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Acesso negado! Você não é o dono deste pet.' });
        }

        // Validações dos dados enviados
        if (!name) { return res.status(422).json({ message: 'O nome é obrigatório!' }); }
        updatedData.name = name;

        if (!age) { return res.status(422).json({ message: 'A idade é obrigatória!' }); }
        updatedData.age = age;

        if (!weight) { return res.status(422).json({ message: 'O peso é obrigatório!' }); }
        updatedData.weight = weight;

        if (!color) { return res.status(422).json({ message: 'A cor é obrigatória!' }); }
        updatedData.color = color;

        try {
            await Pet.findByIdAndUpdate(id, updatedData);
            res.status(200).json({ message: 'Pet atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async scheduleVisit (req, res) {
        const id = req.params.id;

        // Valida se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        // Encontra o pet no banco
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' });
        }

        // Pega o usuário que está a agendar a visita (a partir do token)
        const token = getToken(req);
        const user = await getUserByToken(token);

        // Verifica se o usuário logado é o dono do pet
        if (pet.user._id.equals(user._id)) {
            return res.status(422).json({ message: 'Você não pode agendar uma visita para o seu próprio pet!' });
        }

        // Verifica se o pet já tem uma visita agendada por este usuário
        if (pet.adopter && pet.adopter._id.equals(user._id)) {
            return res.status(422).json({ message: 'Você já agendou uma visita para este pet!' });
        }
        
        // Adiciona o usuário como "adotante" (quem agendou)
        pet.adopter = {
            _id: user._id,
            name: user.name,
        };

        try {
            await Pet.findByIdAndUpdate(id, pet);
            res.status(200).json({
                message: `Visita agendada com sucesso! Entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}.`
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    // ● Rota PATCH para concluir uma adoção (*validar token)

    static async concludeAdoption(req, res) {
        
        const id = req.params.id;

        // Valida se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        // Encontra o pet no banco
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' });
        }

        // Pega o usuário que está a tentar concluir a adoção (a partir do token)
        const token = getToken(req);
        const user = await getUserByToken(token);

        // Regra de negócio: Verifica se o usuário logado é o dono do pet
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Acesso negado! Apenas o dono pode concluir a adoção.' });
        }

        // Atualiza o status do pet para não disponível
        pet.available = false;

        try {
            await Pet.findByIdAndUpdate(id, pet);
            res.status(200).json({
                message: 'Parabéns! A adoção do pet foi concluída com sucesso.'
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}