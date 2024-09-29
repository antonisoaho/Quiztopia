import 'module-alias/register';
import db from '@services/db';
import { uuidv4 as uuid } from 'uuid';

const TABLE_NAME = process.env.QUIZ_TABLE;

const addQuiz = async (username, quizName) => {
  const item = {
    username: username,
    name: quizName,
    quizId: uuid(),
    createdAt: new Date().toISOString(),
    type: 'quiz',
  };

  try {
    await db.put({
      TableName: TABLE_NAME,
      Item: item,
    });
    return;
  } catch (error) {
    throw error;
  }
};

const getAllQuiz = async () => {
  try {
    const { Items } = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'TypeIndex',
      KeyConditionExpression: '#typeAlias = :typeValue',
      ConditionAttributeNames: {
        '#typeAlias': 'type',
      },
      ConditionAttributeValues: {
        ':typeValue': 'quiz',
      },
    });

    return Items;
  } catch (error) {
    throw error;
  }
};

const getQuiz = async (username, quizId) => {
  try {
    const { Item } = await db.get({
      TableName: TABLE_NAME,
      Keys: {
        username: username,
        quizId: quizId,
      },
    });

    return Item;
  } catch (error) {
    throw error;
  }
};

const deleteQuiz = async (username, quizId) => {
  try {
    await db.delete({
      TableName: TABLE_NAME,
      Keys: {
        username: username,
        quizId: quizId,
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export { addQuiz, getAllQuiz, getQuiz, deleteQuiz };
