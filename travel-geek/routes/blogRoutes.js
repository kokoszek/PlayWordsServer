const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');
const redis = require('redis');
const passport = require("passport");
const redisUrl = 'redis://127.0.0.1:6380';
//const client = redis.createClient(6380, 'localhost');

// client.on('connect', function() {
//   console.log('connected!!!!!!:');
// })
const aws = require('aws-sdk');
const keys = require('../config/keys')
const uuid = require('uuid');

const s3 = new aws.S3({
  accessKeyId: keys.aws.s3.imageBucket.accessKeyId,
  secretAccessKey: keys.aws.s3.imageBucket.secretAccessKey,
    signatureVersion: 'v4',
    region: 'eu-central-1'
})

module.exports = app => {

  app.get('/api/blogs/image/presigned-url', requireLogin, async (req, res) => {

    const key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl(
        'putObject',
        {
          Bucket: 'friko-bucket',
          ContentType: 'image/jpeg',
          Key: key
        },
        (err, url) => {
          res.send({key, url});
        }
    )
  });

  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    console.log('blog: ', blog.toObject());

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
        console.log('/api/blogs', req.user);
        //const blogs = await Blog.find({ _user: req.user.id });
        //res.send(blogs);
        res.send([]);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content, url } = req.body;
    const blog = new Blog({
      title,
      content,
      url,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
