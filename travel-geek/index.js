require('dotenv').config();
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
require('./models/User');
require('./models/Blog');
require('./services/passport');
const schema = require('./schema/schema');

const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const wsServer = new WebSocketServer({
    port: 4000,
    path: '/graphql',
});

useServer({ schema }, wsServer);

const cors = require('cors');
const fs = require("fs");
const https = require("https");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, () => {
    console.log('connected to mongodb');
});

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://friko16:<pw>@cluster1.loue9.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     console.log('connected, error: ', err);
//     const collection = client.db("travel-geek").collection("blogs");
//
//     // perform actions on the collection object
//     client.close();
// });

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://travelgeek.link:443' : 'http://localhost:8000',
    //origin: 'http://localhost:8000',
    credentials: true
})); // cors

app.options('http://localhost:8000', cors()); // include before other routes

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}));


if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if(process.env.NODE_ENV === 'production') {
    const https = require('https');
    const fs = require('fs');
    const PORT = process.env.PORT || 8443;
    const https_options = {
        ca: fs.readFileSync("./cert/ca_bundle.crt"),
        key: fs.readFileSync("./cert/private.key"),
        cert: fs.readFileSync("./cert/certificate.crt")
    };
    https
        .createServer(https_options, app)
        .listen(PORT);
    console.log('started server on https');
} else {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Listening on port`, PORT);
    });
    console.log('started server on http');
}