const express = require("express");
const {
  createUser,
  createAdmin,
  login,
  getMe,
  getUsers,
  getUser,
  updateUser,
  updateProfile,
  deleteUser,
  forgotPassword,
  changePassword,
  resetPassword,
  newPassword,
  uploadPhoto,
  getTotalUsers
} = require("../controllers/user");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/user/create").post(createUser)
router.route("/user").get(advancedResults(User), getUsers);
router.route("/admin/create").post(protect, authorize("SuperAdmin"), createAdmin)
router.route("/:id").delete(protect, authorize("SuperAdmin", "Admin"), deleteUser);
router.route("/:id/photo").put(protect, uploadPhoto);
// .get(protect, getUser)
// .patch(protect, updateUser);

router.route("/login").post(login);

router.route("/me").get(protect, getMe).put(protect, updateProfile);
router.route("/GetRegisteredUser").get(protect, authorize("Admin"), getTotalUsers)
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/newpassword", protect, newPassword);

router.get("/:id", protect, getUser); // get user details by id
router.patch("/:id", protect, updateUser); // update user details by id
router.put('/changepassword', protect, changePassword);
module.exports = router;
