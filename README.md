# DBMDataAPI
RestAPI Designed to fetch DBM styled json data

API Endpoint: `localhost:7000/api`

# Installation

Once you have downloaded the main branch drag and drop the `index.js` file over to your bots main directory. Then install [the express node module](https://www.npmjs.com/package/express).

# Running

Once installed properly run `node index.js` to start the api.

# Light Documentation

#### Getting Global Data ####

To get a global data use the following query parameters.

Parameter | Type | Usage
--------- | ---- | -----
dataType | string | Type of data you are trying to fetch. In this case it will be `global`.
data | string | The data name you are trying to fetch.

Your final request url should look something like this: `localhost:7000/api?dataType=global&data=DATA_NAME`
