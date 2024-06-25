const mongoose = require("mongoose");

// Connection string with the database name specified (e.g., 'paytmDb')
const uri =
  "mongodb+srv://admin:admin%40123@cluster0.8wnnoy6.mongodb.net/" + "paytmDb";

const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  username: { type: String },
});

const accountSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true
  },
  balance: {
      type: Number,
      required: true
  }
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", accountSchema);

mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

module.exports = { User, Account};
