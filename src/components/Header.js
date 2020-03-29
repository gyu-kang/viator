import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import UserButtonGroup from "./UserButtonGroup";

const Container = styled.header`
  height: ${(props) => props.height}px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before {
    content: " ";
    flex: 1;
  }
`;
const Logo = styled.h1`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Sarina", cursive;
  margin: 0;

  a {
    color: hsla(0, 0%, 0%, 0.8);
  }
`;

const Header = ({ height }) => {
  return (
    <Container height={height}>
      <Logo>
        <Link to="/">Viator</Link>
      </Logo>
      <UserButtonGroup />
    </Container>
  );
};

Header.propTypes = {
  height: PropTypes.number.isRequired,
};

export default Header;
