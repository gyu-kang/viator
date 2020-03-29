import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Container as SemanticContainer } from "semantic-ui-react";
import styled from "styled-components";
import Editor from "../components/Editor";
import { UserContext } from "../GlobalContext";

const CREATE_POST = gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
    }
  }
`;

const Container = styled(SemanticContainer)`
  min-height: 100%;
  padding: 0 0 25px;

  &&& {
    display: flex;
  }
`;

const NewPost = () => {
  const [signedInUser] = useContext(UserContext);

  const history = useHistory();
  if (!signedInUser) {
    history.replace("/");
  }

  const [createPost] = useMutation(CREATE_POST);

  const handleFormSubmit = (title, startDate, endDate, markdownText, tags) => {
    createPost({
      variables: {
        post: {
          title,
          startDate,
          endDate,
          markdownText,
          tags,
        },
      },
    }).then((response) => {
      history.replace(`/posts/${response.data.createPost.id}`);
    });
  };

  return (
    <Container>
      <Editor onFormSubmit={handleFormSubmit} />
    </Container>
  );
};

export default NewPost;
