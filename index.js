const chalk = require('chalk');
const express = require('express');
const shell = require('shelljs');
const datetime = require('silly-datetime');
const config = require('./config');

const server = express();

console.log("Server listening on port " + chalk.green(config.port));

server.post('/', (req, res) => {
    let name = req.query.name;
    let token = req.query.token;

    try {
        if (config.repository[name].token != token) {
            res.send("TOKEN ERROR.");
        } else {
            let repository = config.repository[name];
            console.log(
                chalk.green(datetime.format(new Date(), 'HH:mm:ss')),
                chalk.blueBright(name),
                "requested."
            );
            shell.cd(repository.path);
            repository.command.forEach((e) => {
                shell.exec(e);
            });
            res.send("OK");
        }
    } catch (e) {
        res.send("ERROR");
    }

});

server.listen(config.port);