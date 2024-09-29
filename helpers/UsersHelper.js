import 'module-alias/register';
import bcrypt from 'bcryptjs';
import db from '@services/db';

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
    await db.put({
      TableName: TABLE_NAME,
      Item: {
        user,
      },
    });
    return;
  } catch (error) {
    throw new Error('error connecting to db');
  }
};

export { hashPassword, comparePassword, getUser, addUser };
