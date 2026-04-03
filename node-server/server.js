const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
let adminSettings = {
  festival: 0,
  curfew: 0,
  salary: 0
};

app.use(cors());
app.use(express.json());
app.post("/admin/update", (req, res) => {
  const { festival, curfew, salary} = req.body;

  // store values
  adminSettings.festival = Number(festival);
  adminSettings.curfew = Number(curfew);
  adminSettings.salary = Number(salary); 
  console.log("Admin updated:", adminSettings);

  res.json({
    message: "Updated successfully",
    adminSettings
  });
});

app.post("/predict", async (req, res) => {
  try {
    const features = req.body;

    // Inject admin values
    features.festival = adminSettings.festival;
    features.curfew = adminSettings.curfew;
    features.salary = adminSettings.salary
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      features
    );

    
    const riskScore = response.data.risk_score;
    console.log(riskScore);
    let premium = 0;

    if (riskScore <= 0.3) {
      premium = 100;
    } else if (riskScore <= 0.8) {
      premium = 400;
    } else {
      premium = 700;
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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
app.get("/getPremium", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      {
        hours: 8,
        distance: 20,
        risk: 2,
      }
    );

    res.json({ premium: response.data.premium });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed" });
  }
});