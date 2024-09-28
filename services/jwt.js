import jwt from 'jsonwebtoken';

const signToken = (username) => {
  const newToken = jwt.sign({ username }, process.env.JWT_SECRET);
};

export default signToken;
