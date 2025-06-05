import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import yargs from "yargs"
import { hideBin } from "yargs/helpers";
import z from "zod";
import { randomInt } from 'crypto';
import { db, pool } from '@/config/db';
import { clinicsSchema, patientsSchema, usersSchema } from '@/models/schemas';
import logger from '../logger';
import { padEmoji } from '../utils';

const argsSchema = z.object({
  user: z.object({
    count: z.coerce.number().int().min(1).max(1000).default(50),
    name: z.string().optional(),
  }),
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
    const roles = ['clinic', 'patient', 'guest'] as const;
    const insertionCounter = {
      guests: 0,
      patients: 0,
      clinics: 0,
    }
    
    logger.info(chalk.green("🌱 Seeding database ..."));

    async function addUsers() {
      for (let i = 0; i < args.user.count; i++) {
        const currentRole = roles[randomInt(0, roles.length)];
        const user = {
          username: faker.internet.username(),
          email: faker.internet.email(),
          role: currentRole,
          password: faker.internet.password(),
          active: true,
        };

        const [userRow] = await db
          .insert(usersSchema)
          .values(user)
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

          
        } else {
          insertionCounter.guests++
        }

      }
    }

    if (args.user.count > 0) {
      await addUsers()
    }

    console.log([
      'Inserted the following records:',
      `${padEmoji('🕵️')}(guests): ${insertionCounter.guests}`,
      `${padEmoji('🤕')}(patients): ${insertionCounter.patients}`,
      `${padEmoji('🏥')}(clinics): ${insertionCounter.clinics}`,
      `${padEmoji('👨‍⚖')}(lawyers): ${(insertionCounter as any).lawyers as undefined ?? 0}`,
    ].join('\n'));

    console.log(chalk.green("🌱 Seeding completed!"));

    pool.end()

}

if (require.main === module) {
    (async () => {
      await seed();
    })()
}