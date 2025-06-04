import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import yargs from "yargs"
import { hideBin } from "yargs/helpers";
import z from "zod";
import { randomInt } from 'crypto';
import { db } from '@/config/db';
import { clinicsSchema, patientsSchema, usersSchema } from '@/models/schemas';
import logger from './logger';

const argsSchema = z.object({
  user: z.object({
    count: z.coerce.number().int().min(1).max(1000).default(50),
    name: z.string().optional(),
  }),
  dryRun: z.boolean().optional(),
});

export type Args = z.infer<typeof argsSchema>;

export function getArgs(): Args {
  const argv = yargs(hideBin(process.argv))
    .option('user.count', {
      type: 'number',
      describe: 'Number of users to seed',
      default: 50,
    })
    .option('dryRun', {
      type: 'boolean',
      describe: 'Run without making changes',
    })
    .help(false)
    .parseSync();

  const parsed = argsSchema.safeParse(argv);
  if (!parsed.success) {
    throw new Error('Invalid CLI arguments: ' + JSON.stringify(parsed.error.format(), null, 2));
  }
  return parsed.data;
}

export default async function seed(args: Args = getArgs()) {
    const roles = ['admin', 'clinic', 'patient', 'marketer', 'lawyer'] as const;
    const insertionCounter = {
      guests: 0,
      patients: 0,
      clinics: 0,
      lawyers: 0,
      marketers: 0,
      admins: 0,
    }
    console.log(chalk.green("🌱 Seeding database ..."));

    async function addUsers() {
      for (let i = 0; i < args.user.count; i++) {
        const currentRole = roles[randomInt(0, roles.length)];
        const user = {
          username: faker.person.fullName(),
          email: faker.internet.email(),
          role: currentRole,
          password: faker.internet.password(),
          active: true,
        };

        const [userRow] = await db
          .insert(usersSchema)
          .values({
            ...user,
            // wizard, created_at, updated_at se autogeneran
          })
          .returning();
        
        if (currentRole === 'patient') {
          const patient = {
            givenName: faker.person.firstName(),
            familyName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            birthDate: faker.date.birthdate().toISOString().split("T")[0],
          }

          const patientRow = await db
            .insert(patientsSchema)
            .values({
              userId: userRow.id,
              ...patient,
            })
            .returning();
          
          insertionCounter.patients++
        } else if (currentRole === 'clinic') {
          const clinic = {
            name: faker.company.name(),
            address: faker.location.streetAddress(),
            contactNumber: faker.phone.number(),
            licenseNumber: faker.string.alphanumeric(10),
          }

          const clinicRow = await db
            .insert(clinicsSchema)
            .values({
              userId: userRow.id,
              ...clinic,
            })
            .returning();
          
          insertionCounter.clinics++
        } else if (currentRole === 'lawyer') {
          insertionCounter.lawyers++
        } else if (currentRole === 'marketer') {
          insertionCounter.marketers++
        } else if (currentRole === 'admin') {
          insertionCounter.admins++
        } else {
          insertionCounter.guests++
        }

      }
    }

    if (args.user.count > 0) {
      await addUsers()
    }

    logger.info(`
      Inserted the following records:
      🕵️  (guests): ${insertionCounter.guests}
      🤕  (patients): ${insertionCounter.patients}
      🏥  (clinics): ${insertionCounter.clinics}
      👨‍⚖️  (lawyers): ${insertionCounter.lawyers}
      📈  (marketers): ${insertionCounter.marketers}
      👑  (admins): ${insertionCounter.admins}
    `)

}

if (require.main === module) {
    (async () => {
      await seed();
    })()
}