const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const eventRoute = require("./routes/event");
const { connect } = require("./db/dbconfig");
const cookieParser = require("cookie-parser");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


app.use(express.static("assets"));

app.use(express.static('public'));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/user/login", (req, res) => {
  res.render("login", { message: null });
});
app.get("/user/register", (req, res) => {
  res.render("register", { message: null });
});
app.get("/profile", (req, res) => {
  res.render("profile", { message: null });
})
app.get("/events", (req, res) => {
  res.render("event", { message: null });
})




app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.listen(3000, () => {
  connect();
  console.log("listening on port 3000");
});
