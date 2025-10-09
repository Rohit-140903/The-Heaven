const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.SALT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;

// how jwt verifies a token:

// 1  Split aaa.bbb.ccc	Identify header, payload, signature
// 2	Recalculate expectedSignature	Using same algorithm + secret key
// 3	Compare with ccc	Detect tampering or forgery
// 4	Decode payload (if valid)	Extract user info, expiry, etc.
