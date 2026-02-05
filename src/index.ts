import express from "express";

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Hello from TypeScript Express!" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
