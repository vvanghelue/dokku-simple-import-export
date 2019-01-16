const fs = require("fs");
const fsPromises = fs.promises;

const listDir = async () => {
  try {
    return await fsPromises.readdir(".", { withFileTypes: true });
  } catch (err) {
    console.error("Error occured while reading directory!", err);
  }
};

(async () => {
  const directoryItems = await listDir();
  const apps = [];

  for (directoryItem of directoryItems) {
    if (directoryItem.isDirectory() && directoryItem.name[0] !== ".") {
      const app = { name: directoryItem.name };

      const vhostDATA = await (await fsPromises.readFile(
        `${directoryItem.name}/VHOST`
      )).toString();

      const envDATA = await (await fsPromises.readFile(
        `${directoryItem.name}/ENV`
      )).toString();

      app.VHOST = vhostDATA;
      app.ENV = envDATA;
      apps.push(app);
    }
  }

  await fsPromises.appendFile("dokku_dump.json", JSON.stringify(apps));

  console.log("Done. dokku_dump.json created.");
  console.log(`Please go to your new server and run these commands :`);
  for (app of apps) {
    console.log(`dokku apps:create ${app.name}`);
  }
  console.log("");
})();
