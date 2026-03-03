const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Store latest reading
let latestData = {
    temperature: 0,
    humidity: 0,
    time: "--"
};

// Create CSV with header if not exists
if (!fs.existsSync("data.csv")) {
    fs.writeFileSync("data.csv", "Timestamp,Temperature,Humidity\n");
}

/* ===============================
   RECEIVE DATA FROM ESP32
================================= */
app.post("/data", (req, res) => {

    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    const timestamp = new Date().toISOString();

    latestData = {
        temperature,
        humidity,
        time: new Date().toLocaleTimeString()
    };

    const line = `${timestamp},${temperature},${humidity}\n`;

    fs.appendFile("data.csv", line, (err) => {
        if (err) console.error("CSV Write Error:", err);
    });

    console.log("Logged:", latestData);

    res.status(200).json({ message: "Stored successfully" });
});

/* ===============================
   SEND LATEST DATA
================================= */
app.get("/latest", (req, res) => {
    res.json(latestData);
});

/* ===============================
   SEND LAST 5 READINGS
================================= */
app.get("/history", (req, res) => {

    fs.readFile("data.csv", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read CSV" });
        }

        const lines = data.trim().split("\n");
        lines.shift(); // remove header

        const lastFive = lines.slice(-5).reverse();

        const result = lastFive.map(line => {
            const [timestamp, temperature, humidity] = line.split(",");
            return { timestamp, temperature, humidity };
        });

        res.json(result);
    });
});

/* ===============================
   START SERVER
================================= */
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});