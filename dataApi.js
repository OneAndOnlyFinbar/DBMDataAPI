const express = require('express');
const app = express();
const fs = require('fs');

//################################################################################################################################################
//##################################################################CONFIGUTAION##################################################################
//################################################################################################################################################

//################################################################################################################################################
//####################################################################API KEYS####################################################################
//################################################################################################################################################
//To require the usage of API Keys change the value of the constant below to true then add a string to the API_KEYS array.

const requireKey = false;
const apiKeys = [];

if(requireKey && !apiKeys || requireKey && apiKeys.length === 0) return console.log('WARNING: Requiring API keys without any valid API keys.');

for(let i = 0; i < apiKeys.length; i++){
    if(typeof apiKeys[i] !== 'string') return console.log('WARNING: All API keys must be a type of string.');
}

//################################################################################################################################################
//######################################################################CUSTOM PORT###############################################################
//################################################################################################################################################
//To set a custom port number set the null value below to the desired port.

const port = null || 7000;

if(!port) return console.log('WARNING: No port number specified.');

//################################################################################################################################################
app.get('/api', function (req, res) {
    if(requireKey === true && !apiKeys.includes(req.query.key)) return res.send('{"success" : false, "error" : "Invalid API key."}');

    const queryDataType = req.query.dataType || null;
    const data = req.query.data || null;
    const member = req.query.member || null;
    const server = req.query.server || null;

    // Return if parameters are invalid or doesn't exist
    if (!queryDataType) return res.send('{"success" : false, "error" : "No dataType parameter provided."}');
    if (!data) return res.send('{"success" : false, "error" : "No data parameter provided."}');
    if (queryDataType !== 'server' && queryDataType !== 'member' && queryDataType !== 'global') return res.send('{"success" : false, "error" : "Invalid dataType parameter."}');
    if (queryDataType === 'member' && !member) return res.send('{"success" : false, "error" : "No member parameter provided."}');


    if (queryDataType === 'global') {
        const raw = JSON.parse(fs.readFileSync('./data/globals.json', 'utf8'));
        const foundData = raw[data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"Couldnt find global data: ${data}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }

    if (queryDataType === 'server') {
        const raw = JSON.parse(fs.readFileSync('./data/servers.json', 'utf8'));
        if(!raw[server]) return res.send('{"success" : false, "error" :' + `"Couldnt find server data: ${data} in server: ${server}"}`);

        const foundData = raw[server][data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"Couldnt find server data: ${data} in server: ${server}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }

    if (queryDataType === 'member') {
        const raw = JSON.parse(fs.readFileSync('./data/players.json', 'utf8'));
        if (!raw[member]) return res.send('{"success" : false, "error" :' + `"Couldnt find member data: ${data} for member: ${member}"}`);

        const foundData = raw[member][data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"Couldnt find member data: ${data} for member: ${member}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }
})
app.listen(port);
console.log(`Starting DBM Data API at port ${port}`);
