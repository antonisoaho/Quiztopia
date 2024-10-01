import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import {
  getUser,
  addUser,
  hashPassword,
} from '../../../helpers/UsersHelper.js';
import { UserRequest } from '../../../models/UserRequest.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { middyTimeoutConfig } from '../../../services/middy.js';

const handler = middy(middyTimeoutConfig)
  .use(requestBodyValidator(UserRequest))
  .handler(async (event) => {
    const { username, password } = JSON.parse(event.body);
    console.log('username, password', username, password);
    try {
      const [existingUser, hashedPassword] = await Promise.all([
        getUser(username),
        hashPassword(password),
      ]);

      if (existingUser)
        return sendError(400, { error: 'username already exists' });

      const item = { username, password: hashedPassword };
      await addUser(item);

      return sendResponse(200, { success: true });
    } catch (error) {
      return sendError(500, { error: error.message });
    }
  });

export { handler };
