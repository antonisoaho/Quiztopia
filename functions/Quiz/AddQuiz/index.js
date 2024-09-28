import middy from '@middy/core';
import { validateToken } from '../../../../middlewares/auth';
import { sendResponse, sendError } from '../../../../services/responses';

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    console.log('event', event);

    return sendResponse(200, 'svar');
  });

export { handler };
