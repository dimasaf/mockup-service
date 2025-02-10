const express = require("express");
const router = express.Router();

const delay = (ms) =>
  new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      clearTimeout(timeout); // Explicit cleanup
    }, ms);
  });

const totalElements = 40;

const generateTableData = (pageNumber, pageSize) => {
  const totalPages = Math.ceil(totalElements / pageSize);
  const startId = (pageNumber - 1) * pageSize + 1;
  const dataTransaction = Array.from({ length: pageSize }, (_, index) => {
    const idNum = startId + index;
    return {
      id: idNum.toString().padStart(16, "0"),
      date: `2${(idNum % 30) + 1} Okt 2024`,
      type: idNum % 2 === 0 ? "Single Transfer" : "Bulk Transfer",
      sourceAccount: idNum % 2 === 0 ? "BRI Optimal" : "BNI Flexi",
      reference: (idNum - 2).toString().padStart(16, "0"),
      destinationAccount:
        idNum % 2 === 0 ? "PT GHJ Jakarta" : "PT XYZ Surabaya",
      bank: idNum % 2 === 0 ? "Bank Syariah Indonesia" : "Bank Mandiri",
      currency: idNum % 2 === 0 ? "IDR" : "USD",
      amount: idNum % 2 === 0 ? "5.000.000,00" : "2.500,00",
    };
  });

  return createApiResponse("00", "Success Retrieve Data", {
    pageNumber,
    pageSize,
    totalPages,
    totalElements,
    dataTransaction,
  });
};

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

router.post("/table-example", async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.body;

    await delay(150);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (pageSize > 40 || pageNumber > 2) {
      return res.status(200).json(createApiResponse("02", "NO DATA FOUND"));
    }

    return res.status(200).json(generateTableData(pageNumber, pageSize));
  } catch (error) {
    console.error("example Error:", error);
    return res
      .status(500)
      .json(createApiResponse("99", "Internal Server Error"));
  }
});

module.exports = router;
