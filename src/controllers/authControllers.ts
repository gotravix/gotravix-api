import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generarJWT from "@/helpers/jwt";
import { createUser, getUserById, updateUser, getUserByEmail } from "@/repositories/db/userRepository";
import { NewUser } from "@/models/schemas/users";
import { createActivationToken, getActivationToken, deleteActivationToken } from "@/repositories/db/activationTokenRepository";
import { sendEmail } from "@helpers/sendEmail";
import { APP_ORIGIN, FRONTEND_BASE_URL } from "@/constants/env";
import { buildUserData } from "@/utils/buildUserData";
import logger from "@/utils/logger";

export const registrer = async (req: Request, res: Response) => {
  try {
    // Tomar los datos del body
    const { email, password, role , username } = req.body;

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario en la base de datos
    const newUser: NewUser = {
      email,
      username: email,
      password: hashedPassword,
      role
    };
    const user = await createUser(newUser);

    // Elimina la creación automática del registro asociado vacío
    // Ahora NO se crea ningún registro en patient o clinic hasta que se llenen los datos

    // Generar token de activación seguro
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // Guardar el token usando el repository
    await createActivationToken({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    // Enviar email con la URL de activación
    const activationUrl = new URL(`/activate?token=${token}`, FRONTEND_BASE_URL).href;
    await sendEmail(
      email,
      "Activa tu cuenta en GoTravix",
      `<p>Hola,</p><p>Por favor activa tu cuenta haciendo clic en el siguiente enlace:</p><p><a href="${activationUrl}">${activationUrl}</a></p>`
    );

    // Responder con éxito
    res.status(201).json({
      ok: true,
      message: '🎉 User registered successfully. Please check your email to activate your account.',
      user: { id: user.id, email: user.email, role:user.role, created_at: user.created_at },
    });
    logger.info("User registered", { user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    logger.error("Error in registration", { error });
    return res.status(500).json({
      ok: false,
      message: '💥 Please contact the administrator',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Buscar al usuario por email (incluyendo contraseña)
    const usuario = await getUserByEmail(email, true) as any; // true: incluir contraseña
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        message: '❌ Incorrect username or password',
      });
    }
    // Verificar si la contraseña es correcta
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: '❌ Incorrect username or password',
      });
    }
    // Consultar datos asociados según el rol (reutilizable)
    const userData = await buildUserData(usuario);
    // Generar JWT
    const token = await generarJWT(usuario.id.toString(), usuario.email, usuario.email);
    res.status(200).json({
      ok: true,
      message: '✅ Login successful',
      token,
      user: userData,
    });
    logger.info("User logged in", { email });
  } catch (error) {
    logger.error("Error in login", { error });
    return res.status(500).json({
      ok: false,
      message: '💥 Please contact the administrator',
    });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ ok: false, message: "❌ Token is required" });
  }
  try {
    const activationToken = await getActivationToken(token);
    if (!activationToken) {
      return res.status(400).json({ ok: false, message: "❌ Invalid token" });
    }
    // Verificar expiración
    if (activationToken.expires_at < new Date()) {
      // Token expirado: generar uno nuevo y reenviar email
      const user = await getUserById(activationToken.user_id);
      if (!user) {
        return res.status(404).json({ ok: false, message: "❌ User not found" });
      }
      // Borrar el token viejo
      await deleteActivationToken(token);
      // Generar y guardar nuevo token
      const newToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await createActivationToken({
        user_id: user.id,
        token: newToken,
        expires_at: expiresAt,
      });
      // Reenviar email
      const activationUrl = `${APP_ORIGIN}/activate?token=${newToken}`;
      await sendEmail(
        user.email,
        "Activate your GoTravix account",
        `<p>Hello,</p><p>Your previous activation link expired. Please activate your account using this new link:</p><p><a href="${activationUrl}">${activationUrl}</a></p>`
      );
      return res.status(400).json({
        ok: false,
        message: "⏰ Token expired. A new activation email has been sent.",
      });
    }
    // Activar usuario
    const user = await updateUser(activationToken.user_id, { active: true });
    // Borrar el token
    await deleteActivationToken(token);
    if (!user) {
      return res.status(404).json({ ok: false, message: "❌ User not found after activation" });
    }
    // Consultar datos asociados según el rol para la respuesta (reutilizable)
    const userData = await buildUserData(user);
    // Generar JWT para el usuario activado
    const tokenJwt = await generarJWT(user.id.toString(), user.email, user.email);
    logger.info("User activated", { userId: user.id });
    return res.status(200).json({
      ok: true,
      message: "✅ Account activated successfully!",
      token: tokenJwt,
      user: userData,
    });
  } catch (error) {
    logger.error("Error in activation", { error });
    return res.status(500).json({
      ok: false,
      message: "💥 Please contact the administrator",
    });
  }
};


