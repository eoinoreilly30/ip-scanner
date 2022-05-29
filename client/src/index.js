const axios = require('axios');
const { exec } = require("child_process");

process.env["NODE_CONFIG_DIR"] = '/home/eoin/ip-scanner/config'
const config = require('config');

function scanAndPost() {
    console.log('Starting scan');

    exec("nmap -sn -oG - 192.168.0.0/24", (error, stdout, stderr) => {        
        
        if (error) {
            console.log(`error: ${error.message}`);
            scanAndPost();
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            scanAndPost();
        }

        console.log(`stdout: ${stdout}`);

        axios.post(config.get('host'), stdout, {
            headers: {
                'Content-Type': 'text/plain'
            },
            auth: {
                username: config.get('username'),
                password: config.get('password')
            }
        }).then(() => {
            setTimeout(scanAndPost, 60000);
        });
    });
}

scanAndPost();
