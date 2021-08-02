# DBMDataAPI
RestAPI Designed to fetch DBM styled json data

API Endpoint: `localhost:7000/api`

Viewing version: 1.0.0
<br>
Latest release: 1.0.0

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

#### Getting Server Data ####

To get a server data use the following query parameters.

Parameter | Type | Usage
--------- | ---- | -----
dataType | string | Type of data you are trying to fetch. In this case it will be `server`.
data | string | The data name you are trying to fetch.

Your final request url should look something like this: `localhost:7000/api?dataType=server&data=DATA_NAME`

#### Getting Member Data ####

To get a member data use the following query parameters.

Parameter | Type | Usage
--------- | ---- | -----
dataType | string | Type of data you are trying to fetch. In this case it will be `member`.
member | int | The ID of the member your trying to fetch data from.
data | string | The data name you are trying to fetch.

Your final request url should look something like this: `localhost:7000/api?dataType=member&data=DATA_NAME`
