//Prerequisites
const express = require('express');
const app = express();
const fs = require('fs');

//Config validation
try {(JSON.parse(JSON.stringify(require('./configs/errors.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing errors.json config. Please validate JSON.');}
try {(JSON.parse(JSON.stringify(require('./configs/main.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing main.json config. Please validate JSON.');}

//Data file validation
try {(JSON.parse(JSON.stringify(require('../data/servers.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing servers.json data file. Please validate JSON.');}
try {(JSON.parse(JSON.stringify(require('../data/globals.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing globals.json data file. Please validate JSON.');}
try {(JSON.parse(JSON.stringify(require('../data/players.json'))));} catch (error) {if (error) return console.log('WARNING: Fatal error encountered while parsing players.json data file. Please validate JSON.');}

//Config definitions
const errors = require('./configs/errors.json');
const config = require('./configs/main.json');

//Api key checks
if(config.requireKey && !config.apiKeys || config.requireKey && config.apiKeys.length === 0 && config.ExitOnCriticalError) return console.log('WARNING: Requiring API keys without any valid API keys.');else if(config.requireKey && !config.apiKeys || config.requireKey && config.apiKeys.length === 0 && config.ExitOnCriticalError === false) console.log('WARNING: Requiring API keys without any valid API keys, Continuing');
for(let i = 0; i < config.apiKeys.length; i++){
    if(typeof config.apiKeys[i] !== 'string' && config.ExitOnCriticalError) return console.log('WARNING: All API keys must be a type of string.');else if(typeof config.apiKeys[i] !== 'string' && config.ExitOnCriticalError === false) console.log('WARNING: All API keys must be a type of string, Continuing');
}
//Port number check
if(!config.apiPort && config.ExitOnCriticalError) return console.log('WARNING: No port number specified.');else if(!config.apiPort && config.ExitOnCriticalError === false) console.log('WARNING: No port number specified, Continuing');

app.get('/api', async function (req, res) {
    //Check API key validity
    if (config.requireKey === true && !config.apiKeys.includes(req.query.key)) return res.json({success: false, error: errors['0001']['error_text']});

    //Check If IP is whitelisted
    let ipCheck = req.headers['x-forwarded-for'] || req.ip || null;

    //Check and correct for subnet prefix
    if(ipCheck.startsWith('::ffff:')) ipCheck = ipCheck.slice(7);

    if(config.forceIpWhitelisting && !config.whitelistedIps.includes(ipCheck)){
        console.log(ipCheck);
        return res.json({success: false, error: errors['0009']['error_text']});
    }

    //Gather parameters
    const queryDataType = req.query.dataType || null;
    const data = req.query.data || null;
    const member = req.query.member || null;
    const server = req.query.server || null;
    const ip = req.headers['x-forwarded-for'] || req.ip || 'Unknown';
    const enableLogger = config.EnableLogger;

    // Return if parameters are invalid or dont exist
    if (!queryDataType) return res.json({success: false, error: errors['0002']['error_text']})
    if (!data) return res.json({success: false, error: errors['0003']['error_text']})
    if (queryDataType !== 'server' && queryDataType !== 'member' && queryDataType !== 'global') return res.json({success : false, error : errors['0004']['error_text']});
    if (queryDataType === 'member' && !member) return res.json({success: false, error: errors['0005']['error_text']})

    //Global data
    if (queryDataType === 'global') {
        const raw = JSON.parse(fs.readFileSync('../data/globals.json', 'utf8'));
        if (!raw[data]) return res.json({success: false, error: errors['0006']['error_text'] + data})

        const foundData = raw[data];
        if (!foundData) return res.json({success: false, error: errors['0006']['error_text'] + data})

        let log = `${new Date().toLocaleString()} - Global data ${data} accessed from ${ip}. Returned value: ${foundData.toString()}`;

        if (enableLogger) await logManager(log);

        return res.json({success : true, data : foundData.toString()});
    }

    //Server data
    if (queryDataType === 'server') {
        const raw = JSON.parse(fs.readFileSync('../data/servers.json', 'utf8'));
        if (!raw[server]) return res.send('{"success" : false, "error" :' + `"${errors['0007']['error_text']}: ${data} in server: ${server}"}`);

        const foundData = raw[server][data];
        if (!foundData) return res.json({success: false, error: errors['0007']['error_text'] + ': ' + data + ' in server: ' + server});

        let log = `${new Date().toLocaleString()} - Server data ${data} in server ${server} accessed from ${ip}. Returned value: ${foundData.toString()}`;

        if (enableLogger) await logManager(log);

        return res.json({success : true, data : foundData.toString()});
    }

    //Member data
    if (queryDataType === 'member') {
        const raw = JSON.parse(fs.readFileSync('../data/players.json', 'utf8'));
        if (!raw[member]) return res.json({success: false, error: errors['0008']['error_text'] + ': ' + data + ' for member: ' + member});

        const foundData = raw[member][data];
        if (!foundData) return res.json({success: false, error: errors['0008']['error_text'] + ': ' + data + ' for member: ' + member});

        let log = `${new Date().toLocaleString()} - Member data ${data} for member ${member} accessed from ${ip}. Returned value: ${foundData.toString()}`;

        if (enableLogger) await logManager(log);

        return res.json({success : true, data : foundData.toString()});
    }

    //Log manager function. Do not directly edit this, instead enable/disable in configs/main.json
    async function logManager(data) {
        if(config.LogToConsole) console.log(data);

        if(config.LogToFile){
            fs.appendFile('./logs/logs.txt', (`\n` + data), function (err) {
                if(err) console.log(`WARNING: Error while appending to log file. Err: \n ${err}`);
            })
        }
    }
})

//Start API
app.listen(config.apiPort);
console.log(`Starting DBM Data API at port ${config.apiPort}`);