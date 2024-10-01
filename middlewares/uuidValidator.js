import { validate } from 'uuid';
import { sendError } from '../services/responses.js';

export const uuidValidator = {
  before: (request) => {
    try {
      const { id } = request.event.pathParameters;
      if (!id) throw new Error('Could not find ID in parameter');

      if (!validate(id))
        return sendError(400, {
          error: `Need correct format in path, current: ${id}`,
        });

      return request.response;
    } catch (error) {
      return sendError(400, { error: error.message });
    }
  },
};
