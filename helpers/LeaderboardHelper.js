import db from '../services/db.js';

const TABLE_NAME = process.env.LEADERBOARD_TABLE;

const addLeaderboard = async (entity) => {
  const item = {
    username: entity.username,
    quizId: entity.quizId,
    createdAt: new Date().toISOString(),
    score: entity.score,
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

const getLeaderboard = async (quizId) => {
  try {
    const { Items } = await db.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId,
      },
    });
    return Items || [];
  } catch (error) {
    throw error;
  }
};

const getLeaderboardWithUsername = async (quizId, username) => {
  try {
    const { Item } = await db.get({
      TableName: TABLE_NAME,
      Key: {
        quizId: quizId,
        username: username,
      },
    });
    return Item;
  } catch (error) {
    throw error;
  }
};

export { getLeaderboard, addLeaderboard, getLeaderboardWithUsername };
