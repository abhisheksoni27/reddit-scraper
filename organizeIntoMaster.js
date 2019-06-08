const fs = require("fs");

const concatenatedCategories = [];

let totalPosts = 0;

fs.readdir("categories", (err, files) => {
  files.forEach((file, index) => {
    const categoryName = file.split(".")[0];
    fs.readFile(`categories/${file}`, (err, data) => {
      const jsonData = JSON.parse(data.toString());

      jsonData.forEach(item => {
        item["label"] = categoryName;
      });

      concatenatedCategories.push(...jsonData);
      totalPosts += jsonData.length;

      if (index === files.length - 1) {
        console.log(
          "TCL: concatenatedCategories",
          concatenatedCategories.length
        );
        console.log("TCL: totalPosts", totalPosts);
        fs.writeFile(
          `master/master.json`,
          JSON.stringify(concatenatedCategories),
          () => {}
        );
      }
      // fs.writeFile(`categories/${file}`, JSON.stringify(jsonData), ()=>{});
    });
  });
});
