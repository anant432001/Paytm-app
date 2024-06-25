const jwt = require("jsonwebtoken");
const zod = require("zod");
const JWT_SECRET = require("../config");

const userUpdateZodSchema = zod.object({
  username: zod.string().email().optional(),
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

const transferZodSchema = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

const authMiddleware = (req, res, next) => {
  // Check if input data is valid
  const response = userUpdateZodSchema.safeParse(req.body);
  if (!response.success) {
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }

  // Check if user is authorized
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Token does not start with Bearer",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);
    if (decodedValue.userId) {
      req.userId = decodedValue.userId;
      next();
    }
  } catch (err) {
    return res.status(403).json({
      message: "Token cannot be verified here",
    });
  }
};

const getAuthMiddleware = (req, res, next) => {
  console.log("Hello ji");
  // Check if user is authorized
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Token does not start with Bearer",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("token: " + token);
  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);
    if (decodedValue.userId) {
      req.userId = decodedValue.userId;
      next();
    }
  } catch (err) {
    return res.status(403).json({
      message: "Token cannot be verified here",
    });
  }
};

const amountTransferMiddleware = (req, res, next) => {
  // Check if input data is valid
  const response = transferZodSchema.safeParse(req.body);
  if (!response.success) {
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }
  next();
};

module.exports = {
  authMiddleware,
  getAuthMiddleware,
  amountTransferMiddleware
};
