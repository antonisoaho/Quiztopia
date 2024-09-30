import { v4 as uuid } from 'uuid';
import db from '../services/db.js';
import { sendError } from '../services/responses.js';

const TABLE_NAME = process.env.QUIZ_TABLE;

const addQuiz = async (username, quizName) => {
  const quizId = uuid();
  const item = {
    username: username,
    name: quizName,
    quizId: quizId,
    createdAt: new Date().toISOString(),
    type: 'quiz',
    questions: [],
  };

  try {
    await db.put({
      TableName: TABLE_NAME,
      Item: item,
    });
    return item;
  } catch (error) {
    throw error;
  }
};

const getAllQuiz = async () => {
  try {
    const { Items } = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'typeIndex',
      KeyConditionExpression: '#typeAlias = :typeValue',
      ExpressionAttributeNames: {
        '#typeAlias': 'type',
      },
      ExpressionAttributeValues: {
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
      Key: {
        username: username,
        quizId: quizId,
      },
    });

    return Item;
  } catch (error) {
    throw error;
  }
};

const getQuizQuestions = async (username, quizId) => {
  try {
    console.log('getQuizQuestions');
    const Item = await getQuiz(username, quizId);
    if (!Item) return sendError(404, { error: 'Quiz not found' });
    return Item.questions || [];
  } catch (error) {
    throw error;
  }
};

const deleteQuiz = async (username, quizId) => {
  try {
    console.log('deleteQuiz');

    await db.delete({
      TableName: TABLE_NAME,
      Key: {
        username: username,
        quizId: quizId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};

const addQuestionToQuiz = async (questions, username, quizId) => {
  try {
    console.log('addQuestionToQuiz');

    await db.update({
      TableName: TABLE_NAME,
      Key: {
        username: username,
        quizId: quizId,
      },
      UpdateExpression: 'set questions = :questions',
      ExpressionAttributeValues: {
        ':questions': questions,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};

export {
  addQuiz,
  getAllQuiz,
  getQuiz,
  deleteQuiz,
  getQuizQuestions,
  addQuestionToQuiz,
};
