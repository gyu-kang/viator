import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";
import { Container as SemanticContainer } from "semantic-ui-react";
import Editor from "../components/Editor";
import { UserContext } from "../GlobalContext";

const QUERY = gql`
  query($id: ID!) {
    post(id: $id) {
      title
      startDate
      endDate
      markdownText
      tags {
        name
      }
    }
  }
`;
const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $post: PostInput!) {
    updatePost(id: $id, post: $post) {
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

const PostEdit = ({ match }) => {
  const { postId } = match.params;

  const [signedInUser] = useContext(UserContext);

  const history = useHistory();
  if (!signedInUser) {
    history.replace(`/posts/${postId}`);
  }

  const [updatePost] = useMutation(UPDATE_POST);

  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: postId },
    fetchPolicy: "no-cache",
  });
  if (loading || error) return "";

  const handleFormSubmit = (title, startDate, endDate, markdownText, tags) => {
    updatePost({
      variables: {
        id: postId,
        post: {
          title,
          startDate,
          endDate,
          markdownText,
          tags,
        },
      },
    }).then((response) => {
      history.replace(`/posts/${response.data.updatePost.id}`);
    });
  };

  return (
    <Container>
      <Editor
        onFormSubmit={handleFormSubmit}
        post={{ ...data.post, tags: data.post.tags.map((tag) => tag.name) }}
      />
    </Container>
  );
};

PostEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PostEdit;
