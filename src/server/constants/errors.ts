const errors = {
  badRequest: {
    message: "Bad Request: Request has wrong format.",
    statusCode: 400,
    publicMessage: "Bad Request: Request has wrong format.",
  },
  unauthorized: {
    message: "Unauthorized: User or password not found.",
    statusCode: 401,
    publicMessage: "Unauthorized: User or password not found.",
    wrongCredentialsMessage: "Unauthorized: Wrong credentials.",
    authHeaderMissing: "Authorization header missing",
    authBearerMissing: "Missing bearer in Authorization header",
    authInvalidToken: "Invalid token",
  },
  forbidden: {
    message: "Forbidden: You're missing permission to execute this request.",
    statusCode: 403,
    publicMessage:
      "Forbidden: You're missing permission to execute this request.",
  },
  notFound: {
    message: "Not Found: End point or path not found.",
    statusCode: 404,
    publicMessage: "Not Found: End point or path not found.",
  },
  serverError: {
    message: "Internal Server Error: Something went wrong.",
    statusCode: 500,
    publicMessage: "Internal Server Error: Something went wrong.",
    startingServerMessage: "Error on starting the server.",
    gamesMessage: "Internal Server Error: Couldn't retrieve games.",
    databaseMessage: "Error while connecting to data base.",
  },
  otherErrors: {
    eaddrinuse: "EADDRINUSE",
  },
};
export default errors;
