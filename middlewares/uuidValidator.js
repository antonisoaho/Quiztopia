import { validate } from 'uuid';

export const uuidValidator = {
  before: (request) => {
    const { id } = request.event.pathParameters;
    if (!validate(id))
      return sendError(400, {
        error: `Need correct format in path, current: ${id}`,
      });

    return request.response;
  },
};
