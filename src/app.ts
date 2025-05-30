import Server from "./models/server"  // Asegúrate de que la ruta sea correcta
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

// Crear e iniciar el servidor
const server = new Server();
server.listen();
