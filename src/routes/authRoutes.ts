import { activateUser, login, registrer } from "../controllers/authControllers";
import { validateUniqueEmail } from "../middlewares/auth/validateUniqueEmail";
import { validateUserIsActive } from "../middlewares/auth/validateUserIsActive";
import { validateSchemaMw } from "../middlewares/users/validateSchema";
import { activateValidation, loginValidation, registerValidation } from "@/validations/auth";
import z from "zod";



const { Router } = require("express");
const router = Router();

router.post(
  "/register",
  [validateSchemaMw(registerValidation, "body"), validateUniqueEmail],
  registrer
);
router.post(
  "/login",
  [validateSchemaMw(loginValidation, "body"), validateUserIsActive],
  login
);
router.post(
  "/activate",
  [validateSchemaMw(activateValidation, "body")],
  activateUser
);

module.exports = router;