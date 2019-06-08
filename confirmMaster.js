const fs = require("fs");

fs.readFile("master/master.json", (err, data) => {
  const items = JSON.parse(data.toString());
  console.log("TCL: items", items.length);
});
