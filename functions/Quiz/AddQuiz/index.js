import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { AddQuizRequest } from '../../../models/AddQuizRequest.js';
import { addQuiz } from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .use(requestBodyValidator(AddQuizRequest))
  .handler(async (event) => {
    try {
      console.log('event', event);
      const body = JSON.parse(event.body);
      const item = await addQuiz(event.username, body.name);

      return sendResponse(201, item);
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
