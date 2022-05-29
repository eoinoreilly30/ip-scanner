const express = require('express')
const https = require("https");
const fs = require("fs");
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

process.env["NODE_CONFIG_DIR"] = '/home/eoin/ip-scanner/config'
const config = require('config');

const app = express();
const port = config.get('port');

app.use(basicAuth({
    users: { [config.get('username')]: config.get('password') },
    challenge: true
}))
app.use(bodyParser.text({ type: 'text/plain' }));

app.get('/', (_, res) => {
    let data = fs.readFileSync("scan.txt", "utf-8");
    data = `<pre>${data}<pre>`;
    res.send(data);
})

app.post('/', (req, res) => {
    console.log(`Received: ${req.body}`);
    fs.writeFileSync('scan.txt', req.body);
    res.sendStatus(201);
})

https
    .createServer({
        key: fs.readFileSync("/home/eoin/ssl/privkey.pem"),
        cert: fs.readFileSync("/home/eoin/ssl/fullchain.pem"),
    }, app)
    .listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
