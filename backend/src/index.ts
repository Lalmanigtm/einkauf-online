import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const port = process.env.PORT;
app.listen(3000, () => {
  console.log(`Example app listening on port : 3000`);
});
