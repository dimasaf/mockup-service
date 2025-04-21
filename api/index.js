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

const generateTableData = (pageNumber, pageSize, search) => {
  const totalPages = Math.ceil(totalElements / pageSize);
  const startId = (pageNumber - 1) * pageSize + 1;
  let dataTransaction = Array.from({ length: pageSize }, (_, index) => {
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

  if (search) {
    const lowerSearch = search.toLowerCase();
    dataTransaction = dataTransaction.filter((transaction) =>
      Object.values(transaction).some((value) =>
        value.toLowerCase().includes(lowerSearch)
      )
    );
  }

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

const failCounts = {};

router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;

    await delay(150);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (username === "admin") {
      failCounts[username] = 0;

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
          failCount: 0,
        })
      );
    }

    if (username === "user") {
      return res.status(200).json(createApiResponse("02", "Already Login"));
    }

    failCounts[username] = (failCounts[username] || 0) + 1;

    return res.status(200).json(
      createApiResponse("03", "Invalid Credential", {
        failCount: failCounts[username],
      })
    );
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json(createApiResponse("99", "Internal Server Error"));
  }
});

router.post("/table-example", async (req, res) => {
  try {
    const { pageNumber, pageSize, search } = req.body;

    await delay(150);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (
      (pageSize === 25 && pageNumber > 3) ||
      (pageSize === 10 && pageNumber > 4) ||
      (pageSize === 5 && pageNumber > 8)
    ) {
      return res.status(200).json(createApiResponse("02", "NO DATA FOUND"));
    }

    return res
      .status(200)
      .json(generateTableData(pageNumber, pageSize, search));
  } catch (error) {
    console.error("example Error:", error);
    return res
      .status(500)
      .json(createApiResponse("99", "Internal Server Error"));
  }
});

router.post("/menu-navigation", async (req, res) => {
  try {
    await delay(550);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    return res.status(200).json(
      createApiResponse("00", "Fetch Success", {
        menuId: [
          0, 3, 1, 11, 111, 112, 113, 12, 121, 2, 21, 211, 212, 214, 215, 22,
          221, 222, 4,
        ],
      })
    );
  } catch (error) {
    console.error("example Error:", error);
    return res
      .status(500)
      .json(createApiResponse("99", "Internal Server Error"));
  }
});

module.exports = router;
