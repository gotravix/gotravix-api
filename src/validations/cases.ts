import z from "zod";

export const createCaseValidation = z.object({
    title: z.string().min(1, { message: "title is required" }),
    patientId: z.number({ required_error: "patientId is required" }),
    clinicId: z.number().optional(),
    lawyerId: z.number().optional(),
    description: z.string().min(1, { message: "description is required" }),
});
