const fs = require("fs");
const fsPromises = fs.promises;
const { exec } = require("child_process");

const asyncExec = command => {
  return new Promise(resolve => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
};

const dumpFile = process.argv[2];
const dokkuFolder = process.argv[3] || "/home/dokku";

(async () => {
  const apps = JSON.parse(
    await (await fsPromises.readFile(`${dumpFile}`)).toString()
  );

  for (app of apps) {
    console.log(`Importing ${app.name}...`);

    if (false /* for dev purpose */) {
      await asyncExec(`dokku apps:create ${app.name}`);
    }

    await fsPromises.appendFile(`${dokkuFolder}/${app.name}/ENV`, app.ENV);
    await fsPromises.appendFile(`${dokkuFolder}/${app.name}/VHOST`, app.VHOST);
  }
  console.log("Done.");
})();
