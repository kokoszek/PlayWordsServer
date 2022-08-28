const {
    buildSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLEnumType
} = require('graphql');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const { faker } = require('@faker-js/faker');

const _ = require('lodash');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Blog = mongoose.model('Blog');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLString },
        googleId: {type: GraphQLString },
        displayName: {type: GraphQLString },
        blogs: {
            type: new GraphQLList(BlogType),
            resolve(parentValue, args) {
                return Blog.find({_user: parentValue._id})
                    .then(resp => {
                        console.log('resp: ', resp);
                        resp.map(el => el.toObject())
                    })
            }
        }
    })
})

const BlogType = new GraphQLObjectType({
    name: 'Blog',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        content: { type: GraphQLString, },
        url: { type: GraphQLString },
        avgRate: { type: GraphQLInt },
        rateCount: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return User.findOne({_id: parentValue._user.toString()})
                    .then(result => {
                        console.log('result: ', result);
                        return result.toObject();
                    })
                    .catch(err => {
                        console.log('err: ', err);
                    })
                return null;
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'query',
    fields: {
        user: {
            type: UserType,
            args: { googleId: { type: GraphQLString }},
            resolve(parentValue, args) {
                return User.findOne({googleId: args.googleId})
                    .then(result => result.toObject())
                    .catch(e => console.log('EEE: ', e))
            }
        },
        currentUser: {
            type: UserType,
            args: {},
            resolve(parentValue, args, req) {
                return req.user;
            }
        },
        blog: {
            type: BlogType,
            args: { id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return Blog.findOne({_id: mongoose.Types.ObjectId(args.id)})
                    .then(result => result.toObject())
            }
        },
        blogs: {
            type: new GraphQLList(BlogType),
            resolve(parentValue, args, req) {

                console.log('graphql resolve -> req.user: ', req.user);

                function random(min, max) { // min and max included
                    return Math.floor(Math.random() * (max - min + 1) + min)
                }

                const blogs = [{
                    url: '/img/blog_images/blog-1.jpeg',
                }, { url: '/img/blog_images/blog-2.jpeg',
                }, { url: '/img/blog_images/blog-4.jpeg',
                }, { url: '/img/blog_images/blog-5.jpeg',
                }, { url: '/img/blog_images/blog-6.jpeg',
                }, { url: '/img/blog_images/blog-7.jpeg',
                }, { url: '/img/blog_images/blog-8.jpeg',
                }, { url: '/img/blog_images/blog-9.jpeg',
                }, { url: '/img/blog_images/blog-10.jpeg',
                }, { url: '/img/blog_images/blog-11.jpeg',
                }, { url: '/img/blog_images/blog-12.jpeg',
                }, { url: '/img/blog_images/blog-13.jpeg',
                }, { url: '/img/blog_images/blog-14.jpeg',
                }, { url: '/img/blog_images/blog-15.jpeg',
                }, { url: '/img/blog_images/blog-3.jpeg',
                }, { url: '/img/blog_images/blog-2.jpeg',
                }];

                let i = 1;
                blogs.forEach(blog => {
                    blog.title = faker.lorem.sentence(3).slice(0, -1);
                    blog.content = faker.lorem.paragraph(random(2, 3));
                    blog.avgRate = random(3, 5);
                    blog.rateCount = random(2000, 150000);
                    blog._id = ++i + '';
                });
                return blogs;
            }
        }
    }
})

const subscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        blogAdded: {
            resolve: (obj) => {
                console.log('obj: ', obj);
            },
            type: BlogType,
            subscribe: () => {
                const iter =  pubsub.asyncIterator(['BLOG_CREATED']);
                console.log('subscribe', iter);
                return iter;
            }
        },
        test: {
            type: UserType,
            subscribe: () => pubsub.asyncIterator(['TEST'])
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBlog: {
            type: BlogType,
            args: {
                title: { type: GraphQLNonNull(GraphQLString) },
                content: { type: GraphQLNonNull(GraphQLString) },
                user: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, {title, content, user}) {
                pubsub.publish('BLOG_CREATED', {
                    blogAdded: {
                        _id: '1234',
                        title,
                        content,
                        _user: mongoose.Types.ObjectId(user)
                    }
                }).then(result => {
                    console.log('publish finished: ', result);
                }).catch(err => {
                    console.log('publish err: ', err);
                });
                console.log('published');
                return new Blog({
                    title,
                    content,
                    _user: mongoose.Types.ObjectId(user)
                }).save()
            }
        },
        deleteBlog: {
            type: GraphQLBoolean,
            args: {
                blogId: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, { blogId }) {
                return Blog.deleteOne({
                    _id: mongoose.Types.ObjectId(blogId)
                }).then(({deletedCount}) => !!deletedCount);
            }
        },
        patchBlog: {
            type: BlogType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLString) },
                title: { type: GraphQLString },
                content: { type: GraphQLString },
                userId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                const { _id, ...restOfArgs } = args;
                let res = Blog.findByIdAndUpdate({
                    _id: mongoose.Types.ObjectId(args._id)
                }, {
                    ...restOfArgs
                }, {
                    new: true
                })
                res.then(el => console.log(el))
                return res;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
    subscription,
})