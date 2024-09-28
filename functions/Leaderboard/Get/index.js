import { sendResponse, sendError } from '../../../../services/responses';

const handler = async (event) => {
  console.log('event', event);

  return sendResponse(200, 'svar');
};

export { handler };
