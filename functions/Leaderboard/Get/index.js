import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { getLeaderboard } from '../../../helpers/LeaderboardHelper.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;

      const items = await getLeaderboard(id);
      if (items && items.length) {
        items.sort((a, b) => b.score - a.score);
      }

      return sendResponse(200, items);
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
