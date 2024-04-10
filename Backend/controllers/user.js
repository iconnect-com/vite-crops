const path = require("path");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const azure = require("azure-storage");
const { BlobServiceClient } = require("@azure/storage-blob");

// @desc    Create User/
// @route   POST/api/v1/auth/create
// @access   Public
exports.createUser = asyncHandler(async (req, res, next) => {
  await User.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// @desc    Get All User
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create Admin
// @route   POST /api/v1/auth/admin/create
// @access  Private (accessible only to super admin)

exports.createAdmin = asyncHandler(async (req, res, next) => {
  // Check if the user making the request is a super admin
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  try {
    const { email, fullname } = req.body;

    // Check if the email and fullName are provided
    if (!email || !fullname) {
      return res
        .status(400)
        .json({ success: false, error: "Email and fullname are required" });
    }

    // Check if the email is already in use
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, error: "Email is already in use" });
    }

    // Check if the fullName is already in use
    const existingFullname = await User.findOne({ fullname });
    if (existingFullname) {
      return res
        .status(400)
        .json({ success: false, error: "Full name is already in use" });
    }

    // Generate a random password
    const generatedPassword = crypto.randomBytes(4).toString("hex"); // Generates a 8-character random hexadecimal string

    // Create the admin user with email, fullName, and generated password
    const admin = await User.create({
      email,
      fullname,
      password: generatedPassword,
      role: "Admin",
    });

    //Get reset token
  const resetToken = admin.getResetPasswordToken();
  await admin.save({ validateBeforeSave: false });
    // Send the generated password to the admin's email
    const resetUrl = `${req.protocol}://cvd-backend.azurewebsites.net/resetpassword/${resetToken}`;
      
    if (admin) {
      const message = `
        <p>Hi ${fullname},</p>
        <p>Welcome to Commodity Virtual Dashboard application! You have been successfully registered.</p>
        <p>Feel free to explore and enjoy our services.</p>
        <p>Your default password to log in is "${generatedPassword}".</p>
        <p>We strongly advise changing your password immediately after the initial login for enhanced security.</p>
        <br />
       ${resetUrl}
        <p>Regards,</p>
        <p>Your Application Team</p>`;     
       
        await admin.save({ validateBeforeSave: false }); 
      await sendEmail({
        email: email,
        subject: "Account Created",
        content: message,
      });
    }

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    // Handle any errors that occur during admin creation
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      error: "Could not create admin",
    });
  }
});

// @desc    Get user by Id
// @route   GET/api/v1/auth/:id
// @access   Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Update user by Id
// @route   PATCH/api/v1/auth/:id
// @access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Login User
// @route   POST/api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an email and password", 400));
  }
  //check for user
  const user = await User.findOne({ email: email }).select("+password");

  if (user?.loginAttempts?.length >= 5) {
    return next(
      new ErrorResponse(
        "Sorry your account has been locked, kindly contact your administrator",
        401
      )
    );
  }

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const date = new Date();
    const attempts = user?.loginAttempts;
    attempts.push(date);
    await User.findByIdAndUpdate(
      user._id,
      { loginAttempts: attempts },
      {
        new: true,
        runValidators: true,
      }
    );
    if (attempts.length === 1) {
      return next(
        new ErrorResponse("Invalid credentials, 4 Attempts left", 401)
      );
    }
    if (attempts.length === 2) {
      return next(
        new ErrorResponse("Invalid credentials, 3 Attempts left", 401)
      );
    }
    if (attempts.length === 3) {
      return next(
        new ErrorResponse("Invalid credentials, 2 Attempts left", 401)
      );
    }
    if (attempts.length === 4) {
      return next(
        new ErrorResponse("Invalid credentials, 1 Attempts left", 401)
      );
    }
    if (attempts.length >= 5) {
      return next(
        new ErrorResponse(
          "Sorry your account has been locked, kindly contact your administrator",
          401
        )
      );
    }
  }

  if (user.invited === true) {
    sendInvitedResponse(user, 200, res);
  } else {
    const attempts = user?.loginAttempts;
    if (attempts.length > 0) {
      await User.findByIdAndUpdate(
        user._id,
        { loginAttempts: [] },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    sendTokenResponse(user, 200, res);
  }
});

// @desc    Log user out / clear cookie
// @route  GET /api/v1/auth/logout
// @access   Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   POST/api/v1/auth/me
// @access   Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data,
  });
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//Get token from model, create cookie and send response
const sendInvitedResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    invited: true,
    token,
  });
};

// @desc    Update Admin Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Reset Password
// @route   PUT/api/v1/auth/resetpassword/:resettoken
// @access   Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }
  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Reset Password
// @route   PUT/api/v1/auth/resetpassword/:resettoken
// @access   Public

exports.newPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse("User not ƒound", 404));
  }
  // set new password
  user.password = req.body.password;
  user.invited = false;
  await user.save();

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get("host")}/app/profile`;

  const message = `<h1>Hi ${user.firstname}, </h1>
  <p> Your Password was reset was successful</p>
<p>Click on the button below to update your profile</p>
   <br />
 <a href="${resetUrl}" style="padding:1rem;color:black;background:#ff4e02;border-radius:5px;text-decoration:none;">Reset Password</a>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset successful",
      content: message,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Forgot Password
// @route   POST/api/v1/auth/forgotpassword
// @access   Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://cvd-backend.azurewebsites.net/resetpassword/${resetToken}`;

  const message = `<h1>Hi ${user.fullname}, </h1>
  <p> You are receiving this email because you (or someone else) has requested
the reset of a password</p>
<p>Click on the button below to reset your password</p>
   <br />
 ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      content: message,
    });
    res
      .status(200)
      .json({ success: true, message: "Email Sent", data: resetToken });
  } catch (err) {
    console.log(err);
    user.getResetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});


// Controller function to get the total number of users
exports.getTotalUsers = asyncHandler(async (req, res, next) => {
  // Query the database for all users
  const totalUsers = await User.find({ role: "User" });

  // Send the total count of users in the response
  res.status(200).json({
    success: true,
    totalUsers: totalUsers,
  });
});



// @desc    Upload photo for user
// @route   PUT /api/User/:id/photo
// @access  Public
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  try {
    // Check if req.user is null or req.user.id is null
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, error: "User information missing or invalid" });
    }

    const blobService = azure.createBlobService(
      process.env.CONTAINER_NAME,
      process.env.CONTAINER_KEY,
    );

    const containerName = "marketplace";
    const originalBlobName = req.files.photo.name;
    const blobName = originalBlobName.replace(/\s+/g, '-'); // Replace spaces with dashes
    const stream = blobService.createWriteStreamToBlockBlob(
      containerName,
      blobName
    );

    stream.on("error", (error) => {
      console.error("Upload error:", error);
      throw new Error("Error uploading photo"); // Throw error to be caught by the catch block
    });

    stream.on("finish", () => {
      console.log("Upload completed");
      //res.send("Upload successful"); // Send the response only once here
    });
    stream.end(req.files.photo.data);
    req.body.photo = `https://osstoragelban.blob.core.windows.net/marketplace/${blobName}`;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.photo = req.body.photo;
    await user.save();

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// @desc      Change password
// @route     PUT /api/v1/auth/changepassword
// @access    Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});