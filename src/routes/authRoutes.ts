import { validateRoleNotEmpty } from "../middlewares/validateRoleNotEmpty";
import { activateUser, login, registrer } from "../controllers/authControllers";
import validateLoginFields from "../middlewares/validateLoginFields";
import { validateUniqueEmail } from "../middlewares/validateUniqueEmail";
import { validateUserForRegister } from "../middlewares/validateUserForRegister";
import { validateUserIsActive } from "../middlewares/validateUserIsActive";


const { Router } = require('express');

const router = Router();

router.post('/register',[ validateUserForRegister , validateUniqueEmail , validateRoleNotEmpty], registrer);
router.post('/login',[ validateLoginFields, validateUserIsActive], login);
router.post('/activate', activateUser);


module.exports = router;