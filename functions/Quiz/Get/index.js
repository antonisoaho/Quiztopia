import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import { getQuiz } from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { optionalValidateToken } from '../../../middlewares/auth.js';
import { uuidValidator } from '../../../middlewares/uuidValidator.js';

const handler = middy(middyTimeoutConfig)
  .use(optionalValidateToken)
  .use(uuidValidator)
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;

      const response = await getQuiz(id);
      if (!response) return sendError(404, { error: 'Quiz not found' });

      const shouldParseAnswers =
        event.username != response.username && response.questions.length > 0;
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
