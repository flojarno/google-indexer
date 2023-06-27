/* 

Clés API Google :

- 'AIzaSyCP6lXY0EsKYHERbGEP50OHz8QKgKnYLF0'; // vinz
- 'AIzaSyAR1tL1swrv4OwNN7qoRvzKjz850eVpXrk'; // flo

CSE ID :

- Google Index : 27ff8d6b45a044a7b
- Indexer : e60b32a9bdc974a25 (cherche uniquement sur OD)

Clé API Google indexing :

760c840c90e5199c242302ceee91fc265417bce1 
'cc38d8aae3c52eb12039e66ad1e13259a5ec6bf5';

*/

const axios = require('axios');
const parseString = require('xml2js').parseString;

const googleApiKey = 'AIzaSyAR1tL1swrv4OwNN7qoRvzKjz850eVpXrk';
const searchEngineId = 'e60b32a9bdc974a25';

// https://www.opportunites-digitales.com/page-sitemap3.xml
const sitemapUrl = 'https://www.opportunites-digitales.com/page-sitemap3.xml';

const urlsNotIndexed = [];

axios.get(sitemapUrl)
  .then(response => {
    parseString(response.data, async (error, result) => {
      if (error) {
        console.error(error);
      } else {
        const urls = result.urlset.url.map(url => url.loc[0]);

        const promises = urls.map(url => {
          return new Promise(resolve => {
            setTimeout(() => {
              fetch(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=site:${url}`)
                .then(response => response.json())
                .then(data => {
                  if (data.searchInformation.totalResults > 0) {
                    console.log(url + ' : ' + 'L\'URL est indexée dans les résultats de recherche de Google.');
                  } else {
                    urlsNotIndexed.push(url);
                    console.log(url + ' : ' + 'L\'URL n\'est pas indexée dans les résultats de recherche de Google.');
                  }
                  resolve();
                })
                .catch(error => {
                  console.error(error);
                  resolve();
                });
            }, 30000);
          });
        });

        Promise.all(promises).then(() => {
          console.log("Liste des URLs non indexées :");
          console.log(urlsNotIndexed);
        });
      }
    });
  })
  .catch(error => {
    console.error(error);
  });

  

  