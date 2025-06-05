import validateSchema, { validateSchemaMw } from "@/middlewares/validateSchema";
import { createUsers, getUsers, updateUsers } from "@/controllers/usersControllers";
import { validateJWT } from "@/middlewares/validateJwt";
import { createUserValidation, updateUserQueryValidation, updateUserValidation } from "@/validations/users";



const { Router } = require('express');

const router = Router();

const req = require('express/lib/request');

router.get('/all',[ validateJWT], getUsers);

router.post(
    "",
    [
        validateSchema(createUserValidation, "body"),
    ],
    createUsers
)

router.put(
    "", 
    [
        validateSchema(updateUserValidation, "query"),
        validateSchema(updateUserQueryValidation, "body"),
    ], 
    updateUsers,
)





module.exports = router;