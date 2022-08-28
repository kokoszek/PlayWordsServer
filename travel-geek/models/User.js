const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleProfile: {
    googleId: String,
    displayName: String,
    pictureUrl: String
  }
});

mongoose.model('User', userSchema);
