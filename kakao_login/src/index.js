require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const request = require('request');
const rp = require('request-promise');
const { PORT: port } = process.env;

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    const { KAKAO_KEY } = process.env;
    res.render('index', { apikey: KAKAO_KEY });
});

app.get('/auth/callback', async(req, res) => {
    const { KAKAO_KEY: apikey } = process.env;
    const { code } = req.query;
    console.log(req.query);

    const options = {
        uri: 'https://kauth.kakao.com/oauth/token',
        method: 'POST',
        form: {
            grant_type: 'authorization_code',
            client_id: apikey,
            redirect_uri: 'http://localhost:8080/auth/callback',
            code: code,
            client_secret: 'JHyc9alezIEbgPuVHKz7WcP5olfyRHYP',
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        json: true,
    };

    const cb = await rp(options);
    if (cb['access_token']) {
        res.render('callback', { result: 0 });
    } else {
        res.render('callback', { result: 1 });
    }
});

http.listen(port, function() {
    console.log(`https://localhost:${port}`);
});