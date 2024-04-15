const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

module.exports = {
  generateAccessToken,
};
