import validateSchema from "@/middlewares/users/validateSchema";
import { createUsers, getUser, updateUsers } from "@/controllers/usersControllers";
import { validateJWT } from "@/middlewares/auth/validateJwt";
import { createUserValidation, UserIdValidation } from "@/validations/users";
import { ensureOwnUser } from "@/middlewares/users/ensureOwnUser";



const { Router } = require('express');

const router = Router();

const req = require('express/lib/request');


router.get('/info', [ validateJWT], getUser);

router.post(
    "/new",
    [
        validateSchema(createUserValidation, "params"),
    ],
    createUsers
)

router.put(
    "/update/:id", 
    [
        validateSchema(UserIdValidation, "query"),
        validateSchema(UserIdValidation, "body"),
    ], 
    updateUsers,
)





module.exports = router;