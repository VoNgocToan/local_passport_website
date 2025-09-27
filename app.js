const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const MongoStore = require("connect-mongo");

const app = express();

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/passportAuth");

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: "mysecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/passportAuth", // 👈 session lưu trong DB này
            collectionName: "sessions" // 👈 tên collection lưu session
        }),
        cookie: { maxAge: 1000 * 60 * 60 } // 1 giờ
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

require("./config/passport")(passport);

// Routes
app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.redirect("/login"); // hoặc res.send("Welcome to homepage!");
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));