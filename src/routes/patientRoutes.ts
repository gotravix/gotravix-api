import { createPatientEndpoint, getPatient, updatePatientEndpoint, deletePatientEndpoint } from "@controllers/patientController";
import { validateJWT } from "@/middlewares/auth/validateJwt";
import { validatePatientFields } from "@middlewares/validatePatientFields";
import { validateRolePatient } from "@middlewares/validateRolePatient";
import { validatePatientUserId } from "@middlewares/validatePatientUserId";
import z from "zod";
import { validateSchemaMw } from "../middlewares/users/validateSchema";
import { UserIdValidation } from "@/validations/users";

const { Router } = require('express');
const router = Router();

router.get(
  "/:id",
  [validateJWT, validateRolePatient, validateSchemaMw(UserIdValidation, "params")],
  getPatient
);
router.post("/new", [validateJWT, validateRolePatient, validatePatientUserId, validatePatientFields], createPatientEndpoint);
router.put(
  "/update/:id",
  [validateJWT, validateRolePatient, validateSchemaMw(UserIdValidation, "params"), validatePatientFields],
  updatePatientEndpoint
);
router.delete(
  "/delete/:id",
  [validateJWT, validateRolePatient, validateSchemaMw(UserIdValidation, "params")],
  deletePatientEndpoint
);

module.exports = router;