module.exports = {
  googleClientID: '70265989829-0t7m7ce5crs6scqd3t0t6g7pv83ncaii.apps.googleusercontent.com',
  googleClientSecret: '8mkniDQOqacXtlRD3gA4n2az',
  mongoURI: `mongodb+srv://${process.env.ATLAS_MONGODB_USERNAME}:${process.env.ATLAS_MONGODB_PASSWORD}@cluster1.loue9.mongodb.net/${process.env.ATLAS_MONGODB_DATABASE}?retryWrites=true&w=majority`,
  cookieKey: '123123123',
  aws: {
    s3: {
      imageBucket: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
      }
    }
  }
};
