const User = require("../models/User");
const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (Admin only)
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    if (role === "teacher") {
      await Teacher.create({
        userId: user._id,
        teacherId: "TCH-" + Date.now()
      });
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Middleware to get user from token ====================
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ==================== GET MY PROFILE ====================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== UPDATE MY PROFILE ====================
exports.updateMe = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const updateData = { fullName, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== DELETE MY ACCOUNT ====================
exports.deleteMe = async (req, res) => {
  try {
    // delete related teacher record if exists
    await Teacher.findOneAndDelete({ userId: req.user.id });

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== LOGOUT WITH PASSWORD ====================
exports.logoutWithPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Backend ahaan logout wax token ah ma tirayno (frontend ayaa tiraya)
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
