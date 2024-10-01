import middy from '@middy/core';
import { sendResponse, sendError } from '../../../services/responses.js';
import { getUser, comparePassword } from '../../../helpers/UsersHelper.js';
import { UserRequest } from '../../../models/UserRequest.js';
import { requestBodyValidator } from '../../../helpers/ValidationHelper.js';
import { signToken } from '../../../services/jwt.js';
import { middyTimeoutConfig } from '../../../services/middy.js';

const handler = middy(middyTimeoutConfig)
  .use(requestBodyValidator(UserRequest))
  .handler(async (event) => {
    const { username, password } = JSON.parse(event.body);

    const user = await getUser(username);
    if (!user) return sendError(404, { error: 'User not found' });
    const isMatch = await comparePassword(user.password, password);
    if (!isMatch)
      return sendError(401, { error: 'Wrong username or password' });

    const token = signToken(user.username);
    console.log('token', token);
    return sendResponse(200, {
      success: true,
      token: token,
      username: username,
    });
  });

export { handler };
