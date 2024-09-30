import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import { getQuiz } from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { optionalValidateToken } from '../../../middlewares/auth.js';

const handler = middy(middyTimeoutConfig)
  .use(optionalValidateToken)
  .handler(async (event) => {
    try {
      const { id, username } = event.pathParameters;

      if (!id || !username)
        return sendError(400, { error: 'Must put in valid pathParameters.' });

      const response = await getQuiz(username, id);
      if (!response) return sendError(404, { error: 'Quiz not found' });

      const shouldParseAnswers =
        event.username != response.username && response.questions.length > 0;
      console.log('event.username', event.username);
      console.log('response.username', response.username);
      console.log('shouldParseAnswers', shouldParseAnswers);
      const questions = shouldParseAnswers
        ? response.questions.map((q) => ({
            ...q,
            answer: '',
          }))
        : response.questions;

      return sendResponse(200, { ...response, questions: questions });
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
