import {login, registrer} from "../controllers/authControllers";
import validateLoginFields from "../middlewares/validateLoginFields";
import { validateUniqueEmail } from "../middlewares/validateUniqueEmail";
import { validateUserForRegister }  from "../middlewares/validateUserForRegister";
import { validateUserIsActive } from "../middlewares/validateUserIsActive";


const { Router } = require('express');

const router = Router();

router.post('/register',[ validateUserForRegister , validateUniqueEmail], registrer);
router.post('/login',[ validateLoginFields, validateUserIsActive], login);


module.exports = router;