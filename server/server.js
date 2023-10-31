const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware to parse JSON requests

app.use(cors()); // Middleware to allow cross-origin requests

// Proxy endpoint
app.post("/proxy", async (req, res) => {
  try {
    const response = await axios.post(
      "https://eth-goerli.g.alchemy.com/v2/REACT_APP_ALCHEMY_API_KEY",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
