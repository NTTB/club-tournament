const { readFile, writeFile } = require("fs/promises");

async function main() {
  var contentBuffer = await readFile("./public/index.html");
  var content = contentBuffer.toString();

  var regex = /(href|src)=['"](.+)['"]/g;
  var final = content.replace(regex, (_, attributeName, sub) => {
    return attributeName + "=\'" + `/clubtoernooi` + sub + "\'";
  });

  writeFile("./public/index.html", final);

  console.log(final);
}

main().then().catch(err => console.error(err));