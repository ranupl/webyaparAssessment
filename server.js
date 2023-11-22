const express = require("express");
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    console.log("i am called");
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:/${PORT}`);
})