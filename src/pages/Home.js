import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button, Container } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import PostListItem from "../components/PostListItem";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { UserContext } from "../GlobalContext";

const QUERY = gql`
  query {
    posts {
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

const Home = () => {
  const [signedInUser] = useContext(UserContext);
  const { loading, error, data } = useQuery(QUERY, {
    fetchPolicy: "no-cache",
  });

  if (loading || error) return "";

  return (
    <>
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

export default Home;
