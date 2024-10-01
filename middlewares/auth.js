import jwt from 'jsonwebtoken';
import { sendError } from '../services/responses.js';

export const validateToken = {
  before: async (request) => {
    try {
      const serializedToken = request.event.headers.authorization;
      if (!serializedToken) throw new Error();

      const token = serializedToken.replace('Bearer ', '');
      if (!token) throw new Error();

      const data = jwt.verify(token, process.env.JWT_KEY);
      request.event.username = data.username;
      return request.response;
    } catch (error) {
      return sendError(401, { error: 'No valid token' });
    }
  },
};

export const optionalValidateToken = {
  before: async (request) => {
    const serializedToken = request.event.headers.authorization;
    if (!serializedToken) return request.response;

    const token = serializedToken.replace('Bearer ', '');
    if (!token) return request.response;
    try {
      const data = jwt.verify(token, process.env.JWT_KEY);
      request.event.username = data.username;
      return request.response;
    } catch (error) {
      return;
    }
  },
};
