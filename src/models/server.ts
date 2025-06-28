import express, { Application } from 'express';
import cors from 'cors';
import { APP_PORT, S3_ENDPOINT } from '@/constants/env';
import { pool } from '@/config/db';
import { errorHandler } from '@/middlewares/errorHandler';
import { transporter } from "@/helpers/sendEmail";
import logger from "@/utils/logger";


class Server {

    app: Application;
    port: string ;
    paths: { [key: string]: string };

    constructor() {
        this.app = express();
        this.port = `${APP_PORT}`;

        this.paths = {
            auth: '/api/v1/auth',
            users: '/api/v1/users',      
            patients: '/api/v1/patients',      
            case: '/api/v1/cases',      
        }

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Middleware global de manejo de errores (debe ir después de las rutas)
        (this.app as any).use(errorHandler);


    }


    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));
     
    }

    routes() {
        this.app.use(this.paths.auth, require('@/routes/authRoutes'));
        this.app.use(this.paths.users, require('@/routes/usersRoutes'));
        this.app.use(this.paths.patients, require('@/routes/patientRoutes'));
    }


    async listen() {
        try {
            await pool.query('SELECT 1');
            logger.info("✅ Database connection successful");
            // Validate SMTP connection depending on environment
            try {
                await transporter.verify();
                logger.info("✅ SMTP server is ready");
            } catch (smtpError) {
                if (process.env.NODE_ENV === 'development') {
                    logger.error("❌ SMTP server is not ready or credentials are invalid. Shutting down in development.", { error: smtpError });
                    process.exit(1);
                } else {
                    logger.warn("⚠️  SMTP server is not ready or credentials are invalid (only logged in production)", { error: smtpError });
                }
            }

            // Validate S3/MinIO connection before starting server
            try {
                const healthUrl = new URL("/minio/health/ready", S3_ENDPOINT).toString();
                const response = await fetch(healthUrl);
                if (!response.ok) throw new Error(`S3 health check failed with status ${response.status}`);
                logger.info("✅ S3 service is ready");
            } catch (s3Error) {
                if (process.env.NODE_ENV === 'development') {
                    logger.error("❌ S3 service is not ready or unreachable. Shutting down in development.", { error: s3Error });
                    process.exit(1);
                } else {
                    logger.warn("⚠️  S3 service is not ready or unreachable (only logged in production)", { error: s3Error });
                }
            }

        } catch (error) {
            logger.error('❌ Error connecting to the database:', { error });
            process.exit(1);
        }
        this.app.listen(this.port, () => {
            logger.info(`🚀 Server running on port ${this.port}`);
        });
    }


}

export default Server;