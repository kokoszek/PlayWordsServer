const mongoose = require('mongoose');

// const sinon = require('sinon');
// require('sinon-mongoose');
//
// const User = mongoose.model('User');
// const Blog = mongoose.model('Blog');
//
// const UserMock = sinon.mock(User)
// const BlogMock = sinon.mock(Blog)
//
// const user = {
//     googleProfile: {
//         googleId: '103715083671414392218',
//         displayName: 'Michael Frysztacki from Mock!',
//         pictureUrl: 'https://lh3.googleusercontent.com/a/AItbvmmsJSyOfGCfpqslHfxaH167DWP1BSL3DjkBHxVb=s96-c'
//     },
//     _id: new mongoose.Types.ObjectId("62eaec93304afc3ed36d5d6a"),
//     __v: 0
// }
//
// UserMock
//     .expects('findById')
//     .withArgs('62eaec93304afc3ed36d5d6a')
//     .chain('exec')
//     .resolves(user)
//
// UserMock
//     .expects('findOne')
//     .chain('exec')
//     .resolves(user)
//
// module.exports = {
//     UserMock,
//     BlogMock
// }