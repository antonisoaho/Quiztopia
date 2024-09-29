import 'module-alias/register';
import { sendResponse, sendError } from '@services/responses';
import signToken from '@services/jwt';
import { getUser, comparePassword } from '@helpers/UsersHelper';

const handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const user = await getUser(username);

  const isMatch = await comparePassword(password, user);
  if (!isMatch) return sendError(401, 'Wrong username or password');

  const token = signToken(user);

  return sendResponse({ success: true, token });
};

export { handler };
