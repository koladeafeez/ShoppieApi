const JWT_SECRET_KEY = require("../utility/config");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (request, response, nextHandler) => {
  if (!request.headers.authorization)
    response.status(400).send("Not Authourized");
  const accessToken = await request.headers.authorization.split(" ")[1];
  console.log(request);

  try {
    const tokenPayload = jwt.verify(accessToken, JWT_SECRET_KEY.secret);
    console.log(tokenPayload);
    response.locals.user = tokenPayload;
    nextHandler();
  } catch (error) {
    response.status(401).send(error.message);
  }
};

module.exports = authenticationMiddleware;
