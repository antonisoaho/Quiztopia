import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { getLeaderboard } from '../../../helpers/LeaderboardHelper.js';
import { uuidValidator } from '../../../middlewares/uuidValidator.js';

const handler = middy(middyTimeoutConfig)
  .use(uuidValidator)
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
