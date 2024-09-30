import bcrypt from 'bcryptjs';
import db from '../services/db.js';

const TABLE_NAME = process.env.USERS_TABLE;

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
};

const comparePassword = async (hashedPassword, password) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
};

const getUser = async (username) => {
  console.log('TABLE_NAME', TABLE_NAME);
  try {
    const { Item } = await db.get({
      TableName: TABLE_NAME,
      Key: {
        username: username,
      },
    });

    return Item;
  } catch (error) {
    throw error;
  }
};

const addUser = async (user) => {
  try {
    console.log('user', user);
    const ok = await db.put({
      TableName: TABLE_NAME,
      Item: user,
    });

    console.log('ok', ok);
    return;
  } catch (error) {
    throw new Error('error connecting to db');
  }
};

export { hashPassword, comparePassword, getUser, addUser };
