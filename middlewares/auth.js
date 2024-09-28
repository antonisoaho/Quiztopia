import jwt from 'jsonwebtoken';

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace('Bearer ', '');

      if (!token) throw Error();

      const data = jwt.verify(token, process.env.JWT_KEY);
      request.event.username = data.username;

      return request.response;
    } catch (error) {}
  },
};

export { validateToken };
