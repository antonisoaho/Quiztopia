export const middyTimeoutConfig = {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408,
    };
  },
};
