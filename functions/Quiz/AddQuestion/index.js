import middy from '@middy/core';
import { validateToken } from '../../../middlewares/auth.js';
import { sendResponse, sendError } from '../../../services/responses.js';
import {
  addQuestionToQuiz,
  getQuiz,
  getQuizQuestions,
} from '../../../helpers/QuizHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { AddQuestionRequest } from '../../../models/AddQuestionRequest.js';

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .use(requestBodyValidator(AddQuestionRequest))
  .handler(async (event) => {
    const { id } = event.pathParameters;
    const { username } = event;
    const body = JSON.parse(event.body);

    if (!id)
      return sendError(400, { error: 'Must put in valid pathParameters.' });

    const newItem = {
      question: body.question,
      answer: body.answer,
      location: {
        ...body.location,
      },
    };
    try {
      const quiz = await getQuiz(id);

      if (quiz.username != username)
        return sendError(401, {
          error: 'Cant add questions to someone elses quiz.',
        });

      const questionExists = quiz.questions.length
        ? quiz.questions.some(
            (q) => q.question === newItem.question && q.answer == newItem.answer
          )
        : undefined;

      if (questionExists)
        return sendError(400, { error: 'Question already exists.' });

      const questions = [...quiz.questions, newItem];

      await addQuestionToQuiz(questions, id);

      return sendResponse(201, { data: newItem });
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
