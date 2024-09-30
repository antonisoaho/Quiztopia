import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import { getAllQuiz } from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';

const handler = middy(middyTimeoutConfig).handler(async (event) => {
  try {
    const response = await getAllQuiz();

    return sendResponse(200, response);
  } catch (error) {
    return sendError(500, { error: error.message });
  }
});

export { handler };
