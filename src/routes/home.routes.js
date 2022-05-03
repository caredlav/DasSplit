const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get("/",homeController.getHome);

router.get("/registro",homeController.getRegister);
router.post("/registro",homeController.createUser);

router.get("/login",homeController.getLogin);
router.post("/login",homeController.login);

module.exports = router;