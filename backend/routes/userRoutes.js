const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');


const JWT_SECRET = "your_jwt_secret"; // Ideally from environment variables

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// Signin Route
// Signin Route
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token, userId: user._id }); // added userId
  } catch (err) {
    res.status(500).json({ error: "Signin failed", details: err.message ,userId:user._id });
  }
});


// Update User Info
router.put("/updateUserInfo", async (req, res) => {
  const { username, updateFields } = req.body;
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { username },
      { $set: updateFields },
      { new: true }
    );
    res.status(200).json({ message: "User info updated", updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

// Delete User
router.delete("/deleteUser", async (req, res) => {
  const { username } = req.body;
  try {
    await userModel.findOneAndDelete({ username });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});
router.patch("/done/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: { done: req.body.done } },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to update done status", details: err.message });
  }
});


module.exports = router;
