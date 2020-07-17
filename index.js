require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

const API_KEY = process.env.API_KEY;
console.log(API_KEY);
const DOMAIN = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

app.get("/", (req, res) => {
  res.status(200).json({ message: "ok serveur up" });
});

app.post("/form", (req, res) => {
  // Destructuring pour récupérer les données de la requête
  const { firstname, lastname, email, subject, message } = req.fields;

  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "tom.perrau94@hotmail.fr",
    subject: subject,
    text: message,
  };

  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
