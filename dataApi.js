const express = require('express');
const app = express();
const fs = require('fs');

try {(JSON.parse(JSON.stringify(require('./configs/errors.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing errors.json config. Please validate JSON.');}
try {(JSON.parse(JSON.stringify(require('./configs/main.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing main.json config. Please validate JSON.');}

const errors = require('./configs/errors.json');
const config = require('./configs/main.json');

//################################################################################################################################################
//##################################################################CONFIGUTAION##################################################################
//################################################################################################################################################

//################################################################################################################################################
//####################################################################API KEYS####################################################################
//################################################################################################################################################
//To require the usage of API Keys change the value of the constant below to true then add a string to the API_KEYS array.

const requireKey = true;
const apiKeys = ['1'];

if(requireKey && !apiKeys || requireKey && apiKeys.length === 0 && config.ExitOnCriticalError) return console.log('WARNING: Requiring API keys without any valid API keys.');else if(requireKey && !apiKeys || requireKey && apiKeys.length === 0 && config.ExitOnCriticalError === false){
    console.log('WARNING: Requiring API keys without any valid API keys, Continuing');
}

for(let i = 0; i < apiKeys.length; i++){
    if(typeof apiKeys[i] !== 'string' && config.ExitOnCriticalError) return console.log('WARNING: All API keys must be a type of string.');else if(typeof apiKeys[i] !== 'string' && config.ExitOnCriticalError === false){
        console.log('WARNING: All API keys must be a type of string, Continuing');
    }
}

//################################################################################################################################################
//######################################################################CUSTOM PORT###############################################################
//################################################################################################################################################
//To set a custom port number set the null value below to the desired port.

const port = null || 7000;

if(!port && config.ExitOnCriticalError) return console.log('WARNING: No port number specified.');else if(!port && config.ExitOnCriticalError === false){
    console.log('WARNING: No port number specified, Continuing');
}

//################################################################################################################################################

app.get('/api', function (req, res) {
    if(requireKey === true && !apiKeys.includes(req.query.key)) return res.send(`{"success" : false, "error" : "${errors['0001']['error_text']}"}`);

    const queryDataType = req.query.dataType || null;
    const data = req.query.data || null;
    const member = req.query.member || null;
    const server = req.query.server || null;

    // Return if parameters are invalid or doesn't exist
    if (!queryDataType) return res.send(`{"success" : false, "error" : "${errors['0002']['error_text']}"}`);
    if (!data) return res.send(`{"success" : false, "error" : "${errors['0003']['error_text']}"}`);
    if (queryDataType !== 'server' && queryDataType !== 'member' && queryDataType !== 'global') return res.send(`{"success" : false, "error" : "${errors['0004']['error_text']}"}`);
    if (queryDataType === 'member' && !member) return res.send(`{"success" : false, "error" : "${errors['0005']['error_text']}"}`);


    if (queryDataType === 'global') {
        const raw = JSON.parse(fs.readFileSync('../data/globals.json', 'utf8'));
        const foundData = raw[data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"${errors['0006']['error_text']}: ${data}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }

    if (queryDataType === 'server') {
        const raw = JSON.parse(fs.readFileSync('../data/servers.json', 'utf8'));
        if(!raw[server]) return res.send('{"success" : false, "error" :' + `"${errors['0007']['error_text']}: ${data} in server: ${server}"}`);

        const foundData = raw[server][data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"${errors['0007']['error_text']}: ${data} in server: ${server}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }

    if (queryDataType === 'member') {
        const raw = JSON.parse(fs.readFileSync('../data/players.json', 'utf8'));
        if (!raw[member]) return res.send('{"success" : false, "error" :' + `"${errors['0008']['error_text']}: ${data} for member: ${member}"}`);

        const foundData = raw[member][data];
        if(!foundData) return res.send('{"success" : false, "error" :' + `"${errors['0008']['error_text']}: ${data} for member: ${member}"}`);

        return res.send(`{"success" : true, "data" : "${foundData.toString()}"}`);
    }
})

app.listen(port);
console.log(`Starting DBM Data API at port ${port}`);
