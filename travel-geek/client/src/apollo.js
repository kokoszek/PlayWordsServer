import { split, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(createClient({
    url:process.env.NODE_ENV === 'production' ?
        'ws://travelgeek.link:4000/graphql' :
        'ws://localhost:4000/graphql'
}));

const link = createHttpLink({
    uri: process.env.NODE_ENV === 'production' ?
        'https://travelgeek.link:443/graphql' :
        'http://localhost:5000/graphql',
    credentials: 'include'
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    link,
);

export const client = new ApolloClient({
    cache: new InMemoryCache({
        dataIdFromObject: obj => {
            return obj.__typename + ':' + obj._id;
        },
    }),
    link: splitLink
});