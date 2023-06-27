
// 1- AUTORISATION AUPRES DE L'API GOOGLE ET RECUP DE CREDENTIALS

const { JWT } = require('google-auth-library');

// recup les credentials dans le JSON
const serviceAccount = require('../auth.json');

// creation d'un client JWT JSON WEB TOKEN
const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/indexing']
});

// autorisation aupres de l'API Google

jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('JWT client authenticated');

    // 2- APPEL HTTP EN POST A L'API D'INDEXATION DE GOOGLE VIA FETCH, AVEC LES CREDENTIALS
    const urlToIndex = 'https://www.opportunites-digitales.com/namecheap-devoile-fastvpn/'
 
    fetch(
        'https://indexing.googleapis.com/v3/urlNotifications:publish',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + tokens.access_token
          },
          body: JSON.stringify({
            url: urlToIndex,
            type: 'URL_UPDATED'
          })
        }
      ).then( (resultFromIndexation)=>{

        // ici on a acces aux metadonnees de la reponse dont le status code
        // mais on a pas acces au body tout de suite d'où le fait qu'on
        // le return l44, donc nouvelle promesse = nouveau .then 
        console.log(resultFromIndexation.status);

        return resultFromIndexation.json();
      }).then( (resultBodyInJsonFromIndexation)=>{

        // ici on a attendu le contenu du resultFromIndexation.json()
        console.log(resultBodyInJsonFromIndexation);
      
      });

 })




/* 

Clés API Google :

- 'AIzaSyCP6lXY0EsKYHERbGEP50OHz8QKgKnYLF0'; // vinz
- 'AIzaSyAR1tL1swrv4OwNN7qoRvzKjz850eVpXrk'; // flo

CSE ID :

- Google Index : 27ff8d6b45a044a7b
- Indexer : e60b32a9bdc974a25 (cherche uniquement sur OD)

Clé API Google indexing :

'760c840c90e5199c242302ceee91fc265417bce1'; Récent 
'cc38d8aae3c52eb12039e66ad1e13259a5ec6bf5'; Old

*/