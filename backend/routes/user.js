const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { User, Account } = require("../db.js");
const {
  userSignupMiddleware,
  userSigninMiddleware,
} = require("../middleware/user");
const {
  authMiddleware,
  getAuthMiddleware,
} = require("../middleware/middleware.js");

router.post("/signup", userSignupMiddleware, async (req, res) => {
  const user = req.body;
  try {
    const newUser = await User.create({
      username: user.username,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    await Account.create({
      userId: newUser._id,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(200).json({
      message: "User created successfully",
      token: token,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: newUser._id
    });
  } catch (error) {
    res.status(401).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
});

router.post("/signin", userSigninMiddleware, async (req, res) => {
  const user = req.body;
  try {
    await User.findOne({
      username: user.username,
      password: user.password,
    }).then(function (newUser) {
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
      res.status(200).json({
        message: "User signin successfull",
        token: token,
        username: user.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userId: newUser._id
      });
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
});

router.put("/", (uId = authMiddleware), async (req, res) => {
  try {
    await User.updateOne({ _id: req.userId }, req.body).then(function () {
      res.status(200).json({
        message: "Update successful",
      });
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
});

router.get("/bulk", getAuthMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  try {
    let users;
    if (filter) {
      users = await User.find({
        $or: [
          { firstName: { $regex: filter, $options: "i" } }, // Case insensitive search
          { lastName: { $regex: filter, $options: "i" } },
        ],
      });
    } else users = await User.find({});

    res.status(200).json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while loading information",
    });
  }
});

module.exports = router;
