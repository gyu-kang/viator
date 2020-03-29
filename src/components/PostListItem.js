import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Divider, Icon } from "semantic-ui-react";
import { format, parseISO } from "date-fns";

const Container = styled.div`
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
`;
const Title = styled.h2`
  font-family: "Roboto Slab", "Noto Serif KR", serif;
  font-weight: bold;
  margin: 0 0 3px 0;
`;
const TitleLink = styled(Link)`
  color: hsla(0, 0%, 0%, 0.8);

  &:hover {
    color: hsla(0, 0%, 0%, 0.8);
  }
`;
const Preview = styled.p`
  margin: 15px 0;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: "Roboto Slab", "Noto Serif KR", serif;
  font-weight: 300;
`;
const CreatedAt = styled.p`
  color: darkgray;
  font-size: 11px;
  margin: 0;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  font-family: "Sen", sans-serif;
`;
const TravelPeriod = styled.div`
  color: darkgray;
  display: flex;
  align-items: baseline;
  font-size: 11px;
  margin: 0;
  font-family: "Sen", sans-serif;
`;

const PostListItem = ({ post }) => {
  return (
    <Container>
      <Title>
        <TitleLink to={`/posts/${post.id}`}>{post.title}</TitleLink>
      </Title>
      <TravelPeriod>
        <Icon name="travel" />
        <p>
          {`${format(parseISO(post.startDate), "yyyy. MM. dd")} ~
          ${format(parseISO(post.endDate), "yyyy. MM. dd")}`}
        </p>
      </TravelPeriod>
      <Preview>{post.markdownText}</Preview>
      <CreatedAt>
        <Icon name="write" />
        {format(parseISO(post.createdAt), "yyyy. MM. dd")}
      </CreatedAt>
      <Divider />
    </Container>
  );
};

PostListItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    markdownText: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};

export default PostListItem;
