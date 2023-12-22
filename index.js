const express = require('express');
const axios = require('axios');
const { URLSearchParams } = require('url');

require('dotenv').config();

const app = express();
const rapidAPIKey = process.env.RAPID_API_KEY

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { translation: null, error: null});
});

app.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;

    const encodedParams = new URLSearchParams();
    encodedParams.set('source_language', 'en');
    encodedParams.set('target_language', targetLang);
    encodedParams.set('text', text);

    const options = {
    method: 'POST',
    url: 'https://text-translator2.p.rapidapi.com/translate',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': rapidAPIKey,
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
    },
        data: encodedParams,
    };

    try{
        const response = await axios.request(options);
        res.render('index', {
            translation: response.data.data.translatedText,
            error: null
        })

        res.redirect('/')
    } catch (error) {
        res.render('index', {
            translation: null,
            error: 'Error fetching data, please try again'
        })
    }
})

app.listen('7000', () => {
    console.log('listening on port 7000');
});