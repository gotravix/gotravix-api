import { createPatientEndpoint, getPatient, updatePatientEndpoint, deletePatientEndpoint } from "@/controllers/patientController";
import { validateJWT } from "@/middlewares/validateJwt";
import { validatePatientFields } from "@/middlewares/validatePatientFields";
import { validateRolePatient } from "@/middlewares/validateRolePatient";
import { validatePatientUserId } from "@/middlewares/validatePatientUserId";
const { Router } = require('express');
const router = Router();

router.get("/:id", [validateJWT, validateRolePatient], getPatient);
router.post("/new", [validateJWT, validateRolePatient, validatePatientUserId, validatePatientFields], createPatientEndpoint);
router.put("/update/:id", [validateJWT, validateRolePatient, validatePatientFields], updatePatientEndpoint);
router.delete("/delete/:id", [validateJWT, validateRolePatient], deletePatientEndpoint);

module.exports = router;
