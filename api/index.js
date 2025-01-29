const express = require("express");
const router = express.Router(); // Use a router for modular routes

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createApiResponse = (code, message, result = null) => ({
  activityRefCode: "ACT123456",
  codeSystem: "SYSTEM_CODE",
  message,
  code,
  result,
});

// Mock login service
router.post("/login", async (req, res, next) => {
  try {
    const { username } = req.body;

    await delay(300);

    if (username === "admin") {
      const result = {
        token: "adminToken123",
        userMenu: ["dashboard", "settings"],
        userRole: "admin",
        refreshToken: "refreshAdminToken123",
        name: "Admin User",
        email: "admin@example.com",
        corporateMasterProfileCode: "CORP_ADMIN",
        corporateUserProfileCode: "USER_ADMIN",
        statusLogin: 1,
        otpType: "email",
        isSuperAdmin: true,
        userCorporateId: 1,
        transferBeneficiaryType: "corporate",
      };

      return res
        .status(200)
        .json(createApiResponse("00", "Login successful", result));
    } else if (username === "user") {
      return res.status(200).json(createApiResponse("02", "Already Login"));
    } else {
      return res
        .status(200)
        .json(createApiResponse("03", "Invalid Credential"));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
