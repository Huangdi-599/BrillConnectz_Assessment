const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Typically, the token is sent in the authorization header
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Assuming the token is sent as "Bearer <token>"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRETKEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user; // Add the user payload to the request
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = verifyToken;
