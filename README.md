# DBMDataAPI
RestAPI Designed to fetch DBM styled json data

API Endpoint: `localhost:7000/api`

Viewing version: 2.1.0
<br>
Latest release: 2.1.0

# Installation

Once you have downloaded the main branch unzip the `DBMDataAPI-main.zip` folder drag the unzipped `DBMDataAPI-main` folder over to your bots main directory. Then install [the express node module](https://www.npmjs.com/package/express) by running `npm i express` in your console.

# Running

Once installed properly navigate to the `DBMDataApi` folder and run `node dataApi.js` to start the api.

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
server | string | The ID of the server you are trying to fetch data from.

Your final request url should look something like this: `localhost:7000/api?dataType=server&data=DATA_NAME&server=SERVER_ID`

#### Getting Member Data ####

To get a member data use the following query parameters.

Parameter | Type | Usage
--------- | ---- | -----
dataType | string | Type of data you are trying to fetch. In this case it will be `member`.
member | int | The ID of the member your trying to fetch data from.
data | string | The data name you are trying to fetch.

Your final request url should look something like this: `localhost:7000/api?dataType=member&data=DATA_NAME`

# Advanced Documentation

#### Base Info ####

The API is built using express.js.
When running `index.js` the API will start and listen at port: `7000` by default. This can be changed and configured, read below for more information and instructions.

#### Networking ####

When starting, additional port forwarding may be required as to allow access from other computers. If required port forward to port 7000. Additionally you may need to change the IP address if chosen to host on different machine.

#### All Query Parameters ####

Parameter | Type | Required | Usage
--------- | ---- | -------- | -----
dataType | string | true | Type of data you are trying to fetch. In this case it will be `member`.
member | string | true | The ID of the member your trying to fetch data from.
data | string | true | The data name you are trying to fetch.
server | string | true | The ID of the server you are trying to fetch data from.
key | string | false | API Key, if one is required.

#### Configs ####

##### API Keys #####
To enable and require API keys:

1. Go to line 14 (14:10) and set the constant value `requireKey` to true.
2. Then go to line 15 (15:10) and add a value to the `apiKeys` array. An example would be: `const apiKeys = ['API_KEY'];` which would add the API key `API_KEY`.

**Note:** 
When an API key is required you must provide the `key` parameter in the request url. 
All items in the `apiKeys` array must be valid strings.

##### Custom Port Number #####
To update the port number your api is running on:
1. Go to line 22 (22:17) and change the `null` value to your port number.

If you want to reset it set the changed port number to `null`
