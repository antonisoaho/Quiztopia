import 'module-alias/register';
import { sendResponse, sendError } from '@services/responses';
import { getUser, addUser, hashPassword } from '@helpers/UsersHelper';

const handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  try {
    const existingUser = await getUser();
    if (existingUser)
      return sendError(400, { error: 'username already exists' });

    const hashedPassword = await hashPassword(password);
    const item = { username, password: hashedPassword };

    await addUser(item);

    return sendResponse(200, { success: true });
  } catch (error) {
    return sendError(500, { error: error.message });
  }
};

export { handler };
