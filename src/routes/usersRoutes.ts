import { validateSchema } from "@/middlewares/validateSchema";
import { getUsers, updateUsers } from "../controllers/usersControllers";
import { validateJWT } from "../middlewares/validateJwt";
import { updateUsersQuerySchema, updateUsersBodySchema } from "@/validators/users";



const { Router } = require('express');

const router = Router();

const req = require('express/lib/request');

router.get('/all',[ validateJWT], getUsers);

router.put(
    "", 
    [
        validateSchema(updateUsersQuerySchema, "query"),
        validateSchema(updateUsersBodySchema, "body"),
    ], 
    updateUsers,
)



module.exports = router;