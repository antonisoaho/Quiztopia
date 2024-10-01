import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { AddLeaderboardRequest } from '../../../models/AddLeaderboardRequest.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { getQuiz } from '../../../helpers/QuizHelper.js';
import { getUser } from '../../../helpers/UsersHelper.js';
import {
  addLeaderboard,
  getLeaderboardWithUsername,
} from '../../../helpers/LeaderboardHelper.js';
import { uuidValidator } from '../../../middlewares/uuidValidator.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .use(uuidValidator)
  .use(requestBodyValidator(AddLeaderboardRequest))
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;
      const { score, quizTaker } = JSON.parse(event.body);

      const [user, quiz, existingLeaderboardInput] = await Promise.all([
        getUser(quizTaker),
        getQuiz(id),
        getLeaderboardWithUsername(id, quizTaker),
      ]);

      if (!user)
        return sendError(404, {
          error: 'Cant put it score for a user whom not exists.',
        });
      if (quiz.username != event.username)
        return sendError(401, {
          error: 'Can only handle scores for your own Quiz.',
        });
      if (existingLeaderboardInput)
        return sendError(400, {
          error: `${quizTaker} already registered on quizId: ${id}`,
          Item: existingLeaderboardInput,
        });

      const maxPoints = quiz.questions.length;
      if (score > maxPoints)
        return sendError(400, {
          error: `You tried to give a score of ${score}, but ${quiz.questions.length} is the max amount.`,
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
