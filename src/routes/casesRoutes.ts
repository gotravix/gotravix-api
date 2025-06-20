const { Router } = require("express");
import { createCase } from "@/controllers/casesController";
import validateSchema from "@/middlewares/users/validateSchema";
import { createCaseValidation } from "@/validations/cases";
import { checkPatientExists } from "@/middlewares/cases/checkPatientExists";
import { checkClinicExists } from "@/middlewares/cases/checkClinicExists";
import { checkLawyerExists } from "@/middlewares/cases/checkLawyerExists";
import { validateJWT } from "@/middlewares/auth/validateJwt";


const router = Router();

//TODO: Implementar las rutas de casos
router.post(
  "/new",
  [
    validateSchema(createCaseValidation, "body"),
    validateJWT,
    checkPatientExists,
    checkClinicExists,
    checkLawyerExists
  ],
  createCase
);

export default router;
