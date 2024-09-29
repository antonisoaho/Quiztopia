import jwt from 'jsonwebtoken';

const signToken = (username) => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: 7200,
  });

  return token;
};

export default signToken;
