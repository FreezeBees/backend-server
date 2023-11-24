const { google } = require('googleapis');
const fs = require('fs');
const { Readable } = require('stream');
const { uuid } = require('uuidv4');
const path = require('path');

// Load the credentials file obtained from the Google Cloud Console
const credentials = require('../Tokenais.json');

// Create a new JWT client using the credentials
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/drive'],
);

// Create a Google Drive instance
const drive = google.drive({ version: 'v3', auth });

// Specify the folder ID of the folder you want to list
const folderId = '1E4ky3XKxPRBMnyM8emVSLj-_u9sJJyQx';

const listFiles = () => {
  // List files in the specified folder
  drive.files.list({
    // q: 'mimeType=\'image/jpeg\'',
    // fields: 'files(id, name)',
    // spaces: 'drive',
    q: `'${folderId}' in parents`,
    fields: 'files(id, name)',
  },
  (err, res) => {
    if (err) {
      console.error('Error listing files:', err);
      return;
    }

    const { files } = res.data;
    if (files.length) {
      console.log('Files in the folder:');
      files.forEach((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found in the folder.');
    }
  });
};

async function uploadFile(img) {
//   const drive = google.drive({ version: 'v3', auth });

  const media = {
    // mimeType: 'image/jpeg',
    body: Readable.from(img.buffer),
  };
  console.log(media);
  const requestBody = {
    name: `${uuid()}${path.extname(img.originalname)}`,
    parents: [folderId],
    mimeType: img.mimetype,
  }
  console.log(requestBody);
  const uploadedfile = await drive.files.create({
    // resource: fileMetadata,
    requestBody,
    media,
    // fields: 'id',
  });
  console.log(uploadedfile);
  return uploadedfile.data.id
}

module.exports = { listFiles, uploadFile };
