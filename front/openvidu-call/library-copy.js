const fs = require('fs-extra');

const mainComponentDest = './projects/openvidu-session/src/lib/openvidu-session.component.ts';
const videoRoomDest = './projects/openvidu-session/src/lib/video-room/';
const routeDest = './projects/openvidu-session/src/lib/app-routing.module.ts';
const sharedDest = './projects/openvidu-session/src/lib/shared/';
const environmentDest = './projects/openvidu-session/src/lib/environments/';

async function copyFiles() {

  try {

    await fs.copy('./src/app/video-room/', videoRoomDest);
    await fs.copy('./src/app/app-routing.module.ts', routeDest);
    await fs.copy('./src/app/shared/', sharedDest);
    await fs.copy('./src/environments/', environmentDest);

    // Updating code
    // video-room selector
    fs.readFile(mainComponentDest, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      let result = data.replace("selector: 'opv-openvidu-session',", "selector: 'opv-session',");
      

      fs.writeFile(mainComponentDest, result, 'utf8', (err) => {
        if (err) return console.log(err);
      });
      // app-route Dashboard path
      fs.readFile(routeDest, 'utf8', (err, data) => {
        if (err) {
          return console.log(err);
        }
        let result = data.replace("{ path: '', component: DashboardComponent },", '');
        result = result.replace("import { DashboardComponent } from './dashboard/dashboard.component';", "");
        
        fs.writeFile(routeDest, result, 'utf8', (err) => {
          if (err) return console.log(err);
        });
        // openvidu-service environments path
        fs.readFile(sharedDest + 'services/open-vidu.service.ts', 'utf8', (err, data) => {
          if (err) {
            return console.log(err);
          }
          const result = data.replace('../../../environments/environment', '../../environments/environment');

          fs.writeFile(sharedDest + 'services/open-vidu.service.ts', result, 'utf8', (err) => {
            if (err) return console.log(err);
          });
        });
      });
    });
  } catch (err) {
    console.error('Error executing copy function in library-copy.js', err);
  }
}

async function cleanLibrary() {
  try {
    await fs.ensureDir(videoRoomDest);
    await fs.remove(videoRoomDest);
    await fs.ensureFile(routeDest);
    await fs.remove(routeDest);
    await fs.ensureDir(sharedDest);
    await fs.remove(sharedDest);
    await fs.ensureDir(environmentDest);
    await fs.remove(environmentDest);
  } catch (err) {
    console.error('Error executing clean library function in library-copy.js', err);
  }
}
cleanLibrary()
  .then(() => {
    copyFiles();
  })