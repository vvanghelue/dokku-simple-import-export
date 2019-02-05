const fs = require("fs")
const fsPromises = fs.promises

const listDir = async (path) => {
  try {
    return await fsPromises.readdir(path, { withFileTypes: true })
  } catch (err) {
    return null
  }
};

(async () => {
  const directoryItems = await listDir('.')
  const apps = []

  for (directoryItem of directoryItems) {
    if (directoryItem.isDirectory() && directoryItem.name[0] !== ".") {
      const app = { name: directoryItem.name }

      const vhostDATA = await (await fsPromises.readFile(
        `${directoryItem.name}/VHOST`
      )).toString()
      app.VHOST = vhostDATA

      const envDATA = await (await fsPromises.readFile(
        `${directoryItem.name}/ENV`
      )).toString()
      app.ENV = envDATA

      const nginxConfFiles = await listDir(`./${directoryItem.name}/nginx.conf.d/`)

      app.nginx_files = {}  
      if (nginxConfFiles) {
        for (const confFile of nginxConfFiles) {
          const content = await (await fsPromises.readFile(
            `./${directoryItem.name}/nginx.conf.d/${confFile.name}`
          )).toString()
          app.nginx_files[confFile.name] = content
        }
      }
      apps.push(app)
    }
  }

  await fsPromises.writeFile("dokku.dump.json", JSON.stringify(apps))

  console.log("Done. dokku_dump.json created.")
  console.log(`Please go to your new server and run these commands :`)
  for (app of apps) {
    console.log(`dokku apps:create ${app.name}`)
  }
  console.log("")
})();
