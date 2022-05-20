const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const {body}=require('express-validator');
const userLogged=require('../middlewares/userInSessionMiddleware');
const guest=require('../middlewares/guestMiddleware');

const registerValidations=[
    body('name')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Coloque su nombre."),

    body('lastName')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Coloque su apellido."),

    body('email')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Coloque su correo eletrónico.")
    .bail()
    .isEmail()
    .withMessage("El correo ingresado no es valido. Vuelva a ingresar un correo eletrónico valido."),

    body('pass')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Coloque una contraseña.")
    .bail()
    .isLength({min: 8})
    .withMessage("La contraseña es corta. Coloque una contraseña que tenga como mínimo 8 caracteres."),

    body('confirmPass')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Confirme la contraseña.")
    .bail()
    .isLength({min: 8})
    .withMessage("Confirme la contraseña con la cantidad de caracteres previamente ingresadas."),

    body('confirmPass')
    .custom((value,{req})=>{
        if(req.body.pass==value){
            return true;
        }else{
            return false;
        }
    })
    .withMessage("Las contraseñas no son iguales. Confirme nuevamente las contraseñas.")
];

const loginValidations=[
    body('email')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Introduzca el correo.")
    .bail()
    .isEmail()
    .withMessage("Debe colocar un formato de correo adecuado."),

    body('pass')
    .notEmpty()
    .withMessage("El campo no puede estar vacio. Introduzca su contraseña.")
]


const newPayValidations=[
    body('userOwes')
    .notEmpty()
    .withMessage("Debe seleccionar la persona quien debe."),

    body('amount')
    .notEmpty()
    .withMessage("Debe colocar la cantidad que debe la persona."),

    body('userWaiting')
    .notEmpty()
    .withMessage("Debe seleccionar la persona que espera el pago."),

    body('note')
    .notEmpty()
    .withMessage("Debe indicar la razón de la cuenta."),

    body('date')
    .notEmpty()
    .withMessage("Debe colocar la fecha en que se esta creando la cuenta.")
]

router.get("/",userLogged,homeController.getHome);

router.get("/registro",userLogged,homeController.getRegister);
router.post("/registro", registerValidations,homeController.createUser);

router.get("/login",userLogged,homeController.getLogin);
router.post("/login",loginValidations, homeController.login);

router.get("/logout/",homeController.logOut);

router.get("/profile",guest,homeController.getUserDetail);
router.post("/profile",homeController.sendInvitation);

router.get("/profile/dashboard",guest,homeController.getAdmPayments);

router.get("/profile/dashboard/crear-cuenta",guest,homeController.getNewPay);
router.post("/profile/dashboard/crear-cuenta",newPayValidations,homeController.submitPay);

router.get("/profile/dashboard/pagar-cuenta/:inv",guest,homeController.getPayDues);
router.post("/profile/dashboard/pagar-cuenta/:inv",homeController.payDues);

module.exports = router;