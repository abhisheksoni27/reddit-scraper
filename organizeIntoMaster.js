const fs = require("fs");

const concatenatedCategories = [];

let totalPosts = 0;

fs.readdir("categories", (err, files) => {
  files.forEach((file, index) => {
    const categoryName = file.split(".")[0];
    const data = fs.readFileSync(`categories/${file}`);
    const jsonData = JSON.parse(data.toString());

    jsonData.forEach(item => {
      item["label"] = categoryName;
    });

    concatenatedCategories.push(...jsonData);
    totalPosts += jsonData.length;
  });
  console.log("TCL: concatenatedCategories", concatenatedCategories.length);
  console.log("TCL: totalPosts", totalPosts);
  fs.writeFile(
    `master/master.json`,
    JSON.stringify(concatenatedCategories),
    () => {}
  );
});
