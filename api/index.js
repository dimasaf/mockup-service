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

  return createSuccessResponse({
    pageNumber,
    pageSize,
    totalPages,
    totalElements,
    dataTransaction,
  });
};

const createSuccessResponse = (result = {}) => ({
  result,
});

const createGeneralErrorResponse = (errorGeneral = {}) => errorGeneral;
const createMappedErrorResponse = (code, codeSystem, errorMapped = {}) => ({
  code,
  codeSystem,
  result: errorMapped,
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
      res.set(
        "token",
        "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjpbIlJPTEVfQVBQUk9WRSJdLCJzZXNzaW9uX2tleSI6IklCfDEiLCJ1c2VyIjoiVmljdG9yaWEwMSIsInVzZXJfcHJvZmlsZV9pZCI6MSwidXNlcm5hbWUiOiJWaWN0b3JpYTAxIiwiY2hhbm5lbENvZGUiOiJJQiIsImV4cCI6MTc0NzM4NDg3N30.RIqJsSGH4BO4TNZvCk8UrAexN8EYr6GeMNsMKa_6cp5EGuVec8Jl3fDx6b7AGQ2CWuta5L-JlyD5sO82RpXidg"
      );

      return res.status(200).json(
        createSuccessResponse({
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
      return res.status(400).json(
        createGeneralErrorResponse({
          code: "0020",
          codeSystem: "BSI-XPAN",
          message: "dlkajjdal Server Error",
          activityRefCode: "456d9314-cf4e-4fe1-a256-8ffcf51b2c99",
        })
      );
    }

    failCounts[username] = (failCounts[username] || 0) + 1;

    return res.status(400).json(
      createMappedErrorResponse("103", "Invalid Credential", {
        errorCode: "103",
        engMessage: "Invalid Credential",
        idnMessage: "Salah Kredential",
        failCount: failCounts[username],
      })
    );
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json(
      createGeneralErrorResponse({
        code: "0021",
        codeSystem: "BSI-XPAN",
        message: "dlkajjdal Server Error",
        activityRefCode: "456d9314-cf4e-4fe1-a256-8ffcf51b2c99",
      })
    );
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
      return res.status(200).json(
        createMappedErrorResponse("103", "miea", {
          errorCode: "103",
          engMessage: "salah bro",
          idnMessage: "Salah bro",
        })
      );
    }

    return res
      .status(200)
      .json(generateTableData(pageNumber, pageSize, search));
  } catch (error) {
    console.error("example Error:", error);
    return res.status(500).json(
      createGeneralErrorResponse({
        code: "0020",
        codeSystem: "BSI-XPAN",
        message: "dlkajjdal Server Error",
        activityRefCode: "456d9314-cf4e-4fe1-a256-8ffcf51b2c99",
      })
    );
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
      createSuccessResponse({
        menuId: [
          0, 3, 1, 11, 111, 112, 113, 12, 121, 2, 21, 211, 212, 214, 215, 22,
          221, 222, 4,
        ],
      })
    );
  } catch (error) {
    console.error("example Error:", error);
    return res.status(500).json(
      createMappedErrorResponse("103", "error bro", {
        errorCode: "103",
        engMessage: "error bro",
        idnMessage: "error bro",
      })
    );
  }
});

router.get("/contentservice/dynamiccontent/get", async (req, res) => {
  try {
    const { contentCode } = req.query;

    if (!contentCode) {
      return res.status(400).json(
        createMappedErrorResponse("400", "contentCode is required", {
          errorCode: "400",
          engMessage: "contentCode is required",
          idnMessage: "Kode konten wajib diisi",
        })
      );
    }

    await delay(550);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (contentCode === "SECTION1") {
      return res.status(200).json(
        createSuccessResponse({
          section: "Section 1",
          titleId: "Xpan Mobile",
          titleEng: "Xpan Mobile",
          subTitleId: "Buat Pengalaman Transaksi Makin Mudah",
          subTitleEng: "Buat Pengalaman Transaksi Makin Mudah",
          child: [
            {
              titleId: "Kelola Bisnis Dengan System Maker - Approver",
              titleEng: "Kelola Bisnis Dengan System Maker - Approver",
              subTitleId: "Proses Transaksi Lebih Sistematis dan Transparan",
              subTitleEng: "Proses Transaksi Lebih Sistematis dan Transparan",
              image: "http image url",
            },
            {
              titleId: "Bisnis Dalam Genggaman : Xpan By BSI Mobile",
              titleEng: "Bisnis Dalam Genggaman : Xpan By BSI Mobile",
              subTitleId:
                "Buat transaksi, pantau kas, kelola bisnis dengan fleksibel",
              subTitleEng:
                "Buat transaksi, pantau kas, kelola bisnis dengan fleksibel",
              image: "http image url",
            },
            {
              titleId: "Rencana Langkah Keuangan Anda",
              titleEng: "Rencana Langkah Keuangan Anda",
              subTitleId: "Lebih mudah dengan pembiayaan yang dipersonalisasi",
              subTitleEng: "Lebih mudah dengan pembiayaan yang dipersonalisasi",
              image: "http image url",
            },
          ],
        })
      );
    }
    if (contentCode === "SECTION3") {
      return res.status(200).json(
        createSuccessResponse({
          section: "Section 3",
          titleId: "Syarat dan Ketentuan",
          titleEng: "Terms and Condition",
          subTitleId:
            "Kelola bisnis dengan persyaratan dan ketentuan yang mudah hanya di Xpan By BSI",
          subTitleEng:
            "Kelola bisnis dengan persyaratan dan ketentuan yang mudah hanya di Xpan By BSI",
          child: [
            {
              titleId: "Requirements",
              titleEng: "Requirements",
              ordering: 1,
              child: [
                {
                  titleId: "Individual Customer",
                  titleEng: "Individual Customer",
                  ordering: 1,
                  child: [
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 2,
                    },
                  ],
                },
                {
                  titleId: "Company Customer",
                  titleEng: "Company Customer",
                  ordering: 2,
                  child: [
                    {
                      titleId:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      titleEng:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      titleEng:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      ordering: 2,
                    },
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 3,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 4,
                    },
                    {
                      titleId: "Submit other supporting documents if required.",
                      titleEng:
                        "Submit other supporting documents if required.",
                      ordering: 5,
                    },
                  ],
                },
              ],
            },
            {
              titleId: "Registration Procedure",
              titleEng: "Registration Procedure",
              ordering: 2,
              child: [
                {
                  titleId: "Individual Customer",
                  titleEng: "Individual Customer",
                  ordering: 1,
                  child: [
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 2,
                    },
                  ],
                },
                {
                  titleId: "Company Customer",
                  titleEng: "Company Customer",
                  ordering: 2,
                  child: [
                    {
                      titleId:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      titleEng:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      titleEng:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      ordering: 2,
                    },
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 3,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 4,
                    },
                    {
                      titleId: "Submit other supporting documents if required.",
                      titleEng:
                        "Submit other supporting documents if required.",
                      ordering: 5,
                    },
                  ],
                },
              ],
            },
            {
              titleId: "Fees & Limits",
              titleEng: "Fees & Limits",
              ordering: 3,
              child: [
                {
                  titleId: "Individual Customer",
                  titleEng: "Individual Customer",
                  ordering: 1,
                  child: [
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 2,
                    },
                  ],
                },
                {
                  titleId: "Company Customer",
                  titleEng: "Company Customer",
                  ordering: 2,
                  child: [
                    {
                      titleId:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      titleEng:
                        "Show the original document and a copy of the valid Articles of Association/Bylaws (AD/ART).",
                      ordering: 1,
                    },
                    {
                      titleId:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      titleEng:
                        "Submit the original power of attorney appointment letter stamped and signed by the Management (in accordance with the bylaws) if the application is represented by Person in Charge (PIC).",
                      ordering: 2,
                    },
                    {
                      titleId:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      titleEng:
                        "Show original proof of valid identity. Indonesian Citizen: KTP-electronic; foreigners: Passport accompanied by Limited Stay Permit Card (KITAS) or Permanent Stay Permit Card (KITAP).",
                      ordering: 3,
                    },
                    {
                      titleId:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      titleEng:
                        "Savings Book (for Savings Account) and Current Account (for Giro Account).",
                      ordering: 4,
                    },
                    {
                      titleId: "Submit other supporting documents if required.",
                      titleEng:
                        "Submit other supporting documents if required.",
                      ordering: 5,
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
    }
  } catch (error) {
    console.error("example Error:", error);
    return res.status(500).json(
      createMappedErrorResponse("103", "error bro", {
        errorCode: "103",
        engMessage: "error bro",
        idnMessage: "error bro",
      })
    );
  }
});

module.exports = router;
