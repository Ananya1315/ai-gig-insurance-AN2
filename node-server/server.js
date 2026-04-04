const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const app = express();
let adminSettings = {
  festival: 0,
  curfew: 0
};

app.use(cors());
app.use(express.json());
app.post("/admin/update", (req, res) => {
  adminSettings = req.body;
  console.log("Updated Admin:", adminSettings);
  res.json({ success: true });
});
app.post("/upload-payslip", upload.single("file"), async (req, res) => {
  try {
    console.log("REQ FILE:", req.file); // 🔥 ADD THIS

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();

    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://127.0.0.1:5000/extract-salary",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "OCR failed" });
  }
});
app.post("/predict", async (req, res) => {
  try {
    const features = req.body;
    console.log("Features:",features)
    // Inject admin values
    features.festival = adminSettings.festival;
    features.curfew = adminSettings.curfew;
    //features.salary = adminSettings.salary
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      features
    );
    console.log("response:",response.data);
    
    const riskScore = response.data.risk_score;
    console.log("Risk score:",riskScore);
    let premium = 0;

    if (riskScore <= 0.4) {
      premium = 15;
    } else if (riskScore <= 0.8) {
      premium = 35;
    } else {
      premium = 50;
    }
console.log("premium :",premium)
res.json({ premium });

  } catch (error) {
    res.status(500).json({ error: "Flask connection failed" });
  }
});
app.get("/admin", (req, res) => {
  res.json(adminSettings);
});

app.listen(3000, () => {
  console.log("Node server running on port 3000");
});