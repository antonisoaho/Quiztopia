import { validate } from 'uuid';

export const uuidValidator = {
  before: (request) => {
    try {
      const { id } = request.event.pathParameters;
      if (!validate(id))
        return sendError(400, {
          error: `Need correct format in path, current: ${id}`,
        });

      return request.response;
    } catch (error) {
      return sendResponse(400, { error: 'Could not find ID in parameter' });
    }
  },
};
