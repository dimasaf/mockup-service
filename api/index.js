const express = require("express");
const router = express.Router();

const delay = (ms) =>
  new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      clearTimeout(timeout); // Explicit cleanup
    }, ms);
  });

const createApiResponse = (code, message, result = null) => ({
  activityRefCode: "ACT123456",
  codeSystem: "SYSTEM_CODE",
  message,
  code,
  result,
});

router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;

    await delay(150);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (username === "admin") {
      return res.status(200).json(
        createApiResponse("00", "Login successful", {
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
        })
      );
    }

    if (username === "user") {
      return res.status(200).json(createApiResponse("02", "Already Login"));
    }

    return res.status(200).json(createApiResponse("03", "Invalid Credential"));
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json(createApiResponse("99", "Internal Server Error"));
  }
});

module.exports = router;
