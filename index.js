const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ReplitDB = require("@replit/database");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const app = express();
const db = new ReplitDB();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const authenticateToken = (req, res, next) => {
    const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin_login.html"));
});

app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await db.get("admin");

    if (admin && admin.username === username && admin.password === password) {
        const token = jwt.sign({ username: admin.username }, SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: "用戶名或密碼錯誤" });
    }
});

app.get("/auras", authenticateToken, async (req, res) => {
    const auras = await db.get("auras");
    res.status(200).json(auras);
});

app.post("/auras", authenticateToken, async (req, res) => {
    const { name, rarity } = req.body;
    const auras = (await db.get("auras")) || {};
    auras[name] = rarity;
    await db.set("auras", auras);
    res.status(201).json({ message: "光環已添加" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
