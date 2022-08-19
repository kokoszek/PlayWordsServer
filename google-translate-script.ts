const axios = require("axios");

const encodedParams = new URLSearchParams();
encodedParams.append("q", "Hello, world!");
encodedParams.append("target", "es");
encodedParams.append("source", "en");

const options = {
  method: 'POST',
  url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': '9955f8dc65mshea2d9990a9ad31fp10acebjsn8052d4e2a1a6',
    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
  },
  data: encodedParams
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
