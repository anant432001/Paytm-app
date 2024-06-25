// backend/routes/account.js
const express = require("express");
const mongoose = require("mongoose");
const {
  getAuthMiddleware,
  amountTransferMiddleware,
} = require("../middleware/middleware");
const { Account } = require("../db");
const router = express.Router();

router.get("/balance", getAuthMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const accountHolder = await Account.findOne({
      userId: userId,
    });
    res.status(200).json({
      balance: accountHolder.balance,
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while loading information",
    });
  }
});

router.post(
  "/transfer",
  getAuthMiddleware,
  amountTransferMiddleware,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { amount, to } = req.body;

      // Fetch the accounts within the transaction
      const fromAccount = await Account.findOne({ userId: req.userId }).session(
        session
      );
      if (!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
          message: "Insufficient balance",
        });
        return;
      }

      const toAccount = await Account.findOne({ userId: to }).session(session);
      if (!toAccount) {
        await session.abortTransaction();
        res.status(400).json({
          message: "Invalid account",
        });
        return;
      }

      // Perform the transfer
      await Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
      ).session(session);

      await Account.updateOne(
        { userId: to },
        { $inc: { balance: amount } }
      ).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Transfer successful",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({
        message: "Transfer failed",
      });
    }
  }
);

module.exports = router;
