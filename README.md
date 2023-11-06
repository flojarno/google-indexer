# Google Indexer

Google Indexer is a tool designed to help webmasters ensure their site's URLs are indexed by Google. The tool scans a website's sitemap, loops through the URLs to check if they are indexed in Google using the Google Custom Search API, and sends the URLs not indexed to the Google Indexing API.

## Prerequisites

- Node.js
- NPM
- Google Custom Search API Key
- Google Indexing API Key

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/flojarno/google-indexer.git
```

### 2. Navigate to the Project Directory

```bash
cd path/to/directory
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory of your project and populate it with the following content:

```env
GOOGLE_API_KEY=<Your_Google_API_Key>
SEARCH_ENGINE_ID=<Your_Custom_Search_Engine_ID>
SITEMAP_URL=<Your_Website_Sitemap_URL>
TYPE=<Type>
PROJECT_ID=<Project_ID>
PRIVATE_KEY_ID=<Private_Key_ID>
PRIVATE_KEY=<Private_Key>
CLIENT_EMAIL=<Client_Email>
CLIENT_ID=<Client_ID>
AUTH_URI=<Auth_URI>
TOKEN_URI=<Token_URI>
AUTH_PROVIDER_X509_CERT_URL=<AuthProvider_x509_Cert_URL>
CLIENT_X509_CERT_URL=<Client_x509_Cert_URL>
```

Ensure you replace the placeholders (`<Your_Google_API_Key>`, `<Your_Custom_Search_Engine_ID>`, etc.) with your actual credentials and values.

## Usage

1. In a terminal, run the checking.js script first : node checking.js
2. Wait until the array of non-indexed URLs is provided, then run the indexing.js script : node indexing.js
