import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { AddLeaderboardRequest } from '../../../models/AddLeaderboardRequest.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { getQuizQuestions } from '../../../helpers/QuizHelper.js';
import { getUser } from '../../../helpers/UsersHelper.js';
import {
  addLeaderboard,
  getLeaderboardWithUsername,
} from '../../../helpers/LeaderboardHelper.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .use(requestBodyValidator(AddLeaderboardRequest))
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;
      const { score, quizTaker } = JSON.parse(event.body);

      const [user, questions, existingLeaderboardInput] = await Promise.all([
        getUser(quizTaker),
        getQuizQuestions(event.username, id),
        getLeaderboardWithUsername(id, quizTaker),
      ]);

      if (!user) return sendError(404, { error: 'User not found' });
      if (!questions.length)
        return sendError(401, {
          error: 'Can only handle scores for your own Quiz.',
        });
      if (existingLeaderboardInput)
        return sendError(409, {
          error: `${quizTaker} already registered on quizId: ${id}`,
          Item: existingLeaderboardInput,
        });

      const maxPoints = questions.length;
      if (score > maxPoints)
        return sendError(400, {
          error: 'Cannot give more points then amount of questions.',
        });

      const Item = {
        username: quizTaker,
        score: score,
        quizId: id,
      };

      await addLeaderboard(Item);

      return sendResponse(201, Item);
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
