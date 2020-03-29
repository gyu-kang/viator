import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import client from "./utils/ApolloClient";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Detail from "./pages/Detail";
import PostEdit from "./pages/PostEdit";
import SearchResult from "./pages/SearchResult";

import "semantic-ui-css/semantic.min.css";
import GlobalStyle from "./GlobalStyle";
import { UserContext } from "./GlobalContext";
import Header from "./components/Header";

const headerHeight = 75;
const Body = styled.section`
  height: calc(100% - ${headerHeight}px);
`;

const App = () => {
  const [signedInUser, setSignedInUser] = useState(
    localStorage.getItem("signed-in-user")
  );

  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <BrowserRouter>
        <UserContext.Provider value={[signedInUser, setSignedInUser]}>
          <Header height={headerHeight} />
          <Body>
            <Route exact path="/" component={Home} />
            <Switch>
              <Route path="/posts/new" component={NewPost} />
              <Route
                path="/posts/:postId([0-9a-zA-Z]+)/edit"
                component={PostEdit}
              />
              <Route path="/posts/:postId([0-9a-zA-Z]+)" component={Detail} />
            </Switch>
            <Route exact path="/search" component={SearchResult} />
          </Body>
        </UserContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
