import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/constants/env';

interface Payload {
  id: string;
  username: string;
  email: string;
}

// Function to generate the JWT
export const generarJWT = async (id: string, username: string, email: string): Promise<string> => {
  const payload: Payload = { id, username, email };

  try {
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
        if (err) {
          return reject('❌ Could not generate token: ' + err.message);
        }
        resolve(token as string);
      });
    });
    return token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('💥 Error generating token: ' + error.message);
    } else {
      throw new Error('💥 Error generating token');
    }
  }
};

export default generarJWT;