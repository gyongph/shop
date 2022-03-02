const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const db = require("../dataInterfaces/Users");

router.post("/registration", (req, res) => {
  db.register(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((mongoError) => {
      let error;
      if (mongoError?.keyPattern?.username)
        error = "Username is already taken.";
      if (mongoError?.keyPattern?.contact)
        error = "Phone number is already taken.";
      res.status(500).send({ error, mongoError });
    });
});

router.post("/login", async ({ patch }, res) => {
  db.login(patch)
    .then(({ accessToken, userData }) => {
      res.status(200).send({ userData, accessToken });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/information", (req, res) => {
  db.getInfo(req.userData._id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.patch("/information", ({ patch }, res) => {
  db.updateInfo(patch)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/feed", async (req, res) => {
  db.getFeed(req.userData._id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/logout", (req, res) => {
  res.cookie(
    "accessToken",
    { data: "deleted" },
    {
      sameSite: "none",
      secure: true,
      maxAge: -10, //10days
    }
  );
  res.sendStatus(200);
});

module.exports = router;
