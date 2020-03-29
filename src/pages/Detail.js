import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation, useQuery } from "react-apollo";
import { Link, useHistory } from "react-router-dom";
import gql from "graphql-tag";
import {
  Button,
  Confirm,
  Container,
  Divider,
  Dropdown,
  Icon,
  Label,
} from "semantic-ui-react";
import { format, parseISO } from "date-fns";
import RenderedHtml from "../components/RenderedHtml";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { UserContext } from "../GlobalContext";

const QUERY = gql`
  query($id: ID!) {
    post(id: $id) {
      title
      startDate
      endDate
      markdownText
      createdAt
      updatedAt
      tags {
        id
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
const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const Metadata = styled.div`
  padding-top: 30px;
  padding-bottom: 5px;
`;
const Title = styled.h2`
  font-family: "Roboto Slab", "Noto Serif KR", serif;
  font-weight: bold;
  color: hsla(0, 0%, 0%, 0.8);
  margin: 0 0 3px 0;
`;
const Date = styled.div`
  color: darkgray;
  font-size: 11px;
  font-family: "Sen", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TravelPeriod = styled.div`
  display: flex;
  align-items: baseline;
`;
const CreatedAt = styled.p`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
`;
const AddedTagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0 0 65px 0;
`;
const AddedTag = styled.li`
  list-style: none;
  margin: 3px;
  font-family: "Roboto Slab", "Noto Serif KR", serif;

  .ui.label {
    font-weight: 300;
  }
`;
const EditButton = styled(Button)`
  &&& {
    padding: 11px;
    font-family: "Sen", sans-serif;
    a {
      color: hsla(0, 0%, 0%, 0.8);
    }
  }
`;
const ActionDropdown = styled(Dropdown)`
  &&& {
    font-family: "Sen", sans-serif;
    .selected.item {
      color: hsla(0, 0%, 0%, 0.8);
    }
    .active.item {
      font-weight: 400;
    }
  }
`;

const Detail = ({ match }) => {
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const [signedInUser] = useContext(UserContext);

  const history = useHistory();
  const [deletePost] = useMutation(DELETE_POST);

  const { postId } = match.params;

  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: postId },
    fetchPolicy: "no-cache",
  });
  if (loading || error) return "";

  const handleDeleteButtonClick = () => {
    setIsConfirmOpened(true);
  };
  const handlePostDeletion = () => {
    setIsConfirmOpened(false);

    deletePost({
      variables: {
        id: postId,
      },
    }).then(() => {
      history.replace("/");
    });
  };

  return (
    <>
      <Container>
        <Metadata>
          <Title>{data.post.title}</Title>
          <Date>
            <TravelPeriod>
              <Icon name="travel" />
              <p>
                {`${format(parseISO(data.post.startDate), "yyyy. MM. dd")} ~
                ${format(parseISO(data.post.endDate), "yyyy. MM. dd")}`}
              </p>
            </TravelPeriod>
            <CreatedAt>
              <Icon name="write" />
              {format(parseISO(data.post.createdAt), "yyyy. MM. dd")}
            </CreatedAt>
          </Date>
        </Metadata>
        <Divider />
        <RenderedHtml text={data.post.markdownText} />
        <AddedTagList>
          {data.post.tags.map((tag) => (
            <AddedTag key={tag}>
              <Label tag size="small">
                <span>{tag.name}</span>
              </Label>
            </AddedTag>
          ))}
        </AddedTagList>
      </Container>
      <BottomNavigationBar tags={data.tags}>
        {signedInUser && (
          <Button.Group>
            <EditButton basic>
              <Link to={`/posts/${postId}/edit`}>Edit</Link>
            </EditButton>
            <ActionDropdown
              basic
              className="button icon"
              pointing="top right"
              floating
              options={[
                {
                  key: "delete",
                  icon: "trash alternate outline",
                  text: "Delete",
                  onClick: handleDeleteButtonClick,
                },
              ]}
              trigger={<></>}
            />
          </Button.Group>
        )}
      </BottomNavigationBar>
      <Confirm
        open={isConfirmOpened}
        onCancel={() => {
          setIsConfirmOpened(false);
        }}
        onConfirm={handlePostDeletion}
        content="Would you delete this post really?"
        size="tiny"
      />
    </>
  );
};

Detail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Detail;
