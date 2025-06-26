import {
  createPatientEndpoint,
  updatePatientEndpoint,
} from "@controllers/patientController";
import { validateJWT } from "@/middlewares/auth/validateJwt";
import {
  validatePatientNotExists,
  validatePatientExists,
  validateRolePatient,
  validateUserIsSelf,
  validateIdParam,
} from "@/middlewares/patients";
import { validateSchemaMw } from "../middlewares/users/validateSchema";
import { patientValidation } from "@/validations/patients";
import { validateUniqueUsername } from "@/middlewares/users/validateUniqueUsername";
const { Router } = require("express");
const router = Router();



router.post(
  "/new",
  [
    validateJWT,
    validateRolePatient,
    validateUserIsSelf,
    validatePatientNotExists,
    validateSchemaMw(patientValidation, "body"),
    validateUniqueUsername,
  ],
  createPatientEndpoint
);
router.put(
  "/update/:id",
  [
    validateJWT,
    validateRolePatient,
    validateUserIsSelf,
    validateIdParam,
    validatePatientExists,
    validateSchemaMw(patientValidation, "body"),
    validateUniqueUsername,
  ],
  updatePatientEndpoint
);

module.exports = router;
