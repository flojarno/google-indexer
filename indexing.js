// indexing.js

const { JWT } = require('google-auth-library');
const axios = require('axios');
const fs = require('fs');

// Retrieve the credentials from config.js
const serviceAccount = require('./config.js'); 

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/indexing']
});

jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('JWT client authenticated');
    if (!fs.existsSync('state.json')) {
        console.error("The state file does not exist. Run checking.js first.");
        return;
    }

    const { urlsNotIndexed } = JSON.parse(fs.readFileSync('state.json', 'utf-8'));
    if (!urlsNotIndexed || !urlsNotIndexed.length) {
        console.log("No URLs to index. Run checking.js first.");
        return;
    }

    urlsNotIndexed.forEach(urlToIndex => {
        axios.post(
          'https://indexing.googleapis.com/v3/urlNotifications:publish',
          {
              url: urlToIndex,
              type: 'URL_UPDATED'
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + tokens.access_token
              }
          }
        ).then((response) => {
            console.log(`URL: ${urlToIndex}`);
            console.log(`Status: ${response.status}`);
            console.log(response.data);
        }).catch((error) => {
            console.error(`Error during indexing of URL: ${urlToIndex}`);
            console.error(error.response.data);
        });
    });
});


