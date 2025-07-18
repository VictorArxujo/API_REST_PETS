const router = require('express').Router();
const PetController = require('../controllers/PetController');
const verifyToken = require('../helpers/verify-token');

//Rotas POST
router.post('/register', verifyToken, PetController.register);

//Rotas GET
router.get ('/listar', PetController.getpets);
router.get('/meuspets', verifyToken, PetController.getmypets);
router.get('/pet/:id', PetController.getbyid);

//Rotas Patch
router.patch('/update/:id', verifyToken, PetController.updatePetById);
router.patch('/shoudle/:id', verifyToken, PetController.scheduleVisit);
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);

module.exports = router;