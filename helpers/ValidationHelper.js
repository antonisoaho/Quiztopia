import { sendError } from '../services/responses.js';

const validate = (obj, schema) => {
  for (const key in schema) {
    const expectedType = schema[key];
    const value = obj[key];

    if (value === undefined) return `Missing key: ${key}`;

    if (typeof expectedType === 'object') {
      if (typeof value !== 'object' || value === null)
        return `Key "${key}" should be an object`;

      const nestedValidation = validate(value, expectedType);
      if (nestedValidation !== true) {
        return nestedValidation;
      }
    } else if (typeof value !== expectedType) {
      return `Key "${key}" should be of type ${expectedType}, but got ${typeof value}`;
    }
  }

  for (const key in obj) {
    if (!(key in schema)) {
      return `Unexpected key: ${key}`;
    }
  }

  return true;
};

const requestBodyValidator = (schema) => {
  return {
    before: (handler) => {
      const obj = JSON.parse(handler.event.body);
      const isValid = validate(obj, schema);

      if (isValid != true) return sendError(400, { error: isValid });
    },
  };
};

export { requestBodyValidator };
