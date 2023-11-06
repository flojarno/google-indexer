require('dotenv').config();
const axios = require('axios');
const parseString = require('xml2js').parseString;
const fs = require('fs');

const googleApiKey = process.env.GOOGLE_API_KEY;
const searchEngineId = process.env.SEARCH_ENGINE_ID;
const sitemapUrl = process.env.SITEMAP_URL;
const urlsNotIndexed = [];
const batchSize = 10;

let currentBatch = 0;

// Load the currentBatch from an external file (if it exists)
if (fs.existsSync('state.json')) {
  const data = JSON.parse(fs.readFileSync('state.json', 'utf-8'));
  currentBatch = data.currentBatch || 0;
}

axios.get(sitemapUrl)
  .then(response => {
    parseString(response.data, async (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      const urls = result.urlset.url.map(url => url.loc[0]);
      const urlBatches = [];
      for (let i = 0; i < urls.length; i += batchSize) {
        urlBatches.push(urls.slice(i, i + batchSize));
      }

      if (currentBatch >= urlBatches.length) {
        console.log('All batches have been processed.');
        return;
      }

      const urlsToProcess = urlBatches[currentBatch];
      console.log(`Processing batch ${currentBatch + 1} out of ${urlBatches.length}`);

      const promises = urlsToProcess.map(url => {
        return new Promise(resolve => {
            setTimeout(() => {
                axios.get(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=site:${url}`)
                    .then(response => {
                        if (response.data.searchInformation.totalResults === '0') {
                            urlsNotIndexed.push(url);
                            console.log(url + ' : ' + 'Not indexed');
                        } else {
                            console.log(url + ' : ' + 'Indexed');
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
        console.log("List of non-indexed URLs:");
        console.log(urlsNotIndexed);

        // Increment the currentBatch and store in state.json
        currentBatch++;
        fs.writeFileSync('state.json', JSON.stringify({ currentBatch, urlsNotIndexed }));
      });
    });
  })
  .catch(error => {
    console.error(error);
  });
