const zod = require("zod");
const { User } = require("../db");

const userSignupZodSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const userSigninZodSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

function userSignupMiddleware(req, res, next) {
  const user = req.body;
  // Check if input data is valid
  const response = userSignupZodSchema.safeParse(user);
  if (!response.success) {
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }

  // Check if username already exist
  User.findOne({
    username: user.username,
  }).then(function (value) {
    if (value) {
      res.status(401).json({
        message: "Email already taken",
      });
    } else {
      next();
    }
  });
}

function userSigninMiddleware(req, res, next) {
  const user = req.body;
  // Check if input data is valid
  const response = userSigninZodSchema.safeParse(user);
  if (!response.success) {
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }

  // Check if username already exist
  User.find({
    username: user.username,
  }).then(function (value) {
    if (value) {
      next();
    } else {
      res.status(401).json({
        message: "User does not exist",
      });
    }
  });
}

module.exports = { userSignupMiddleware, userSigninMiddleware };
