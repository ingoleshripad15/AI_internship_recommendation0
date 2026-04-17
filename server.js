const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

//to run the system 1. terminal-uvicorn ml_api:app --host 0.0.0.0 --port 8001 & 2. terminal- node server.js


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, "static")));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abc123",
    database: "internship_db2"
});

db.connect((err) => {
    if (err) {
        console.log("DB ERROR:", err);
    } else {
        console.log("MySQL Connected ✅");
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "new_home_page_react.html"));
});

// LOGIN 
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const checkUser = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(checkUser, [email, password], (err, result) => {
        if (err) return res.send({ error: err });

        if (result.length > 0) {
            req.session.user = email;
            return res.redirect("/new_details_page_react.html");
        } else {
            const insertUser = "INSERT INTO users (email, password) VALUES (?, ?)";
            db.query(insertUser, [email, password], (err) => {
                if (err) return res.send({ error: err });

                req.session.user = email;
                return res.redirect("/new_details_page_react.html");
            });
        }
    });
});


app.get("/check-session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


app.post("/recommend", async (req, res) => {

    const email = req.session.user;

    if (!email) {
        return res.redirect("/new_home_page_react.html");
    }

    let { domain, skills, education, location, mode } = req.body;

    domain = domain ? domain.split(",").join(" ") : "";
    skills = skills ? skills.split(",").join(" ") : "";

    const insertHistory = `
        INSERT INTO user_history (domain, skills, location, mode, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertHistory, [domain, skills, location, mode, email], async (err) => {

        const query = `${domain} ${domain} ${skills} ${skills} ${education}`;

        try {
            // FIXED AXIOS CALL
            const mlResponse = await axios.post(
                "http://localhost:8001/ml",
                { query: query },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            let results = mlResponse.data;

            if (location && location !== "Any") {
                results = results.filter(r => r.location === location);
            }

            if (mode && mode !== "Any") {
                results = results.filter(r => r.mode === mode);
            }

            res.json(results);

        } catch (error) {
    console.log("====== AXIOS ERROR START ======");
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("HEADERS:", error.response?.headers);
    console.log("MESSAGE:", error.message);
    console.log("====== AXIOS ERROR END ======");

    res.send({ error: "ML Server Error" });
}
    });
});
//SERVER 
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000 🚀");
});