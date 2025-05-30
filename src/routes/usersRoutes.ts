import { getUsers } from "../controllers/usersControllers";
import { validateJWT } from "../middlewares/validateJwt";



const { Router } = require('express');

const router = Router();

const req = require('express/lib/request');

router.get('/all',[ validateJWT], getUsers);



module.exports = router;