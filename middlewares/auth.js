const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Ensure you have a config file that exports JWT_SECRET
const handleAuthError = (res) => {
  return res.status(401).send({ message: "Authorization required" });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err); // for debugging purposes
    /**
     * If the token is invalid or expired, it will throw an error.
     * We catch it and return a 401 Unauthorized status.
     */
    // Ensure JWT_SECRET is defined in your environment

    return handleAuthError(res);
  }

  req.user = payload; // adding the payload to the Request object

  next(); // passing the request further along
};
