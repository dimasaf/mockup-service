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

router.post("/loginservice/v1/login/web", async (req, res) => {
  try {
    const { username } = req.body;

    await delay(150);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (username === "Victoria01") {
      failCounts[username] = 0;

      // Token yang sudah ada (masih dipakai)
      res.set(
        "token",
        "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjpbIlJPTEVfQVBQUk9WRSJdLCJzZXNzaW9uX2tleSI6IklCfDEiLCJ1c2VyIjoiVmljdG9yaWEwMSIsInVzZXJfcHJvZmlsZV9pZCI6MSwidXNlcm5hbWUiOiJWaWN0b3JpYTAxIiwiY2hhbm5lbENvZGUiOiJJQiIsImV4cCI6MTc0NzM4NDg3N30.RIqJsSGH4BO4TNZvCk8UrAexN8EYr6GeMNsMKa_6cp5EGuVec8Jl3fDx6b7AGQ2CWuta5L-JlyD5sO82RpXidg"
      );

      // Access token mock di header
      const accessTokenPayload = {
        role: ["admin", "user"],
        session_key: "abc123def456ghi789",
        user: "dimas.adji",
        user_profile_id: 101,
        username: "dimas.adji",
        channelCode: "WEBPORTAL",
        exp: 1767225600,
      };

      const encodedAccessToken = Buffer.from(
        JSON.stringify(accessTokenPayload)
      ).toString("base64");
      res.set("access-token", encodedAccessToken);

      return res.status(200).json(
        createSuccessResponse({
          nameAlias: "Sule anjay",
          language: "id",
          email: "sule@example.com",
          phoneNumber: "+6281234567890",
          address: "Jl. Mawar No. 10, Perumahan Asri",
          subdistrict: "Tamatan",
          city: "Cikidiw",
          province: "Jawa lu",
          vpan: "9876-XXXX-XXXX-1234",
          userStatus: "ACTIVE",
          userRegStatus: "VERIFIED",
          status: "ACTIVE",
          vcallStatus: "ENABLED",
          previousLogin: "2025-08-01T10:25:00Z",
          lastLogin: "2025-08-04T06:45:00Z",
          profileImageUrl: "https://example.com/images/profile/dimas.jpg",
          role: ["maker"],
          session_key: "abc123def456ghi789",
          user: "dimas.adjisule",
          user_profile_id: 101,
          username: "sule",
          channelCode: "WEBPORTAL",
          exp: 1767225600,
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

router.get("/appconfigservice/appconfig/megamenu/web", async (req, res) => {
  try {
    await delay(550);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    return res.status(200).json(
      createSuccessResponse({
        menuId: {
          listMenu: [
            {
              id: "1",
              name: "Beranda",
            },
            {
              id: "6811",
              name: "Pembiayaan Distribusi",
            },
            {
              id: "3",
              name: "Info Rekening",
            },
            {
              id: "31",
              name: "Info Rekening",
            },
            {
              id: "311",
              name: "Cek Saldo & Mutasi",
            },
            {
              id: "312",
              name: "Buka rekening Baru",
            },
            {
              id: "4",
              name: "Transaksi",
            },
            {
              id: "41",
              name: "Transfer",
            },
            {
              id: "411",
              name: "Single Transfer",
            },
            {
              id: "412",
              name: "Multi Transfer",
            },
            {
              id: "413",
              name: "Transfer Valas",
            },
            {
              id: "42",
              name: "Payroll",
            },
            {
              id: "421",
              name: "Payroll",
            },
            {
              id: "422",
              name: "Monitoring Payroll",
            },
            {
              id: "43",
              name: "Bayar & Beli",
            },
            {
              id: "431",
              name: "Bayar & Beli",
            },
            {
              id: "432",
              name: "Multi Bayar & Beli",
            },
            {
              id: "44",
              name: "Transaksi Lainnya",
            },
            {
              id: "441",
              name: "Transaksi Terjadwal",
            },
            {
              id: "442",
              name: "Transaksi Favorit",
            },
            {
              id: "5",
              name: "Manajemen Akun",
            },
            {
              id: "6",
              name: "Layanan Kami",
            },
            {
              id: "61",
              name: "Layanan Islami",
            },
            {
              id: "611",
              name: "Berbagi",
            },
            {
              id: "612",
              name: "Qurban",
            },
            {
              id: "613",
              name: "Haji & Umroh",
            },
            {
              id: "614",
              name: "Sertifikasi Produk Halal",
            },
            {
              id: "62",
              name: "Layanan Bisnis",
            },
            {
              id: "620",
              name: "Pembiayaan",
            },
            {
              id: "621",
              name: "Pembiayaan",
            },
            {
              id: "6211",
              name: "Pengajuan",
            },
            {
              id: "6212",
              name: "Tagihan",
            },
            {
              id: "6213",
              name: "Informasi",
            },
            {
              id: "630",
              name: "Kartu",
            },
            {
              id: "631",
              name: "Kartu",
            },
            {
              id: "6311",
              name: "Debit",
            },
            {
              id: "6312",
              name: "Kartu Hasanah",
            },
            {
              id: "6313",
              name: "Kartu Perusahaan",
            },
            {
              id: "640",
              name: "Merchant",
            },
            {
              id: "641",
              name: "Merchant",
            },
            {
              id: "6411",
              name: "Pendaftaran QRIS",
            },
            {
              id: "6412",
              name: "Pencatatan & Laporan Penjualan",
            },
            {
              id: "6413",
              name: "EDC",
            },
            {
              id: "650",
              name: "Investasi",
            },
            {
              id: "651",
              name: "Investasi",
            },
            {
              id: "6511",
              name: "SBN Online",
            },
            {
              id: "6512",
              name: "Deposito",
            },
            {
              id: "63",
              name: "Layanan Lainnya",
            },
            {
              id: "660",
              name: "Kurs Valas",
            },
            {
              id: "661",
              name: "Kurs Valas",
            },
            {
              id: "6611",
              name: "Informasi Kurs",
            },
            {
              id: "6612",
              name: "Kalkulator Kurs",
            },
            {
              id: "6613",
              name: "Tabel Nilai Tukar Kurs",
            },
            {
              id: "670",
              name: "MSPP",
            },
            {
              id: "671",
              name: "MSPP",
            },
            {
              id: "6711",
              name: "Curah & Kemasan",
            },
            {
              id: "6712",
              name: "Penawaran",
            },
            {
              id: "6713",
              name: "Produk Alokasi",
            },
            {
              id: "6714",
              name: "Pemantauan",
            },
            {
              id: "6715",
              name: "Rilis Manual",
            },
            {
              id: "680",
              name: "Rantai Pasokan",
            },
            {
              id: "681",
              name: "Rantai Pasokan",
            },
            {
              id: "2",
              name: "Tugas Saya",
            },
          ],
        },
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

router.post("/lang", async (req, res) => {
  try {
    await delay(150);

    return res.status(200).json(
      createSuccessResponse({
        "QR_Scan_Transfer/Autentikasi_BYOND": {
          id: "Autentikasi BYOND+",
          en: "BYOND+ Authentication",
        },
        "QR_Scan_Transfer/Kode_Autentikasi_Transaksi": {
          id: "Kode Autentikasi Transaksi",
          en: "Transaction Authentication Code",
        },
        "QR_Scan_Transfer/Masukkan_kode_berikut_untuk_menyelesaikan": {
          id: "Masukkan kode di bawah untuk menyelesaikan proses transaksi Anda:",
          en: "Enter the code below to complete your transaction process:",
        },
        "QR_Scan_Transfer/Kode_ini_berlaku_untuk": {
          id: "Kode ini berlaku untuk",
          en: "This code is valid for",
        },
        "QR_Scan_Transfer/Jangan_pernah_menyebarkan_kode_ini": {
          id: "Jangan pernah menyebarkan kode ini dengan siapapun termasuk kepada pihak BSI.",
          en: "Never share this code with anyone including BSI.",
        },
        "QR_Scan_Transfer/Arahkan_kamera_ke_QR_Code": {
          id: "Arahkan kamera ke QR Code yang tertera pada layar.",
          en: "Point the camera at the QR Code on the screen.",
        },
        "QR_Scan_Transfer/Untuk_menjaga_akun_anda": {
          id: "Demi keamanan akun, jangan pernah menyebarkan kode QR ini dengan siapapun termasuk pihak BSI.",
          en: "For account security, never share this QR code with anyone including BSI.",
        },
        "Notifikasi/Kode_Otentikasi/Kode_Otentikasi_Login_Xpan": {
          id: "Kode autentikasi layanan Bank BSI bersifat RAHASIA. Jangan bagikan kode kepada SIAPAPUN termasuk BSI. Kode berlaku selama 1 menit. Kode Anda: 514328",
          en: "BSI Bank service authentication code is CONFIDENTIAL. Do not share the code with ANYONE including BSI. The code is valid for 1 minute. Your code: 514328",
        },
        "Notifikasi/Kode_Otentikasi/Kode_Autentikasi_Login_Xpan": {
          id: "Kode Autentikasi Login Xpan by BSI",
          en: "Xpan by BSI Login Authentication Code",
        },
        "Notifikasi/Ubah_Password/Permintaan_ubah_password": {
          id: "Permintaan ubah password Xpan by BSI",
          en: "Xpan by BSI password change request",
        },
        "Notifikasi/Ubah_Password/Buka_pesan_ini_untuk_mengikuti": {
          id: "Buka pesan untuk mengubah password. Abaikan pesan ini jika Anda tidak melakukan permintaan ubah password.",
          en: "Open the message to change the password. Ignore this message if you did not make the password change request.",
        },
        "Activation/Lupa_Password/Ubah_Password": {
          id: "Ubah Password",
          en: "Change Password",
        },
        "Activation/Assalamualaikum_Rida_Durrahman": {
          id: "Assalamualaikum, Rida Durrahman, persiapkan beberapa hal berikut sebelum mengubah password Anda.",
          en: "Assalamualaikum, Rida Durrahman, prepare the following items before changing your password.",
        },
        "Activation/Aktivasi_baru_debit_card/Verifikasi_Kartu_Debit": {
          id: "Verifikasi Kartu Debit",
          en: "Debit Card Verification",
        },
        "Activation/Aktivasi_baru_debit_card/Verifikasi_PIN_Kartu_Debit": {
          id: "Verifikasi PIN kartu debit",
          en: "Debit card PIN verification",
        },
        "Activation/Aktivasi_baru_debit_card/Verifikasi_Wajah": {
          id: "Verifikasi wajah",
          en: "Face verification",
        },
        "Activation/Aktivasi_baru_debit_card/Ganti_Password": {
          id: "Password terbaru",
          en: "New password",
        },
        "Activation/Aktivasi_baru_debit_card/No_Kartu": {
          id: "Nomor Kartu",
          en: "Card Number",
        },
        "Activation/Aktivasi_baru_debit_card/Bulan_Kedaluwarsa": {
          id: "Bulan Kedaluwarsa",
          en: "Expired Date",
        },
        "Activation/Aktivasi_baru_debit_card/Tahun_Kedaluwarsa": {
          id: "Tahun Kedaluwarsa",
          en: "Expired Year",
        },
        "Activation/Aktivasi_baru_debit_card/Tidak_punya_kartu_debit": {
          id: "Tidak punya kartu debit?",
          en: "Don't own a debit card?",
        },
        "Activation/Aktivasi_baru_debit_card/Datangi_kantor_cabang_terdekat": {
          id: "Kunjungi kantor cabang terdekat",
          en: "Visit nearest BSI branch office",
        },
        "Activation/Aktivasi_baru_debit_card/Konfirmasi_PIN_kartu_debit": {
          id: "Konfirmasi PIN kartu debit",
          en: "Debit card PIN confirmation",
        },
        "Activation/Aktivasi_baru_debit_card/Masukkan_6_digit_PIN_kartu_Anda": {
          id: "Masukkan 6-digit PIN kartu Anda",
          en: "Enter your 6-digit card PIN",
        },
        "Activation/Aktivasi_baru_debit_card/Data_kartu_yang_kamu_masukkan_salah":
          {
            id: "Data kartu yang Anda masukkan salah",
            en: "The card data you entered is incorrect",
          },
        "Drawer/Salah_password_3x/Anda_salah_memasukkan_data_kartu_sebanyak_3_kali":
          {
            id: "Anda salah memasukkan data kartu sebanyak 3 kali",
            en: "You entered your card data incorrectly 3 times",
          },
        "Drawer/Salah_password_3x/Silakan_coba_lagi_dalam": {
          id: "Silakan coba lagi dalam -0:00:15 untuk mengulangi proses aktivasi.",
          en: "Please try again in -0:00:15 to repeat the activation process.",
        },
        "Drawer/Salah_password_3x/untuk_mengulangi_proses_aktivasi": {
          id: "untuk mengulangi proses aktivasi",
          en: "to retry the activation process.",
        },
        "Drawer/Kartu_Debit_Bermasalah/Kartu_debit_kamu_Anda_bermasalah": {
          id: "Kartu debit Anda bermasalah",
          en: "There is a problem with your debit card",
        },
        "Drawer/Kartu_Debit_Bermasalah/Kartu_debit_yang_kamu_masukkan_telah_kedaluwarsa":
          {
            id: "Data kartu debit yang Anda masukkan telah kedaluwarsa atau terblokir. Silakan kunjungi kantor cabang terdekat untuk memproses kartu debit Anda.",
            en: "The debit card data you inserted has expired or been blocked. Please visit the nearest branch office to process your debit card.",
          },
        "Activation/Aktivasi_baru_debit_card/Lokasi_ATM_Cabang": {
          id: "Lokasi Kantor Cabang",
          en: "Branch Locations",
        },
        "Activation/Aktivasi_baru_debit_card/ATM": {
          id: "ATM",
          en: "ATM",
        },
        "Activation/Aktivasi_baru_debit_card/Kantor_Cabang": {
          id: "Kantor Cabang",
          en: "Branch Office",
        },
        "Activation/Aktivasi_baru_debit_card/Find_Nearest_Branch_Office": {
          id: "Cari kantor cabang terdekat",
          en: "Find nearest branch office",
        },
        "Drawer/Kartu_Debit_Belum_Aktif/Kartu_debit_anda_belum_aktif": {
          id: "Kartu debit Anda belum aktif",
          en: "Your debit card is inactive",
        },
        "Drawer/Kartu_Debit_Belum_Aktif/Kartu_debit_yang_kamu_masukkan_belum": {
          id: "Kartu debit yang Anda masukkan belum diaktivasi. Silakan kunjungi kantor cabang terdekat untuk mengaktifkan kartu debit Anda.",
          en: "The debit card you have entered has not been activated. Please visit the nearest branch office to activate your debit card.",
        },
        "Activation/Aktivasi_baru_debit_card/Cari_ATM_terdekat": {
          id: "Cari ATM terdekat",
          en: "Find nearest ATM",
        },
        "Activation/Aktivasi_baru_debit_card/Terdapat_5_ATM_BSI_di_sekitarmu": {
          id: "Terdapat 5 ATM BSI di sekitar Anda",
          en: "There are 5 BSI ATMs near you",
        },
        "Activation/Aktivasi_baru_debit_card/Verifikasi_kartu_Anda_berhasil": {
          id: "Verifikasi kartu Anda berhasil",
          en: "Your card verification successful",
        },
        "Activation/Verifikasi_wajah/Face_verification": {
          id: "Verifikasi Wajah",
          en: "Face Verification",
        },
        "Activation/Verifikasi_wajah/Perhatikan_beberapa_hal_berikut": {
          id: "Perhatikan beberapa hal berikut sebelum melakukan verifikasi wajah.",
          en: "Pay attention to the following points before performing face verification.",
        },
        "Activation/Verifikasi_wajah/Jangan_menggunakan_kacamata_hitam": {
          id: "Jangan menggunakan kacamata baca/hitam",
          en: "Do not use reading/black glasses",
        },
        "Activation/Verifikasi_wajah/Jangan_menggunakan_masker": {
          id: "Jangan menggunakan masker",
          en: "Do not wear a mask",
        },
        "Activation/Verifikasi_wajah/Pastikan_cahaya_di_sekitarmu_terang_dan_tidak_redup":
          {
            id: "Pastikan cahaya di sekitarmu terang dan tidak redup",
            en: "Make sure the light around you is bright and not dim",
          },
        "Activation/Verifikasi_wajah/Pastikan_wajah_berada_pada_area_yang_telah_ditentukan":
          {
            id: "Pastikan wajah berada pada area yang telah ditentukan",
            en: "Make sure the face is in the designated area",
          },
        "Activation/Verifikasi_wajah/Tengok_ke_kiri": {
          id: "Tengok ke kiri",
          en: "Look to the left",
        },
        "Activation/Verifikasi_wajah/Kedipkan_mata": {
          id: "Kedipkan mata",
          en: "Blink your eyes",
        },
        "Activation/Verifikasi_wajah/Arahkan_kunci_ke_gembok_pada_wajah_secara_perlahan":
          {
            id: "Arahkan kunci ke gembok pada wajah secara perlahan",
            en: "Move the key to the lock on the face slowly",
          },
        "Activation/Verifikasi_wajah/Mohon_tunggu_sebentar": {
          id: "Mohon tunggu sebentar...",
          en: "Please wait a moment...",
        },
        "Activation/Salah_PIN_dan_HP/PIN_yang_Anda_masukkan_tidak_sama": {
          id: "PIN yang Anda masukkan tidak sama",
          en: "The PIN you entered is different",
        },
        "Activation/Salah_PIN_dan_HP/Verifikasi_Nomor_HP": {
          id: "Verifikasi Nomor HP",
          en: "Phone Number Verification",
        },
        "Drawer/Akun_Terblokir/Akun_Anda_terblokir": {
          id: "Akun Anda terblokir",
          en: "Your account is blocked",
        },
        "Drawer/Akun_Terblokir/Anda_salah_memasukkan_PIN_kartu_debit": {
          id: "Anda salah memasukkan PIN kartu debit sebanyak 3 kali. Buka blokir dengan menghubungi BSI Call 14040 atau kunjungi kantor cabang BSI terdekat.",
          en: "You have entered your debit card PIN incorrectly 3 times. Unblock by contacting BSI Call 14040 or visit the nearest BSI branch office.",
        },
        "Activation/Salah_PIN_dan_HP/Masukkan_6_digit_kode_OTP_yang_dikirim": {
          id: "Masukkan 6-digit kode OTP yang dikirim ke ****4430",
          en: "Enter the 6-digit OTP code sent to ****4430",
        },
        "Activation/Salah_PIN_dan_HP/Tidak_menerima_kode_verifikasi": {
          id: "Tidak menerima kode verifikasi?",
          en: "Did not receive verification code?",
        },
        "Activation/Salah_PIN_dan_HP/Kirim_ulang_kode": {
          id: "Kirim ulang kode",
          en: "Resend code",
        },
        "Activation/Salah_PIN_dan_HP/Kode_OTP_tidak_sesuai": {
          id: "Kode OTP tidak sesuai. Periksa kembali kode yang Anda terima dan coba lagi",
          en: "OTP code does not match. Double check the code you received and try again.",
        },
        "Activation/Salah_PIN_dan_HP/Kode_OTP_masih_tidak_sesuai": {
          id: "Kode OTP masih tidak sesuai, kesempatan percobaan tersisa 2x lagi",
          en: "OTP code still does not match, 2 more tries left",
        },
        "Activation/Salah_PIN_dan_HP/Kode_OTP_masih_tidak_sesuai_kesempatan": {
          id: "Kode OTP masih tidak sesuai, kesempatan percobaan tersisa 1x lagi",
          en: "OTP code still does not match, 1 more tries left",
        },
        "Drawer/Salah_memasukkan_OTP_berturut/Anda_salah_memasukkan_verifikasi_OTP":
          {
            id: "Anda salah memasukkan verifikasi OTP berturut-turut",
            en: "You entered the wrong OTP verification consecutively",
          },
        "Drawer/Salah_memasukkan_OTP_berturut/Akses_login_dibekukan_sementara_selama_Silakan_tunggu_beberapa_saat":
          {
            id: "Akses login dibekukan sementara selama -00:30:00. Silakan tunggu beberapa saat.",
            en: "Login access is temporarily frozen for -00:00:15.  Please wait for a while.",
          },
        "Activation/Salah_PIN_dan_HP/Maaf_verifikasi_Anda_belum_berhasil": {
          id: "Maaf, verifikasi Anda belum berhasil",
          en: "Sorry, your verification was not successful",
        },
        "Activation/Salah_PIN_dan_HP/Saat_ini_kami_belum_bisa_memverifikasi_data_diri_Anda":
          {
            id: "Saat ini kami belum bisa memverifikasi data diri Anda.",
            en: "We were unable to verify your personal data at this time.",
          },
        "Activation/Verifikasi_wajah/Video_Call": {
          id: "Video Call",
          en: "Video Call",
        },
        "Activation/Verifikasi_wajah/Agen_kami_siap_membantu_verifikasi_melalui":
          {
            id: "Agen kami siap membantu verifikasi melalui video call",
            en: "Our agents are ready to assist your verification via video call",
          },
        "Activation/Verifikasi_wajah/Jam_operasional_verifikasi_video_call_tersedia_pada":
          {
            id: "Jam operasional verifikasi video call tersedia pada 06:00-22:00 WIB.",
            en: "Video call verification operating hours are available from 06:00-22:00 WIB.",
          },
        "Activation/Verifikasi_wajah/Sebelum_memulai_pastikan_Anda": {
          id: "Sebelum memulai, pastikan Anda:",
          en: "Before starting, make sure you:",
        },
        "Activation/Verifikasi_wajah/Menyiapkan_e-KTP": {
          id: "Menyiapkan e-KTP",
          en: "Prepare e-KTP",
        },
        "Activation/Verifikasi_wajah/Memiliki_koneksi_internet_yang_cepat": {
          id: "Memiliki koneksi internet yang cepat",
          en: "Have a fast internet connection",
        },
        "Activation/Verifikasi_wajah/Berada_di_ruangan_yang_tenang_dengan_cahaya":
          {
            id: "Berada di ruangan yang tenang dengan cahaya yang memadai",
            en: "Be in a quiet room with sufficient light",
          },
        "Activation/Verifikasi_wajah/Dengan_memulai_Anda_telah_menyetujui": {
          id: "Dengan memulai, Anda telah menyetujui ketentuan layanan dan kebijakan privasi.",
          en: "By starting, you have agreed to the terms of service and privacy policy.",
        },
        "Activation/Verifikasi_wajah/Sedang_menghubungkan": {
          id: "Sedang menghubungkan...",
          en: "Connecting...",
        },
        "Activation/Verifikasi_wajah/Terima_kasih_atas_kesabarannya": {
          id: "Terima kasih atas kesabarannya. Kami akan segera membantu Anda.",
          en: "Thank you for your patience. We will help you soon.",
        },
        "Activation/Verifikasi_wajah/Antrian_Anda_saat_ini": {
          id: "Antrian Anda saat ini:",
          en: "Your current queue:",
        },
        "Activation/Verifikasi_wajah/Verifikasi_sudah_selesai_melanjutkan_kembali_proses_pembukaan_rekening":
          {
            id: "Verifikasi selesai, melanjutkan kembali proses pembukaan rekening",
            en: "Verification completed, resume account opening process",
          },
        "Activation/Verifikasi_wajah/Verifikasi_data_diri_sedang_diproses": {
          id: "Verifikasi data diri sedang diproses",
          en: "Personal data verification is in process",
        },
        "Activation/Verifikasi_wajah/Verifikasi_wajah_Anda_belum_berhasil": {
          id: "Verifikasi wajah Anda belum berhasil",
          en: "Your face verification has not been successful",
        },
        "Activation/Verifikasi_wajah/Jangan_khawatir_Anda_dapat_verifikasi": {
          id: "Jangan khawatir, Anda bisa verifikasi melalui video call atau datang ke kantor cabang BSI terdekat.",
          en: "Don't worry, you can verify via video call or visit the nearest BSI branch office.",
        },
        "Activation/Verifikasi_wajah/Kami_tunggu_di_kantor_cabang_terdekat": {
          id: "Kami tunggu di kantor cabang terdekat!",
          en: "We're waiting for you at the nearest branch office!",
        },
        "Activation/Verifikasi_wajah/Tunjukkan_nomor_verifikasi_di_bawah_untuk_melanjutkan_proses_verifikasi_Anda":
          {
            id: "Tunjukkan nomor verifikasi di bawah untuk melanjutkan proses verifikasi Anda.",
            en: "Show the verification number below to continue your verification process.",
          },
        "Activation/Verifikasi_wajah/No_Verifikasi": {
          id: "No. Verifikasi",
          en: "Verification No.",
        },
        "Activation/Verifikasi_wajah/Berlaku_sampai": {
          id: "Berlaku sampai:",
          en: "Valid until:",
        },
        "Activation/Verifikasi_wajah/22_Maret_2022": {
          id: "22 Maret 2025, 15:03 WIB",
          en: "22 March 2025, 15:03 WIB",
        },
        "Drawer/Verifikasi_belum_dapat_dilakukan/Verifikasi_belum_dapat_dilakukan":
          {
            id: "Verifikasi belum dapat dilakukan",
            en: "Verification is not yet possible",
          },
        "Drawer/Verifikasi_belum_dapat_dilakukan/Anda_bisa_datang_ke_kantor_cabang_terdekat_untuk_melakukan_verifikasi":
          {
            id: "Silakan datang ke kantor cabang terdekat untuk melakukan verifikasi data diri Anda dengan membawa KTP.",
            en: "Please visit the nearest branch office to verify your data by bringing your ID card.",
          },
        "Drawer/Nomor_verifikasi_sudah_kedaluwarsa/Nomor_verifikasi_sudah_kedaluwarsa":
          {
            id: "Nomor verifikasi sudah kedaluwarsa",
            en: "Verification number has expired",
          },
        "Drawer/Nomor_verifikasi_sudah_kedaluwarsa/Silakan_lakukan_permintaan_ulang":
          {
            id: "Silakan lakukan permintaan ulang nomor verifikasi baru Anda.",
            en: "Please request your new verification number.",
          },
        "Activation/Lupa_Password/Verifikasi_Anda_belum_berhasil": {
          id: "Verifikasi Anda belum berhasil",
          en: "Your verification was not successful",
        },
        "Activation/Lupa_Password/Saat_ini_kami_belum_berhasil_memverifikasi_data_diri_Anda":
          {
            id: "Saat ini kami belum berhasil memverifikasi data diri Anda.",
            en: "We were unable to verify your data at this time.",
          },
        "Activation/Lupa_Password/Buat_Password_Login": {
          id: "Buat Password Login",
          en: "Create Login Password",
        },
        "Activation/Lupa_Password/Password_ini_digunakan_untuk_login_ke_akun_BYOND_Anda":
          {
            id: "Password ini digunakan untuk login ke akun Xpan by BSI Anda.",
            en: "This password is used to log into your Xpan by BSI account.",
          },
        "Activation/Lupa_Password/Min_8_karakter": {
          id: "Min. 8 karakter",
          en: "Min. 8 characters",
        },
        "Activation/Lupa_Password/Huruf_besar_&_kecil": {
          id: "Huruf besar & kecil",
          en: "Upper & lower case",
        },
        "Activation/Lupa_Password/Password_Baru": {
          id: "Password Baru",
          en: "New Password",
        },
        "Activation/Lupa_Password/Simbol": {
          id: "Simbol (contoh: @!#)",
          en: "Symbol (example: @!#)",
        },
        "Activation/Lupa_Password/Angka": {
          id: "Angka",
          en: "Number",
        },
        "Activation/Lupa_Password/Konfirmasi_Password": {
          id: "Konfirmasi Password",
          en: "Password Confirmation",
        },
        "Activation/Lupa_Password/Alhamdulillah_password_baru_Anda_berhasil_dibuat":
          {
            id: "Alhamdulillah, password baru Anda berhasil dibuat!",
            en: "Alhamdulillah, your new password was successfully created!",
          },
        "Activation/Lupa_Password/Silakan_login_kembali_menggunakan_password_baru_Anda":
          {
            id: "Silakan login kembali menggunakan password baru Anda.",
            en: "Please login again using your new password.",
          },
        "Notifikasi/Notifikasi_OTP/WASPADA_PENIPUAN": {
          id: "WASPADA PENIPUAN. JANGAN BERIKAN KODE OTP INI KEPADA SIAPAPUN TERMASUK PIHAK BANK. Masukkan kode OTP : 320455",
          en: "FRAUD ALERT. DO NOT SHARE THIS OTP CODE TO ANYONE EVEN BANK. Enter the OTP code: 320455",
        },
        "Activation/Lupa_Password/Masukkan_Password_Lama": {
          id: "Masukkan Password Lama",
          en: "Enter Old Password",
        },
        "Activation/Lupa_Password/Password_Lama": {
          id: "Password Lama",
          en: "Old Password",
        },
        "Activation/Lupa_Password/Masukkan_Password_Baru": {
          id: "Masukkan Password Baru",
          en: "Enter New Password",
        },
        "Activation/Lupa_Password/Konfirmasi_Password_Baru": {
          id: "Konfirmasi Password Baru",
          en: "Confirm New Password",
        },
        "Drawer/Password_berhasil_diubah/Password_Anda_berhasil_diubah": {
          id: "Password Anda berhasil diubah!",
          en: "Your password was changed successfully!",
        },
        "Activation/Lupa_Password/Password_yang_Anda_masukkan_salah": {
          id: "Password yang Anda masukkan salah. Silakan coba lagi atau klik lupa password.",
          en: "Password is incorrect. Please try again or click forgot password.",
        },
        "Drawer/Ubah_password_gagal/Ubah_password_gagal": {
          id: "Gagal mengubah password",
          en: "Failed to change password",
        },
        "Drawer/Ubah_password_gagal/Anda_masih_menggunakan_password_yang_lama":
          {
            id: "Anda memasukkan password lama. Silakan gunakan kombinasi password yang berbeda.",
            en: "You entered an old password. Please use a different password combination.",
          },
        "Activation/Lupa_Password/Atur_Password_Baru": {
          id: "Atur Password Baru",
          en: "Set New Password",
        },
        "View_User_ID/Adzan_Isya_5_menit_lagi": {
          id: "Adzan Isya 5 menit lagi (18:30)",
          en: "Adzan Isha in 5 minutes (18:30)",
        },
        "View_User_ID/Bayar_Beli": {
          id: "Bayar Beli",
          en: "Pay & Buy",
        },
        "View_User_ID/Transfer_Favorit": {
          id: "Transfer Favorit",
          en: "Favorite Transfer",
        },
        "View_User_ID/Beranda": {
          id: "Beranda",
          en: "Home",
        },
        "View_User_ID/Portofolio": {
          id: "Portofolio",
          en: "Portfolio",
        },
        "View_User_ID/Arus_Kas": {
          id: "Arus Kas",
          en: "Cash Flow",
        },
        "View_User_ID/Profil": {
          id: "Profil",
          en: "Profile",
        },
        "View_User_ID/Info_Kontak": {
          id: "Info Kontak",
          en: "Contact Information",
        },
        "View_User_ID/Nama": {
          id: "Nama",
          en: "Name",
        },
        "View_User_ID/User_ID": {
          id: "User ID",
          en: "User ID",
        },
        "View_User_ID/Nomor_HP": {
          id: "Nomor HP",
          en: "Phone Number",
        },
        "View_User_ID/Email": {
          id: "Email",
          en: "Email",
        },
        "View_User_ID/Status_Email": {
          id: "Status Email",
          en: "Email Status",
        },
        "View_User_ID/Terverifikasi": {
          id: "Terverifikasi",
          en: "Verified",
        },
        "View_User_ID/Mutasi_Terakhir": {
          id: "Mutasi Terakhir",
          en: "Latest Statement",
        },
        "View_User_ID/Informasi_Akun": {
          id: "Informasi Akun",
          en: "Account Information",
        },
        "View_User_ID/Biaya_Top_Up_Gopay": {
          id: "Biaya Top Up Gopay",
          en: "Admin Fee Gopay",
        },
        "Activation/PT_Bank_Syariah_Indonesia_Tbk_berizin_dan_diawasi_oleh_Otoritas_Jasa_Keuangan":
          {
            id: "PT Bank Syariah Indonesia Tbk berizin dan diawasi oleh Otoritas Jasa Keuangan dan Bank Indonesia serta merupakan Peserta Penjaminan LPS",
            en: "PT Bank Syariah Indonesia Tbk is licensed and supervised by the Financial Services Authority (OJK) and Bank Indonesia and is an LPS Guarantee Participant.",
          },
        "Activation/Kembangkan_Usaha_Anda_dengan_Xpan_by_BSI": {
          id: "Kembangkan usaha Anda bersama Xpan by BSI",
          en: "Grow your business with Xpan by BSI",
        },
        "Button/Buka_Rekening": {
          id: "Buka Rekening",
          en: "Open Account",
        },
        "Button/Sudah_Punya_Rekening": {
          id: "Sudah Punya Rekening",
          en: "Already Have Account",
        },
        "Activation/Syarat_dan_Ketentuan_Khusus": {
          id: "Syarat & Ketentuan Xpan by BSI",
          en: "Xpan by BSI Terms & Conditions",
        },
        "Button/Saya_Tidak_Setuju": {
          id: "Saya Tidak Setuju",
          en: "I Disagree",
        },
        "Button/Saya_Setuju": {
          id: "Saya Setuju",
          en: "I Agree",
        },
        "Activation/Selamat_Datang_di_Xpan_by_BSI": {
          id: "Selamat Datang di Xpan by BSI sebagai Owner",
          en: "Welcome to Xpan by BSI as Owner",
        },
        "Activation/Masukkan_nomor_HP_Anda_yang_terdaftar_di_BSI": {
          id: "Masukkan nomor HP Anda yang terdaftar di BSI.",
          en: "Enter your registered mobile number at BSI.",
        },
        "Activation/Nomor_HP": {
          id: "Nomor Handphone",
          en: "Mobile Number",
        },
        "Activation/Verifikasi_Diri": {
          id: "Verifikasi Diri",
          en: "Identity Verification",
        },
        "Activation/Bantu_kami_mengenali_Anda_dengan_memverifikasi_identitas_diri":
          {
            id: "Bantu kami mengenali Anda dengan memverifikasi identitas diri.",
            en: "Help us identify you by verifying your identity.",
          },
        "Activation/Nomor_Rekening_BSI": {
          id: "Nomor Rekening BSI",
          en: "BSI Account Number",
        },
        "Activation/NIK": {
          id: "NIK (Nomor Induk Kependudukan)",
          en: "NIK (National Identification Number)",
        },
        "Activation/Lengkapi_Data_Akun_Anda": {
          id: "Lengkapi Data Akun Anda",
          en: "Complete Your Account Data",
        },
        "Activation/Hampir_selesai_silakan_lengkapi": {
          id: "Hampir selesai, silakan lengkapi data di bawah ini.",
          en: "Almost there, please complete the data below.",
        },
        "Activation/Nama_Panggilan": {
          id: "Nama Panggilan",
          en: "Nickname",
        },
        "Activation/Alamat_Email": {
          id: "Alamat Email",
          en: "Email Address",
        },
        "Activation/Verifikasi_Email": {
          id: "Verifikasi Email",
          en: "Email Verification",
        },
        "Activation/Masukkan_6_digit_kode_OTP": {
          id: "Masukkan 6-digit kode OTP yang dikirim ke ****.durrahman@gmail.com",
          en: "Enter the 6-digit OTP code sent to ****.durrahman@gmail.com",
        },
        "Drawer/Email_sudah_digunakan/Email_yang_kamu_masukkan_telah_terpakai":
          {
            id: "Email yang Anda masukkan telah digunakan",
            en: "The email you entered has been used",
          },
        "Drawer/Email_sudah_digunakan/Pastikan_email_yang_kamu_isi_sudah_sesuai":
          {
            id: "Pastikan email yang Anda gunakan sudah benar atau gunakan email lain.",
            en: "Make sure the email you are using is correct or use another email.",
          },
        "Email_Notifikasi/Aktivasi_Selesai/Aktivasi_selesai": {
          id: "Aktivasi Berhasil - Xpan by BSI",
          en: "Activation Successful - Xpan by BSI",
        },
        "Email_Notifikasi/Aktivasi_Selesai/Assalamualaikum_Rida_Durr": {
          id: "Assalamualaikum, Rida Durrahman",
          en: "Assalamualaikum, Rida Durrahman",
        },
        "Email_Notifikasi/Aktivasi_Selesai/Selamat_aktivasi_akun_kamu_berhasil":
          {
            id: "Selamat! Aktivasi akun Anda berhasil.",
            en: "Congratulations! Your account activation was successful.",
          },
        "Email_Notifikasi/Aktivasi_Selesai/Silakan_akses_website_Xpan_by_BSI_dengan_klik_link_di_bawah_ini":
          {
            id: "Silakan akses website Xpan by BSI dengan klik link di bawah ini:",
            en: "Please access the Xpan by BSI website by clicking the link below.:",
          },
        "Email_Notifikasi/Footer_Email/Terima_kasih_telah_menggunakan": {
          id: "Terima kasih telah menggunakan layanan Xpan by BSI. Semoga layanan kami mendatangkan berkah bagi Anda.",
          en: "Thank you for using the Xpan by BSI service. May our services bring blessings to you.",
        },
        "Email_Notifikasi/Footer_Email/Butuh_bantuan_hubungi_kami": {
          id: "Butuh bantuan? Hubungi kami di 14040",
          en: "Need  help? Contact us at 14040",
        },
        "Email_Notifikasi/Verifikasi_Email/Assalamualaikum_Rida": {
          id: "Assalamualaikum Rida,",
          en: "Assalamualaikum Rida,",
        },
        "Email_Notifikasi/Verifikasi_Email/Silakan_melanjutkan_verifikasi_dengan_kode_OTP":
          {
            id: "Silakan lanjutkan verifikasi Anda dengan kode OTP berikut:",
            en: "Please continue your verification with the following OTP code:",
          },
        "Email_Notifikasi/Verifikasi_Email/Kode_OTP": {
          id: "Kode OTP",
          en: "OTP Code",
        },
        "Email_Notifikasi/Verifikasi_Email/Jaga_keamanan_akun_Anda_dengan_tidak_membagikan":
          {
            id: "Jaga keamanan akun Anda dengan tidak membagikan kode OTP kepada siapa pun.",
            en: "Keep your account secure by not sharing your OTP code with anyone.",
          },
        "Drawer/Koneksi_internet_terputus/Koneksi_internet_kamu_terputus": {
          id: "Koneksi internet Anda terputus",
          en: "Your internet connection is lost",
        },
        "Drawer/Koneksi_internet_terputus/Sambungkan_kembali_koneksi_internet_dengan_mengatur_ulang":
          {
            id: "Hubungkan kembali koneksi internet Anda dengan mengatur ulang atau berpindah ke tempat dengan sinyal yang lebih stabil.",
            en: "Reconnect your internet connection by resetting or moving to a place with a more stable signal.",
          },
        "Drawer/Mengaktifkan_Biometrik/Apakah_kamu_ingin_mengaktifkan_login_biometrik":
          {
            id: "Apakah Anda ingin mengaktifkan login biometrik?",
            en: "Do you want to enable biometric login?",
          },
        "Drawer/Mengaktifkan_Biometrik/Login_lebih_cepat_dengan_menggunakan_biometrik":
          {
            id: "Login lebih cepat dengan menggunakan biometrik. Anda juga bisa mengaturnya melalui Profile.",
            en: "Faster login by using biometrics. You can also set it up via Profile.",
          },
        "Snackbar/Verifikasi_anda_disetujui": {
          id: "Verifikasi Anda disetujui",
          en: "Your verification is approved",
        },
        "Snackbar/Koneksi_anda_kurang_stabil": {
          id: "Koneksi Anda kurang stabil",
          en: "Your connection is unstable",
        },
        "Drawer/Salah_password_2x/Anda_salah_memasukkan_password_sebanyak_2_kali":
          {
            id: "Anda salah memasukkan password sebanyak 2 kali",
            en: "You entered the wrong password 2 times",
          },
        "Drawer/Salah_password_2x/Batas_maksimal_salah_password_adalah_3_kali":
          {
            id: "Batas maksimal salah password adalah 3 kali. Pastikan Password sudah benar atau klik Lupa Password untuk mengganti password Anda.",
            en: "The maximum limit of incorrect passwords is 3 times. Make sure your password is correct or click Forgot Password to change your password.",
          },
        "PIN_Transaksi/Buat_PIN_Transaksi": {
          id: "Buat PIN Transaksi",
          en: "Create Transaction PIN",
        },
        "PIN_Transaksi/Masukkan_6-digit_PIN_untuk_bertransaksi": {
          id: "Masukkan 6-digit PIN untuk bertransaksi",
          en: "Enter your 6-digit PIN for transaction",
        },
        "PIN_Transaksi/Ingat_untuk_selalu_jaga_kerahasiaan_PIN_dengan_tidak_memberikan_PIN_kepada_siapa_pun!":
          {
            id: "Ingat untuk selalu jaga kerahasiaan PIN dengan tidak memberikan PIN kepada siapa pun!",
            en: "Remember to always keep your PIN confidential by not giving it to anyone!",
          },
        "PIN_Transaksi/Konfirmasi_PIN": {
          id: "Konfirmasi PIN",
          en: "PIN Confirmation",
        },
        "PIN_Transaksi/Masukkan_6-digit_PIN_sesuai_dengan_yang_sebelumnya": {
          id: "Masukkan 6-digit PIN sesuai dengan yang sebelumnya",
          en: "Enter your 6-digit PIN according to the previous one",
        },
        "Button/Nanti_Saja": {
          id: "Nanti Saja",
          en: "Later",
        },
        "Button/Aktifkan": {
          id: "Aktifkan",
          en: "Activate",
        },
        Kartu_debit_Anda_sedang_diproses: {
          id: "Kartu debit Anda sedang diproses",
          en: "Your debit card is processing",
        },
        "Drawer/Kartu_debit_kamu_sedang_diproses/Kartu_debit_Anda_sedang_diproses":
          {
            id: "Kartu debit Anda sedang diproses",
            en: "Your debit card is in process",
          },
        "Drawer/Kartu_debit_kamu_sedang_diproses/Kami_sedang_memproses_kartu_debit_Anda":
          {
            id: "Kami sedang memproses kartu debit Anda. Mohon tunggu 5-10 menit lalu coba lagi.",
            en: "We are currently processing your debit card. Please wait 5-10 minutes and try again.",
          },
        "Drawer/Data_diri_tidak_sesuai/Data_diri_yang_kamu_masukkan_tidak_sesuai":
          {
            id: "Data diri yang Anda masukkan tidak sesuai",
            en: "The personal data you entered does not match",
          },
        "Drawer/Data_diri_tidak_sesuai/Pastikan_data_diri_kamu_sesuai_dengan_yang_terdaftar_di_sistem_BSI_lalu_coba_lagi":
          {
            id: "Pastikan data diri Anda sesuai dengan yang terdaftar di sistem BSI lalu coba lagi",
            en: "Make sure your personal data matches what is registered in the BSI system and then try again.",
          },
        "Drawer/Data_diri_tidak_sesuai/Perbarui_data_diri_kamu": {
          id: "Perbarui data diri Anda",
          en: "Update your personal data",
        },
        "Drawer/Data_diri_tidak_sesuai/Silakan_lakukan_pengkinian_data_melalui_kantor_cabang_terdekat_lalu_coba_lagi":
          {
            id: "Silakan lakukan pengkinian data melalui kantor cabang terdekat lalu coba lagi.",
            en: "Please update your data through your nearest branch office and try again.",
          },
        "Drawer/Data_diri_tidak_sesuai/Kamu_salah_memasukkan_data_diri_sebanyak_3_kali":
          {
            id: "Anda salah memasukkan data diri sebanyak 3 kali",
            en: "You entered your personal data incorrectly 3 times",
          },
        "Drawer/Data_diri_tidak_sesuai/Silakan_coba_lagi_dalam_-00:15:00": {
          id: "Silakan coba lagi dalam -00:15:00. Anda juga dapat mengunjungi kantor cabang terdekat untuk mendapatkan bantuan.",
          en: "Please try again in -00:15:00. You can also visit your nearest branch office for assistance.",
        },
        "Activation/Lupa_Password/Alhamdulillah_PIN_password_baru_Anda_berhasil_dibuat":
          {
            id: "Alhamdulillah, PIN & password baru Anda berhasil dibuat!",
            en: "Alhamdulillah, your PIN & new password was successfully created!",
          },
        "PIN_Transaksi/Silakan_login_ulang_menggunakan_password_baru_dan_gunakan_PIN_baru_kamu_untuk_melakukan_transaksi":
          {
            id: "Silakan login ulang menggunakan password baru dan gunakan PIN baru Anda untuk melakukan transaksi",
            en: "Please re-login using your new password and use your new PIN to make transactions.",
          },
        "Drawer/Kartu_debit_terblokir/Kartu_debit_kamu_terblokir": {
          id: "Kartu debit Anda terblokir",
          en: "Your debit card is blocked",
        },
        "Drawer/Kartu_debit_terblokir/Kamu_salah_memasukkan_PIN_kartu_debit_sebanyak_3_kali":
          {
            id: "Anda salah memasukkan PIN kartu debit sebanyak 3 kali. Buka blokir melalui BSI Call 14040 atau kantor cabang terdekat. Aktivasi dapat dilakukan kembali setelah 1x24 jam.",
            en: "You entered your debit card PIN incorrectly 3 times. Unblock via BSI Call 14040 or the nearest branch office. Activation can be done again after 1x24 hours.",
          },
        "Drawer/Salah_memasukkan_data_kartu/Kamu_salah_memasukkan_data_kartu_sebanyak_3_kali":
          {
            id: "Anda salah memasukkan data kartu sebanyak 3 kali",
            en: "You entered the card data incorrectly 3 times",
          },
        "Drawer/Salah_memasukkan_data_kartu/Silakan_coba_lagi_dalam": {
          id: "Silakan coba lagi dalam -00:15:00 untu mengulangi proses aktivasi",
          en: "Please try again in -00:15:00 to retry the activation process.",
        },
        "Drawer/Perbarui_akun_Xpan/Silakan_perbarui_akun_Xpan_kamu": {
          id: "Silakan perbarui akun Xpan by BSI Anda",
          en: "Please update your Xpan by BSI account",
        },
        "Drawer/Perbarui_akun_Xpan/Demi_keamanan_silakan_verifikasi_ulang_akun_kamu":
          {
            id: "Demi keamanan, silakan verifikasi ulang akun Xpan by BSI Anda.",
            en: "For security reasons, please re-verify your Xpan by BSI account.",
          },
        "Activation/Verifikasi_wajah/Pastikan_wajah_kamu_berada_di_dalam_lingkaran_di_bawah_ini":
          {
            id: "Pastikan wajah Anda berada di dalam lingkaran di bawah ini",
            en: "Make sure your face is inside the circle below!",
          },
        "Activation/Verifikasi_wajah/Senyum_secara_natural": {
          id: "Senyum lah secara natural",
          en: "Smile naturally",
        },
        "Activation/Masukkan_Alamat_Email": {
          id: "Masukkan Alamat Email",
          en: "Enter Email Address",
        },
        "Activation/Pastikan_email_benar_dan_aktif_untuk_mendapatkan_notifikasi_dan_estatement":
          {
            id: "Pastikan email benar dan aktif untuk mendapatkan notifikasi dan e-statement.",
            en: "Make sure your email is correct and active to get notifications and e-statements.",
          },
        "Pre-Login/Kembangkan_Bisnis_Anda": {
          id: "Kembangkan Bisnis Anda!",
          en: "Expand Your Business!",
        },
        "Pre-Login/Sholat_Maghrib": {
          id: "Sholat Maghrib",
          en: "Magrib Prayer",
        },
        "Pre-Login/Adzan_10_menit_lagi": {
          id: "Adzan 10 menit lagi",
          en: "Adzan in 10 minutes",
        },
        "Pre-Login/Token": {
          id: "Token",
          en: "Token",
        },
        "Pre-Login/Notifikasi": {
          id: "Notifikasi",
          en: "Notification",
        },
        "Drawer/Verifikasi_wajah_belum_berhasil/Verifikasi_wajah_Anda_belum_bisa_dikenali":
          {
            id: "Verifikasi wajah Anda belum bisa dikenali",
            en: "Your face verification cannot be recognized",
          },
        "Drawer/Verifikasi_wajah_belum_berhasil/Jangan_khawatir_kamu_dapat_ulangi_proses_verifikasi_wajah_atau_verifikasi_melalui__cara_lainnya":
          {
            id: "Jangan khawatir, Anda dapat ulangi proses verifikasi wajah, atau verifikasi melalui cara lainnya.",
            en: "Don't worry, you can repeat the face verification process, or verify through other ways.",
          },
        "Button/Verifikasi_Ulang": {
          id: "Verifikasi Ulang",
          en: "Re-verification",
        },
        "Drawer/Verifikasi_wajah_belum_berhasil/atau_verifikasi_dengan_cara_lain":
          {
            id: "atau verifikasi dengan cara lain",
            en: "or verify in other ways",
          },
        "Button/Melalui_Kantor_Cabang": {
          id: "Melalui Kantor Cabang",
          en: "Through Branch Offices",
        },
        "Drawer/Verifikasi_wajah_belum_berhasil/Verifikasi_wajah_Anda_belum_berhasil":
          {
            id: "Verifikasi wajah Anda belum berhasil",
            en: "Your face verification has not been successful",
          },
        "Drawer/Verifikasi_wajah_belum_berhasil/Untuk_proses_selanjutnya_kamu_dapat_melakukan_verifikasi_melalui_video_call_agent_atau_di_kantor_cabang_BSI_terdekat_untuk_mendapat_bantuan":
          {
            id: "Untuk proses selanjutnya, Anda dapat melakukan verifikasi melalui video call agent atau di kantor cabang BSI terdekat untuk mendapat bantuan.",
            en: "For the next process, you can verify via video call agent or at the nearest BSI branch office for assistance.",
          },
        "Drawer/Lupa_PIN/Anda_lupa_pin": {
          id: "Anda lupa PIN?",
          en: "Forgot your PIN?",
        },
        "Drawer/Verifikasi_wajah_belum_berhasil/Silakan_hubungi_kami_kembali_nanti":
          {
            id: "Silakan hubungi kami kembali nanti",
            en: "Please get back to us later!",
          },
        "Drawer/Lupa_PIN/Anda_sudah_mencapai_batas_maksimal_salah_memasukkan_PIN":
          {
            id: "Anda sudah mencapai batas maksimal salah memasukkan PIN. Klik Buat PIN Baru untuk akses akun Anda kembali.",
            en: "You have reached the maximum limit of incorrect PIN entries. Click Create New PIN to access your account again.",
          },
        "Drawer/Verifikasi_wajah_belum_berhasil/Mohon_maaf_saat_ini_layanan_video_call_hanya_dapat_diakses_pukul":
          {
            id: "Mohon maaf saat ini layanan video call hanya dapat diakses pukul 06:00 s/d 22.00 WIB",
            en: "Sorry, currently the video call service can only be accessed from 06:00 to 22:00 WIB.",
          },
        "Drawer/Verifikasi_wajah_belum_berhasil/Silakan_coba_lagi_dalam_-00:15:00_untuk_mengulangi_proses_aktivasi":
          {
            id: "Silakan coba lagi dalam -00:15:00 untuk mengulangi proses aktivasi.",
            en: "Please try again in -00:15:00 to repeat the activation process.",
          },
        "Drawer/Verifikasi_wajah_belum_berhasil/Silakan_coba_lagi_dalam_-00:15:00_untuk_mengulangi_proses_verifikasi":
          {
            id: "Silakan coba lagi dalam -00:15:00 untuk mengulangi proses verifikasi",
            en: "Please try again in -00:15:00 to repeat the verification process.",
          },
        "Snackbar/Nama_tabungan_berhasil_disimpan": {
          id: "Nama tabungan berhasil diubah",
          en: "Savings name successfully changed",
        },
        "Drawer/Verifikasi_wajah_belum_berhasil/Untuk_melanjutkan_proses_verifikasi_kamu_dapat_datang_dan_menunjukkan_nomor_verifikasi_di_bawah_ini":
          {
            id: "Untuk melanjutkan proses verifikasi, kamu dapat datang dan menunjukkan nomor verifikasi di bawah ini.",
            en: "To continue the verification process, you can come and show the verification number below.",
          },
        "Notification/Transfer_Anda_Berhasil": {
          id: "Transfer Anda Berhasil!",
          en: "Your transfer was successful!",
        },
        "Notification/Transfer_sebesar_10000_ke_ZAHRA_FADILA_ANNISA_berhasil_dilakukan":
          {
            id: "Transfer sebesar Rp10.000 ke ZAHRA FADILA ANNISA berhasil dilakukan.",
            en: "Transfer of Rp10.000 to ZAHRA FADILA ANNISA was successful.",
          },
        "Notification/18_Desember_2024": {
          id: "18 Desember 2024",
          en: "18 December 2024",
        },
        "Pre-Login/Anda_yakin_ingin_keluar_dari_Xpan_by_BSI": {
          id: "Anda yakin ingin keluar dari Xpan by BSI?",
          en: "Are you sure you want to leave Xpan by BSI?",
        },
        "Pre-Login/Setelah_keluar_Anda_harus_memasukkan_kembali_informasi_login_untuk_menggunakan_layanan_kami":
          {
            id: "Setelah keluar, Anda harus memasukkan kembali informasi login untuk menggunakan layanan kami.",
            en: "After logging out, you must re-enter your login information to use our services.",
          },
        "Drawer/Data_diri_tidak_sesuai/Pastikan_data_diri_dan_nomor_handphone_yang_kamu_isi_sudah_sesuai_lalu_coba_lagi":
          {
            id: "Pastikan data diri dan nomor handphone yang Anda isi sudah sesuai lalu coba lagi.",
            en: "Make sure the personal data and cellphone number you fill in are correct then try again.",
          },
        "Mutasi_Rekening/Multiple_Rekening/Tabungan_Saya": {
          id: "Tabungan Saya",
          en: "My Savings",
        },
        "Notifikasi/Empty_State/Tidak_ada_notifikasi": {
          id: "Tidak ada notifikasi baru",
          en: "No new notification",
        },
        "Mutasi_Rekening/Multiple_Rekening/Saldo_tertahan_50": {
          id: "Saldo tertahan Rp50.000,00",
          en: "Hold balance Rp50,000.00",
        },
        "Notifikasi/Empty_State/Notifikasi_lebih_dari_30_hari": {
          id: "Notifikasi lebih dari 30 hari akan otomatis dihapus oleh sistem.",
          en: "Notification more than 30 days will be automatically deleted by the system.",
        },
        "Snackbar/Nomor_rekening_berhasil_disalin": {
          id: "Nomor rekening berhasil disalin",
          en: "Account number copied successfully",
        },
        "Snackbar/Resi_berhasil_didownload": {
          id: "Resi berhasil didownload",
          en: "Receipt successfully downloaded",
        },
        "Snackbar/Resi_belum_berhasil_didownload": {
          id: "Resi belum berhasil didownload",
          en: "Receipt has not been successfully downloaded",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_remove": {
          id: "Hapus",
          en: "Remove",
        },
        "Notifikasi/Menu_Action_Sheet/Tandai_sudah_dibaca": {
          id: "Tandai sudah dibaca",
          en: "Mark as read",
        },
        "Transaction_Detail/Nominal": {
          id: "Nominal Transaksi",
          en: "Transaction Amount",
        },
        "Transaction_Detail/Nama_Penerima": {
          id: "Nama Penerima",
          en: "Recipient Name",
        },
        "Transaction_Detail/Catatan": {
          id: "Catatan",
          en: "Note",
        },
        "Transaction_Detail/Transaksi_Bermasalah": {
          id: "Transaksi bermasalah? Ajukan Laporan",
          en: "Troubled transaction? Submit a Report",
        },
        "Notifikasi/Notifikasi": {
          id: "Notifikasi",
          en: "Notification",
        },
        "Transaction_Detail/Detail_Transaksi": {
          id: "Detail Transaksi",
          en: "Transaction Details",
        },
        "Transaction_Detail/Nama_merchant": {
          id: "Nama Merchant",
          en: "Merchant's Name",
        },
        "Transaction_Detail/Nomor_Kartu": {
          id: "Nomor Kartu",
          en: "Card Number",
        },
        "Notifikasi/Pesan_Notifikasi/Tarik_Tunai_Via_ATM": {
          id: "Tarik tunai via ATM BSI",
          en: "Cash withdrawal via BSI ATM",
        },
        "Notifikasi/Pesan_Notifikasi/Kode_tarik_tunai_Anda_adalah_423992": {
          id: "Kode tarik tunai Anda adalah 423992 ",
          en: "Your cash withdrawal code is 423992",
        },
        "Notifikasi/Pesan_Notifikasi/Menerima_dana": {
          id: "Anda menerima dana",
          en: "Funds received",
        },
        "Notifikasi/Pesan_Notifikasi/Telah_mengirimkan_dana": {
          id: "Anita Syahni telah mengirimkan dana sebesar Rp150.000",
          en: "Anita Syahni has sent you funds of IDR 150.000",
        },
        "Notifikasi/Pesan_Notifikasi/Transfer_berhasil_(body_message)": {
          id: "Transfer sebesar Rp300.000 ke Ahmad Sofyan berhasil ",
          en: "Your transfer of IDR 300.000 to Ahmad Sofyan was successful",
        },
        "Notifikasi/Pesan_Notifikasi/Transfer_gagal_(body_message)": {
          id: "Transfer sebesar Rp300.000 ke Ahmad Sofyan belum berhasil",
          en: "Your transfer of IDR 300.000 to Ahmad Sofyan was not successful",
        },
        "Notifikasi/Pesan_Notifikasi/QRIS_transfer": {
          id: "Transaksi QRIS berhasil",
          en: "QRIS transaction was successful!",
        },
        "Notifikasi/Pesan_Notifikasi/QRIS_message": {
          id: "Transaksi QRIS senilai Rp500.000.000 pada 18-12-2024 14:10:13 berhasil",
          en: "QRIS transaction of IDR 500.000.000 at 18-12-2024 14:10:13 was successful",
        },
        "Notifikasi/Pesan_Notifikasi/Diskon": {
          id: "Diskon hingga 30%",
          en: "Discount up to 30%",
        },
        "Notifikasi/Promo_Diskon": {
          id: "Promo/Diskon",
          en: "Promo/Discount",
        },
        "Notifikasi/21_Des_2024": {
          id: "21 Des 2024",
          en: "21 Dec 2024",
        },
        "Notifikasi/Menu_Action_Sheet/Yakin_ingin_menghapus_notifikasi?": {
          id: "Yakin ingin menghapus notifikasi?",
          en: "Are you sure you want to delete notifications?",
        },
        "Snackbar/Notifkasi_berhasil_dihapus": {
          id: "Notifkasi berhasil dihapus",
          en: "Notification successfully deleted",
        },
        "Notifikasi/Menu_Action_Sheet/Yakin_hapus_notifikasi": {
          id: "Apakah Anda yakin ingin menghapus notifikasi ini?",
          en: "Are you sure to delete this notification?",
        },
        "Notifikasi/Pesan_Notifikasi/Info_Maintenance": {
          id: "Info Maintenance 10 Desember ",
          en: "Maintenance Info December 10",
        },
        "Autentikasi/Autentikasi": {
          id: "Autentikasi",
          en: "Authentication",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Autentikasi_Transaksi": {
          id: "Autentikasi Transaksi",
          en: "Transaction Authentication",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Gunakan_Xpan_Mobile": {
          id: "Gunakan Aplikasi Xpan Mobile untuk menyelesaikan transaksi Anda",
          en: "Use the Xpan Mobile App to complete your transaction",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Buka_BSI_Net_Companion_App":
          {
            id: "Buka BSI Net Companion App di ponsel Anda",
            en: "Open BSI Net Companion App on your mobile phone",
          },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Tekan_token": {
          id: "Tekan tombol Token        di area bawah aplikasi",
          en: "Tap on Token button        at the bottom of the app",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Arahkan_kamera_ponsel": {
          id: "Arahkan kamera ponsel Anda untuk scan QR Code berikut",
          en: "Point your phone camera to the following QR code",
        },
        "Notifikasi/Entry_Point/Semua_Transaksi": {
          id: "Semua Transaksi",
          en: "All Transactions",
        },
        "Notifikasi/Entry_Point/Segera_Hadir": {
          id: "Segera Hadir",
          en: "Coming Soon",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/Mengalami_kendala?_Lihat_Bantuan":
          {
            id: "Mengalami kendala? Lihat Bantuan",
            en: "Having trouble? See Help",
          },
        "Notification/Transfer_Anda_gagal": {
          id: "Transfer Anda gagal",
          en: "Your transfer failed",
        },
        "Autentikasi/Autentifikasi_Transaksi_(Pop_Up)/QR_code_berlaku": {
          id: "QR Code ini berlaku untuk 02:59",
          en: "This QR Code available for 02:59",
        },
        "Notification/Transfer_sebesar_3000000": {
          id: "Transfer sebesar Rp300.000 ke Ahmad Sofyan belum berhasil.",
          en: "Transfer of Rp300.000 to Ahmad Sofyan has not yet been successful.",
        },
        "Notification/Top_up_E-Wallet_Anda_berhasil": {
          id: "Top up E-Wallet Anda berhasil",
          en: "Your E-Wallet top up was successful.",
        },
        "Notification/Anda_menerima_dana": {
          id: "Anda menerima dana",
          en: "You received funds",
        },
        "Autentikasi/Autentikasi_QR/Autentikasi_Xpan": {
          id: "Autentikasi Xpan",
          en: "Xpan Authentication",
        },
        "Notification/Anita_Syahni_telah_mengirimkan_dana_sebesar": {
          id: "Anita Syahni telah mengirimkan dana sebesar Rp150.000",
          en: "Anita Syahni has sent funds of Rp150,000",
        },
        "Autentikasi/Autentikasi_QR/Arahkan_kamera_ke_QR": {
          id: "Arahkan kamera ke QR Code yang tertera di layar Autentikasi Transaksi Xpan Anda",
          en: "Point the camera to the QR Code on your Xpan transaction authentication screen",
        },
        "Notification/Pembayaran_Zakat_berhasil": {
          id: "Pembayaran Zakat berhasil",
          en: "Zakat payment successful",
        },
        "Notification/Pembayaran_Zakat_emas_sebesar": {
          id: "Pembayaran Zakat emas sebesar Rp500.000 ke lembaga Rumah Zakat B..",
          en: "Zakat Emas payment of IDR 500.000 to Rumah Zakat B...",
        },
        "Notification/Top_up_Gopay_sebesar": {
          id: "Top up Gopay sebesar Rp150.000 ke 086929917282 berhasil ",
          en: "Gopay top up of IDR 150.000 to 086929917282 was successful.",
        },
        "Autentikasi/Autentikasi_QR/Keamanan_akun": {
          id: "Untuk menjaga akun anda tetap aman, jangan pernah menyebarkan kode ini dengansiapapun termasuk pihak BSI.",
          en: "To keep your account safe, never share this code with anyone including BSI.",
        },
        "Notification/20_notifikasi_per_halaman": {
          id: "20 notifikasi per halaman",
          en: "20 notifications per page",
        },
        "Notification/Transaksi_QRIS_Berhasil": {
          id: "Transaksi QRIS Berhasil",
          en: "QRIS Transaction Successful",
        },
        "Notification/Transaksi_sebesar_Rp500000": {
          id: "Transaksi sebesar Rp500.000.000 pada 18-12-2024 14:10:13 dari ZAHRA FADILA ANNISA berhasil.",
          en: "Transaction of IDR 500.000.000 on 18-12-2024 14:10:13 from ZAHRA FADILA ANNISA was successful.",
        },
        "Autentikasi/Kode_Autentikasi/Kode_Autentikasi": {
          id: "Kode Autentikasi",
          en: "Authentication Code",
        },
        "Autentikasi/Kode_Autentikasi/Kode_Autentikasi_Transaksi": {
          id: "Kode Autentikasi Transaksi",
          en: "Transaction Authentication Code",
        },
        "Autentikasi/Kode_Autentikasi/masukkan_kode": {
          id: "Masukkan kode berikut untuk menyelesaikan proses transaksi Anda:",
          en: "Enter the following code to complete your transaction process:",
        },
        "Autentikasi/Kode_Autentikasi/kode_berlaku": {
          id: "Kode ini berlaku untuk",
          en: "This code available for",
        },
        "Autentikasi/Kode_Autentikasi/waktu_ketersediaan_kode": {
          id: "00:30",
          en: "00:30",
        },
        "Autentikasi/Drawer_&_Status/Berhasil": {
          id: "Alhamdulillah, autentikasi kamu sudah berhasil!",
          en: "Alhamdulillah, your authentication was succesful!",
        },
        "Autentikasi/Drawer_&_Status/Silakan_lanjutkan": {
          id: "Silakan lanjutkan aktivitas Anda di website Xpan.",
          en: "Please continue your activities on Xpan website.",
        },
        "Autentikasi/Drawer_&_Status/Kembali_Beranda": {
          id: "ke Beranda",
          en: "Back to Home",
        },
        "Autentikasi/Drawer_&_Status/Autentikasi_kadaluwarsa": {
          id: "Kode Autentikasi sudah kedaluwarsa",
          en: "Authentication code have expired",
        },
        "Notification/Diskon_hingga_30": {
          id: "Diskon hingga 30% pakai Hasanah Card",
          en: "Discount up to 30% with Hasanah Card",
        },
        "Autentikasi/Drawer_&_Status/Generate_ulang": {
          id: "Silakan Generate ulang QR code melalui website Xpan.",
          en: "Please re-generate the QR code through Xpan website.",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/Masukkan_Kode": {
          id: "Masukkan Kode Autentikasi",
          en: "Input Authentication Code",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/6_digit_kode": {
          id: "Masukkan 6 digit kode autentikasi di Xpan Companion App.",
          en: "Type 6 digit Authentication code from Xpan Companion App.",
        },
        "Notification/Semua_Informasi": {
          id: "Semua Informasi",
          en: "All Information",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/Kirim_ulang": {
          id: "Kirim ulang kode dalam",
          en: "Resend code in",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/waktu_kirim_ulang": {
          id: "02:50",
          en: "02:50",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/Kendala": {
          id: "Mengalami kendala?",
          en: "Having trouble?",
        },
        "Autentikasi/Pop_Up_Masukkan_Kode/Lihat_FAQ": {
          id: "Lihat FAQ",
          en: "See FAQ",
        },
        "Autentikasi/Drawer_&_Status/CTA_Autentikasi": {
          id: "Autentikasi Transaksi",
          en: "Authenticate Transaction",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_Delete": {
          id: "Hapus",
          en: "Delete",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_(1)": {
          id: "Hapus (1)",
          en: "Delete (1)",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_(2)": {
          id: "Hapus (2)",
          en: "Delete (2)",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_(20)": {
          id: "Hapus (20)",
          en: "Delete (20)",
        },
        "Notifikasi/Menu_Action_Sheet/Notifikasi_akan_dihapus_selamanya_dari_riwayat_Anda":
          {
            id: "Notifikasi akan dihapus selamanya dari riwayat Anda.",
            en: "Notifications will be deleted forever from your history.",
          },
        "Notification/Anda_memiliki_1_transaksi_yang_perlu_disetujui": {
          id: "Anda memiliki 1 transaksi yang perlu disetujui",
          en: "You have 1 transaction that needs approval",
        },
        "Notification/Maker_Hanugra_membuat_transaksi_Transfer": {
          id: "Maker Hanugra membuat transaksi Transfer Rp300.000 ke Ahmad Sofyan. ",
          en: "Maker Hanugra makes a transfer of Rp300.000 to Ahmad Sofyan.",
        },
        "Notifikasi/Detail_Notifikasi": {
          id: "Detail Notifikasi",
          en: "Notification Details",
        },
        "Snackbar/20_notifikasi_ditandai_sudah_dibaca": {
          id: "20 notifikasi ditandai sudah dibaca",
          en: "20 notifications marked as read",
        },
        "Autentikasi/Negative_Cases/Tidak_dikenali": {
          id: "QR code tidak dikenali",
          en: "QR code can't be recognized",
        },
        "Autentikasi/Negative_Cases/Periksa_QR": {
          id: "Mohon periksa kembali dan pastikan QR code adalah kode autentikasi transaksidari website Xpan.",
          en: "Please make sure the QR code is the transaction authentication code from Xpan website.",
        },
        "Autentikasi/Negative_Cases/QR_belum_berhasil": {
          id: "Anda belum berhasil mengunggah QR code secara berturut-turut",
          en: "You have not successfully uploaded the QR codes consecutively",
        },
        "Snackbar/2_notifikasi_berhasil_ditandai_sudah_dibaca": {
          id: "2 notifikasi berhasil ditandai sudah dibaca",
          en: "2 notifications marked as read",
        },
        "Snackbar/20_Notifikasi_berhasil_dihapus": {
          id: "20 notifikasi berhasil dihapus",
          en: "20 notifications were successfully deleted",
        },
        "Autentikasi/Negative_Cases/Autentikasi_dibekukan": {
          id: "Akses autentikasi dibekukan sementara selama",
          en: "Authentication Access is temporarily frozen for",
        },
        "Autentikasi/Negative_Cases/Durasi_dibekukan": {
          id: "15:00",
          en: "15:00",
        },
        "Autentikasi/Negative_Cases/Silakan_tunggu": {
          id: "Silakan tunggu beberapa saat.",
          en: "Please wait for some time.",
        },
        "Notifikasi/Menu_Action_Sheet/Pilih_Semua_(20)": {
          id: "Pilih Semua (20)",
          en: "Select All (20)",
        },
        "Autentikasi/Negative_Cases/Regenerate_QR": {
          id: "Generate ulang kode",
          en: "Regenerate code",
        },
        "Autentikasi/Negative_Cases/Refresh_berturut": {
          id: "Anda telah merefresh QR Code secara berturut-turut",
          en: "You have refreshed the QR codes consecutively",
        },
        "Autentikasi/Negative_Cases/Pembuatan_dibekukan": {
          id: "Pembuatan transaksi dibekukan sementara selama",
          en: "Transaction creation is temporarily frozen for ",
        },
        "Autentikasi/Negative_Cases/tidak_sesuai": {
          id: "Kode Autentikasi tidak sesuai. Cek kembali kode yang Anda terima dan coba lagi.",
          en: "The authentication code does not match. Recheck the code you have received and try again.",
        },
        "Favorite_Menu/Tujuan_favorit": {
          id: "Tujuan Favorit",
          en: "Favorite Destination",
        },
        "Favorite_Menu/List_Penerima": {
          id: "List Penerima",
          en: "Recipient List",
        },
        "Favorite_Menu/Atur_widget": {
          id: "Atur Widget",
          en: "Manage Widget",
        },
        "Favorite_Menu/Ubah_edit": {
          id: "Ubah",
          en: "Edit",
        },
        "Favorite_Menu/Favorit_kosong/Masih_kosong": {
          id: "Tujuan favorit anda masih kosong",
          en: "Your favorite destination is empty",
        },
        "Favorite_Menu/Favorit_kosong/Tambah_Tujuan": {
          id: "Tambahkan Tujuan Favorit di halaman transfer",
          en: "Add favorite destination on the transfer page",
        },
        "Favorite_Menu/Favorit_kosong/CTA_Tujuan": {
          id: "Tambah Tujuan Favorit",
          en: "Add Favorite Destination",
        },
        "Favorite_Menu/Edit_Alias/Ubah_Favorit": {
          id: "Ubah Favorit",
          en: "Edit Favorite",
        },
        "Favorite_Menu/Edit_Alias/Rekening_Tujuan": {
          id: "Nomor Rekening Tujuan",
          en: "Destination Account Number",
        },
        "Favorite_Menu/Edit_Alias/Alias": {
          id: "Nama Alias (Opsional)",
          en: "Alias (Optional)",
        },
        "Favorite_Menu/Edit_Alias/Simpan_perubahan": {
          id: "Simpan Perubahan",
          en: "Save Changes",
        },
        "Favorite_Menu/Edit_Alias/Hapus_favorit": {
          id: "Hapus dari Favorit",
          en: "Delete from Favorite",
        },
        "Favorite_Menu/Edit_Alias/Hapus_tujuan": {
          id: "Hapus tujuan favorit?",
          en: "Delete favorite destination?",
        },
        "Favorite_Menu/Edit_Alias/Yakin_Hapus": {
          id: "Rekening tujuan ini akan dihapus, Anda dapat menambahkannya kembali di halaman transfer. Yakin untuk hapus?",
          en: "This account number will be deleted, you can add it back again on the transfer page. Proceed to deletion?",
        },
        "Favorite_Menu/Edit_Alias/Berhasil_mengubah": {
          id: "Berhasil Mengubah Favorit",
          en: "Successfuly Edit Favorite",
        },
        "Favorite_Menu/Edit_Alias/rekening_dihapus": {
          id: "Rekening dihapus dari daftar Tujuan Favorit",
          en: "Account number have been deleted from favorite  destination",
        },
        "Favorite_Menu/Search/Name_not_found": {
          id: "Nama alias tidak ditemukan",
          en: "Alias not found",
        },
        "Favorite_Menu/Search/Gunakan_lain": {
          id: "Gunakan kata kunci lain atau mulai bertransaksi dengan mengetikkan Nomor Rekening atau Proxy tujuan.",
          en: "Try other keywords or start a transaction by typing in the Account Number or Proxy destination.",
        },
        "Favorite_Menu/Search/Belum_terdaftar": {
          id: "Nomor rekening belum terdaftar di tujuan favorit",
          en: "The account number has not been registered in favorite destination",
        },
        "Favorite_Menu/Search/Tambahkan": {
          id: "Tambahkan",
          en: "Add",
        },
        "Favorite_Menu/Search/7200099997": {
          id: "7200099997",
          en: "7200099997",
        },
        "Favorite_Menu/Search/tujuan_baru": {
          id: " ke tujuan baru untuk memulai transaksi.",
          en: "as new destination to start a transaction.",
        },
        "Favorite_Menu/Search/CTA_Tujuan_Baru": {
          id: "Tambah ke Tujuan Baru",
          en: "Add New Destination",
        },
        "Favorite_Menu/Atur_Widget/Atur_Widget_Dashboard": {
          id: "Atur Widget Dashboard",
          en: "Manage Dashboard Widget",
        },
        "Favorite_Menu/Atur_Widget/Tampilan_widget": {
          id: "Tampilan Widget Anda",
          en: "Your Widget View",
        },
        "Favorite_Menu/Atur_Widget/Tahan_tarik": {
          id: "Tahan & tarik untuk mengubah penerima",
          en: "Drag & drop to change recipient",
        },
        "Favorite_Menu/Atur_Widget/Terisi_otomatis": {
          id: "Widget terisi otomatis sesuai Favorit",
          en: "Widget automatically filled according to favorite",
        },
        "Favorite_Menu/Atur_Widget/Nama_dalam_widget": {
          id: "Nama dalam daftar widget tidak dapat dipindahkan ke daftar penerima.",
          en: "Names in the widget list cannot be moved to the recipient list.",
        },
        "Transfer:_Buat_tujuan_&_favorit/tambah_tujuan/daftar_rekening_kosong":
          {
            id: "Daftar rekening anda masih kosong",
            en: "Your account list is still empty",
          },
        "Transfer:_Buat_tujuan_&_favorit/tambah_tujuan/buat_tujuan_baru": {
          id: "Buat tujuan baru dengan memasukkan Nomor Rekening atau Proxy tujuan penerima",
          en: "Create a new destination by entering the Account Number or Proxy of the recipient destination.",
        },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/tambah_tujuan_baru":
          {
            id: "Tambah Tujuan Baru",
            en: "Add New Destination",
          },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/bank_tujuan": {
          id: "Bank Tujuan",
          en: "Destination Bank",
        },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/nomor_rekening_tujuan":
          {
            id: "Nomor Rekening Tujuan",
            en: "Destination Bank Account",
          },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/Konfirmasi_tujuan":
          {
            id: "Konfirmasi Tujuan",
            en: "Confirm Destination",
          },
        "Transfer:_Buat_tujuan_&_favorit/Pencarian/kata_kunci_tidak_ditemukan":
          {
            id: "Kata kunci tidak ditemukan",
            en: "Keyword not found",
          },
        "Transfer:_Buat_tujuan_&_favorit/Pencarian/Gunakan_kata_kunci_lain": {
          id: "Gunakan kata kunci lain atau mulai bertransaksi dengan mengetikkan Nomor Rekening atau Proxy tujuan",
          en: "Try using other keyword or start a transaction by typing an account number or destination proxy",
        },
        "Transfer:_Buat_tujuan_&_favorit/Pencarian/Nomor_rekening_belum_ada": {
          id: "Nomor rekening belum ada di daftar tujuan Anda",
          en: "The account number is not on your destination list yet",
        },
        "Notifikasi/Menu_Action_Sheet/Hapus_(10)": {
          id: "Hapus (10)",
          en: "Delete (10)",
        },
        "Snackbar/10_Jadwal_berhasil_dihapus": {
          id: "10 jadwal berhasil dihapus",
          en: "10 schedule successfully deleted",
        },
        "Transfer:_Buat_tujuan_&_favorit/chips/tujuan_transfer": {
          id: "Tujuan Transfer",
          en: "Transfer Destination",
        },
        "Transfer:_Buat_tujuan_&_favorit/chips/detail_transfer": {
          id: "Detail Transfer",
          en: "Transfer Details",
        },
        "Transfer:_Buat_tujuan_&_favorit/chips/Periksa_detail": {
          id: "Periksa Detail",
          en: "Check Details",
        },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/pilih_bank_tujuan":
          {
            id: "Pilih bank tujuan",
            en: "Select destination bank",
          },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/Masukkan_rekening":
          {
            id: "Masukkan rekening tujuan",
            en: "Enter destination account",
          },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/Detail_tujuan": {
          id: "Detail Tujuan",
          en: "Destination Details",
        },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/Masukkan_Alias": {
          id: "Masukkan Alias",
          en: "Enter Alias",
        },
        "Transfer:_Buat_tujuan_&_favorit/Snackbar_&_Tooltip/rekening_tersimpan_sebagai_favorit":
          {
            id: "Rekening tersimpan sebagai rekening favorit",
            en: "Account saved as favorite account",
          },
        "Transfer:_Buat_tujuan_&_favorit/Snackbar_&_Tooltip/rekening_dihapus_dari_favorit":
          {
            id: "Rekening dihapus dari daftar Rekening Favorit",
            en: "Account deleted from favorite account",
          },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/Hapus_dari_favorit":
          {
            id: "Hapus dari Favorit",
            en: "Delete from Favorite",
          },
        "Transfer:_Buat_tujuan_&_favorit/Snackbar_&_Tooltip/Simpan_ke_favorite":
          {
            id: "Simpan ke favorit",
            en: "Save to favorite",
          },
        "Transfer:_Buat_tujuan_&_favorit/detail_input/450_juta": {
          id: "Rp450.000.000,00",
          en: "IDR 450.000.000,00",
        },
        "Transfer:_Buat_tujuan_&_favorit/Tambah_tujuan_baru/tambah_rekening_favorit":
          {
            id: "Tambah ke Rekening Favorit",
            en: "Add to Favorite Account",
          },
        "Transfer:_Buat_tujuan_&_favorit/ubah_tujuan": {
          id: "Ubah Tujuan",
          en: "Change Destination",
        },
        "Transfer:_Buat_tujuan_&_favorit/hapus_favorit": {
          id: "Hapus Favorit",
          en: "Delete Favorite",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/BI_Fast_2500": {
          id: "BI Fast (+Rp2.500)",
          en: "BI Fast (+IDR 2.500)",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Online_6500": {
          id: "Online (+Rp6.500)",
          en: "Online (+IDR 6.500)",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/RTGS_25000": {
          id: "RTGS (+Rp25.000)",
          en: "RTGS (+IDR 25.000)",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/SKN-2900": {
          id: "SKN (+Rp2.900)",
          en: "SKN (+IDR 2.900)",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Nominal_BI": {
          id: "Nominal transfer: Rp10.000 - Rp250.000.000 Langsung diproses dan diterima ",
          en: "Transfer amount: IDR 10.000 - IDR 250.000.000 Immediately processed and received",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Nominal_Online": {
          id: "Nominal transfer: Rp10.000 - Rp50.000.000 Langsung diproses dan diterima ",
          en: "Transfer amount: IDR 10.000 - IDR 50.000.000 Immediately processed and received",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Nominal_RTGS": {
          id: "Nominal transfer: Rp100.000.001 - Rp500.000.000 Operasional: Senin-Jumat jam 08:00 - 15:25Transaksi di luar waktu tersebut akan diproses di hari kerja berikutnya",
          en: "Transfer amount: IDR 100.000.001 - IDR 500.000.000 Operation: Monday-Friday 08:00 -15:25. Transactions outside of these times will be processed on the next business day.",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Nominal_SKN": {
          id: "Nominal transfer: Rp10.000 - Rp200.000.000 Operasional: Senin-Jumat jam 08:00 - 13:45Transaksi di luar waktu tersebut akan diproses di hari kerja berikutnya",
          en: "Transfer amount: IDR 10.000 - IDR 200.000.000 Operation: Monday-Friday 08:00 -13:45. Transactions outside of these times will be processed on the next business day.",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/pilih_metode_transfer":
          {
            id: "Pilih Metode Transfer",
            en: "Select Transfer Method",
          },
        "Transfer:_Buat_tujuan_&_favorit/top_up_tabungan": {
          id: "Silakan top-up dan pastikan saldo tabungan anda cukup untuk melakukan transaksi ini.",
          en: "Please top-up and make sure your savings balance is sufficient for this transaction.",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Tidak_tersedia_untuk_bank":
          {
            id: "Tidak tersedia untuk bank tujuan yang dipilih.",
            en: "Not available for the selected destination.",
          },
        "TF_Sesama_BSI/ubah_detail": {
          id: "Ubah Detail",
          en: "Change Detail",
        },
        "TF_Sesama_BSI/ubah_tujuan": {
          id: "Ubah Tujuan",
          en: "Change Destination",
        },
        "TF_Sesama_BSI/70_juta": {
          id: "Rp70.000.000,00",
          en: "IDR 70.000.000,00",
        },
        "TF_Sesama_BSI/transaksi_bermasalah": {
          id: "Transaksi bermasalah?",
          en: "Troubled transaction?",
        },
        "TF_Sesama_BSI/pindah_halaman/pindah_halaman": {
          id: "Pindah Halaman",
          en: "Leave Page",
        },
        "Transfer:_Buat_tujuan_&_favorit/Metode_Transfer/Tidak_tersedia_untuk_Rekening_BI-Fast_Proxy":
          {
            id: "Tidak tersedia untuk Rekening BI-Fast Proxy.",
            en: "Not available for BI-Fast Proxy Accounts.",
          },
        "TF_Sesama_BSI/Isi_nominal_transfer": {
          id: "Isi nominal transfer terlebih dahulu ",
          en: "Please fill in the transfer amount",
        },
        "TF_Sesama_BSI/2500_admin_BI": {
          id: "Rp2.500",
          en: "IDR 2.500",
        },
        "TF_Sesama_BSI/BI_70_002_500": {
          id: "Rp70.002.500",
          en: "IDR 70.002.500",
        },
        "Activation/Pilih_Peran_Pengguna": {
          id: "Pilih Peran Pengguna",
          en: "Select User Role",
        },
        "Activation/Pilih_peran_Anda_untuk_melanjutkan_aktivasi_Xpan": {
          id: "Pilih peran Anda untuk melanjutkan aktivasi Xpan.",
          en: "Select your role to continue Xpan activation.",
        },
        "Activation/Menyetujui_pengajuan_dari_Maker_dan_melakukan_transaksi": {
          id: "Menyetujui pengajuan dari Maker dan melakukan transaksi.",
          en: "Approve submissions from Maker and perform transactions.",
        },
        "Activation/Mengajukan_transaksi_untuk_disetujui_oleh_Owner": {
          id: "Mengajukan transaksi untuk disetujui oleh Owner.",
          en: "Submit transactions for approval by the Owner.",
        },
        "Activation/Selamat_Datang_di_Xpan_by_BSI_sebagai_Maker": {
          id: "Selamat Datang di Xpan by BSI sebagai Maker",
          en: "Welcome to Xpan by BSI as Maker",
        },
        "Activation/Silakan_masukkan_nomor_HP_dan_User_ID_yang_sudah_daftarkan":
          {
            id: "Silakanmasukkan nomor HP dan User ID yang sudah Anda daftarkan.",
            en: "Please enter the mobile number and User ID that you have registered.",
          },
        "TF_Sesama_BSI/6500_admin_Online": {
          id: "Rp6.500",
          en: "IDR 6.500",
        },
        "TF_Sesama_BSI/Online_70_006_500": {
          id: "Rp70.006.500",
          en: "IDR 70.006.500",
        },
        "TF_Sesama_BSI/25000_admin_RTGS": {
          id: "Rp25.000",
          en: "IDR 25.000",
        },
        "TF_Sesama_BSI/RTGS_70_025_000": {
          id: "Rp70.025.000",
          en: "IDR 70.025.000",
        },
        "TF_Sesama_BSI/2900_admin_SKN": {
          id: "Rp2.900",
          en: "IDR 2.900",
        },
        "TF_Sesama_BSI/SKN_70_002_900": {
          id: "Rp70.002.900",
          en: "IDR 70.002.900",
        },
        "Email_Notifikasi/Footer_Email/Terima_kasih_telah_menggunakan_layanan_BSI_Net_dari_Bank_Syariah_Indonesia":
          {
            id: "Terima kasih telah menggunakan layanan BSI Net dari Bank Syariah Indonesia. Semoga layanan kami mendatangkan manfaat bagi anda.",
            en: "Thank you for using the BSI Net service from Bank Syariah Indonesia. Hopefully our services will benefit you.",
          },
        "TF_Sesama_BSI/0": {
          id: "Rp0",
          en: "IDR 0",
        },
        "TF_Sesama_BSI/Rp": {
          id: "Rp",
          en: "IDR",
        },
        "TF_Sesama_BSI/180_ratus_juta": {
          id: "Rp180.000.000",
          en: "IDR 180.000.000",
        },
        "TF_Sesama_BSI/10_juta": {
          id: "Rp10.000.000",
          en: "IDR 10.000.000",
        },
        "TF_Sesama_BSI/Autentikasi_Transaksi": {
          id: "Autentikasi Transaksi",
          en: "Transaction Authentication",
        },
        "TF_Sesama_BSI/Masukkan_kode_verifikasi_xpan": {
          id: "Masukkan kode verifikasi yang terteradi Xpan Mobile Anda.",
          en: "Enter the verification code shown on your Xpan Mobile.",
        },
        "TF_Sesama_BSI/4_juta_5_ratus": {
          id: "Rp4.500.000",
          en: "IDR 4.500.000",
        },
        "TF_Sesama_BSI/Buat_transfer_baru": {
          id: "Buat Transfer Baru",
          en: "Create New Transfer",
        },
        "TF_Sesama_BSI/12_juta_400": {
          id: "Rp12.405.550",
          en: "IDR 12.405.550",
        },
        "TF_Sesama_BSI/200_juta_400": {
          id: "Rp202.405.550",
          en: "IDR 202.405.550",
        },
        "TF_Sesama_BSI/1_juta_500": {
          id: "Rp1.500.000",
          en: "IDR 1.500.000",
        },
        "TF_Sesama_BSI/250_ribu": {
          id: "Rp250.000",
          en: "IDR 250.000",
        },
        "TF_Sesama_BSI/400_juta": {
          id: "Rp400.000.000",
          en: "IDR 400.000.000",
        },
        "TF_Sesama_BSI/30000_admin": {
          id: "Rp30.000",
          en: "IDR 30.000",
        },
        "TF_Sesama_BSI/170_juta_30_ribu": {
          id: "Rp170.030.000",
          en: "IDR 170.030.000",
        },
        "Activation/Syarat_dan_Ketentuan": {
          id: "Syarat dan Ketentuan",
          en: "Terms and Conditions",
        },
        "Activation/Aktivasi_Aplikasi_Xpan_by_BSI_Berhasil": {
          id: "Aktivasi Aplikasi Xpan by BSI Berhasil!",
          en: "Xpan by BSI App Activation Successful!",
        },
        "Email_Notifikasi/Verifikasi_Email/User_ID_Aktivasi_Xpan": {
          id: "User ID Aktivasi Xpan",
          en: "Xpan Activation User ID",
        },
        "Drawer/Tedeteksi_di_device_lain/Anda_terdeteksi": {
          id: "Anda terdeteksi menggunakan perangkat lain",
          en: "You are logged in on another device",
        },
        "Drawer/Tedeteksi_di_device_lain/Anda_telah_melakukan_aktivasi": {
          id: "Anda baru saja aktivasi di perangkat lain, harap lakukan proses masuk dari awal",
          en: "You just logged in on another device, please re-login to continue here",
        },
        "TF_Sesama_BSI/70_juta_2": {
          id: "Rp70.000.000",
          en: "IDR 70.000.000",
        },
        "Activation/Buat_password_baru/Demi_keamanan_silakan_buat_password_baru_untuk_login":
          {
            id: "Demi keamanan, silakan buat password baru untuk login ke akun Xpan by BSI Anda.",
            en: "For security reasons, please create a new password to login to your Xpan by BSI account.",
          },
        "Activation/Buat_password_baru/Buat_Password_Baru": {
          id: "Buat Password Baru",
          en: "Create a New Password",
        },
        "Drawer/Data_diri_tidak_sesuai/Nomor_hp_tidak_sesuai": {
          id: "Nomor handphone yang Anda masukkan tidak sesuai",
          en: "Phone number does not match",
        },
        "Drawer/Data_diri_tidak_sesuai/Pastikan_nomor_handphone_sesuai": {
          id: "Pastikan nomor handphone sesuai dengan yang Anda daftarkan lalu coba lagi",
          en: "Make sure to enter the phone number you registered",
        },
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

router.post("/get-phoneNumber", async (req, res) => {
  try {
    const { username } = req.body;

    await delay(550);

    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store",
    });

    if (username === "Victoria01") {
      return res.status(200).json(
        createSuccessResponse({
          phoneNumber: "6123123423123",
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
