const router = require('express').Router();
const UserController = require('../controllers/UserController');
// middleware
const verifyToken = require('../helpers/verify-token');
// Rotas POST
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rotas get    
router.get('/listar', UserController.listarUsuarios);
router.get('/checkUser', UserController.checkUser); 
router.get('/:id', UserController.listarUsuarioId);  

// Rotas Patch
router.patch('/edit/:id', verifyToken, UserController.editUser);
router.delete('/delete/:id', verifyToken, UserController.deleteUser);

module.exports = router;