import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations
            )}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    createUploadLink({
      uri: `https://${process.env.REACT_APP_DOMAIN}/graphql`,
      credentials: "same-origin",
    }),
  ]),
  cache: new InMemoryCache(),
});

export default apolloClient;
