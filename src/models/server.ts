import express, { Application } from 'express';
import cors from 'cors';
import { APP_PORT } from '../constants/env';
import { pool } from '../config/db';
import { errorHandler } from '../middlewares/errorHandler';


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
        this.app.use(this.paths.auth, require('../routes/authRoutes'));
        this.app.use(this.paths.users, require('../routes/usersRoutes'));
        this.app.use(this.paths.patients, require('../routes/patientRoutes'));
    }


    async listen() {
        try {
            await pool.query('SELECT 1');
            console.log('\x1b[32m%s\x1b[0m', '✅ Conexión a la base de datos exitosa');
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', '❌ Error al conectar con la base de datos:', error);
            process.exit(1);
        }
        this.app.listen(this.port, () => {
            console.log('\x1b[36m%s\x1b[0m', `🚀 Servidor corriendo en puerto ${this.port}`);
        });
    }


}

export default Server;