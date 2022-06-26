module.exports = (db) => {
  const router = require("express").Router();
  const { google } = require("googleapis");
  const privateKey = require("../googleServiceAccount.json");

  const googleAuth = new google.auth.JWT(
    privateKey.client_email,
    null,
    privateKey.private_key,
    [
      "https://www.googleapis.com/auth/drive",
    ]
  );

  googleAuth.authorize((e) => {
    if (e) {
      return;
    } else {
      console.log("Authorized");
    }
  });

  router.get("/api/templatefactory/getall", async (req, res) => {
    const drive = google.drive({
      version: "v3",
      auth: googleAuth,
    });
    drive.files
      .list({
        q: `'${req.query.folderId}' in parents`,
        fields:
          "files(id,name,contentHints/thumbnail,iconLink,webViewLink,webContentLink,hasThumbnail,thumbnailLink)",
      })
      .then(async (files) => {
        res.send({ files });
      })
      .catch((e) => {
        throw e;
      });
  });

  router.get("/api/googleauth", async (req, res) => {
    const drive = google.drive({
      version: "v3",
      auth: googleAuth,
    });

    await googleAuth.setCredentials({
      access_token: req.query.accessToken,
    });

    drive.files
      .copy({
        fileId: req.query.fileId,
        
        supportsAllDrives: true,
        supportsTeamDrives: true,
      })
      .then((givenFile) => {
        res.send({ givenFile });
      })
      .catch((e) => {
        console.log(e);
      });
  });
  return router;
};
