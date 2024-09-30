import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signToken = (username) => {
  console.log('JWT_KEY', process.env.JWT_KEY);
  const token = jwt.sign({ username }, process.env.JWT_KEY, {
    expiresIn: 7200,
  });

  return token;
};
