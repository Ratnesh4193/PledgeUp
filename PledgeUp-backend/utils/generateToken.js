import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const JWT_SECRET = "pledgeup" || process.env.JWT_SECRET;
  const expirationTime = 60 * 60; // 1 hour in seconds
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  const payload = {
    id,
    iat: currentTime, // Issued at time
    exp: currentTime + expirationTime, // Expiration time
  };

  return jwt.sign(payload, JWT_SECRET);
};

export default generateToken;
