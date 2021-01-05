var express = require("express");
var app = express();
app.use(express.static("../cv"));
app.listen(3000);