import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Button, Container, Header, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import qs from "query-string";
import PostListItem from "../components/PostListItem";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { UserContext } from "../GlobalContext";

const QUERY = gql`
  query($contain: PostWhereInput) {
    posts(contain: $contain) {
      id
      title
      startDate
      endDate
      markdownText
      createdAt
      updatedAt
      tags {
        name
      }
    }
    tags {
      name
      posts {
        id
      }
    }
  }
`;

const WriteButton = styled(Button)`
  &&& {
    font-family: "Sen", sans-serif;
    a {
      color: hsla(0, 0%, 0%, 0.8);
    }
  }
`;
const SearchResultMessage = styled(Header)`
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-family: "Roboto Slab", "Noto Serif KR", serif;
  font-weight: bold;

  &&& {
    margin-top: 20px;
  }
`;

const SearchResult = ({ location }) => {
  const [signedInUser] = useContext(UserContext);

  const history = useHistory();

  const q = qs.parse(location.search);
  const { method, query } = q;
  if (!method || !query) {
    history.replace("/");
  }

  let contain = {};
  if (method === "text") {
    contain = { text: query };
  } else if (method === "tag") {
    contain = { tag: query };
  }

  const { loading, error, data } = useQuery(QUERY, {
    variables: { contain },
    fetchPolicy: "no-cache",
  });

  if (loading || error) return "";

  return (
    <>
      <SearchResultMessage as="h2">
        <Icon name="search" />
        <Header.Content>
          {`${
            (data.posts.length > 0
              ? `There are ${data.posts.length} posts `
              : `There aren't any posts `) +
            ((method === "text" && `contain`) ||
              (method === "tag" && `tagged with`) ||
              "")
          } '${query}'.`}
        </Header.Content>
      </SearchResultMessage>
      <Container>
        {data.posts.map((post) => {
          return <PostListItem key={post.id} post={post} />;
        })}
      </Container>
      <BottomNavigationBar tags={data.tags}>
        {signedInUser && (
          <Button.Group>
            <WriteButton basic>
              <Link to="/posts/new">Write</Link>
            </WriteButton>
          </Button.Group>
        )}
      </BottomNavigationBar>
    </>
  );
};

SearchResult.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default SearchResult;
