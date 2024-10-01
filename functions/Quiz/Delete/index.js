import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import { deleteQuiz, getQuiz } from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;
      const username = event.username;

      const Item = await getQuiz(id);
      if (!Item) throw new Error('Could not find quiz');

      if (Item.username != username)
        return sendResponse(404, 'Quiz with relation to your user not found');

      await deleteQuiz(id);
      return sendResponse(204, '');
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
