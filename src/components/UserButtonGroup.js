import gql from "graphql-tag";
import styled from "styled-components";
import {
  Button,
  Dropdown,
  Form,
  Header as SemanticHeader,
  Icon,
  Message,
  Modal,
} from "semantic-ui-react";
import React, { useContext, useState } from "react";
import { useMutation } from "react-apollo";
import { UserContext } from "../GlobalContext";

const SIGN_IN = gql`
  mutation signIn($id: String!, $password: String!) {
    signIn(id: $id, password: $password)
  }
`;
const SIGN_OUT = gql`
  mutation signOut {
    signOut
  }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: "Sen", sans-serif;
  color: hsla(0, 0%, 0%, 0.8);

  .selected.item {
    color: hsla(0, 0%, 0%, 0.8);
  }
`;
const SignInModal = styled(Modal)`
  font-family: "Sen", sans-serif;

  .content {
    font-family: "Sen", sans-serif;
  }

  &&& {
    input,
    button {
      font-family: "Sen", sans-serif;
    }
  }
`;
const SignInButton = styled(Button)`
  &&& {
    margin: 0;
    box-shadow: none;

    i {
      color: hsla(0, 0%, 0%, 0.8);
      opacity: 1 !important;
    }
  }
`;
const ActionDropdown = styled(Dropdown)`
  &&& {
    background: none;
    font-family: "Sen", sans-serif;
  }
`;

const UserButtonGroup = () => {
  const [signedInUser, setSignedInUser] = useContext(UserContext);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [signInErrorMessage, setSignInErrorMessage] = useState(null);

  const [signIn] = useMutation(SIGN_IN);
  const [signOut] = useMutation(SIGN_OUT);

  const handleIdInputChange = (event) => {
    setId(event.target.value);
  };
  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSignInFormSubmit = (event) => {
    event.preventDefault();

    setSignInErrorMessage(null);
    signIn({
      variables: {
        id,
        password,
      },
    })
      .then(({ data }) => {
        localStorage.setItem("signed-in-user", data.signIn);
        setSignedInUser(data.signIn);
      })
      .catch(({ graphQLErrors, networkError }) => {
        if (networkError) setSignInErrorMessage(networkError);
        if (graphQLErrors) setSignInErrorMessage(graphQLErrors[0].message);
      });
  };
  const handleSignOutButtonClick = () => {
    signOut()
      .then(() => {
        localStorage.removeItem("signed-in-user");
        setSignedInUser(null);
      })
      .catch(({ graphQLErrors, networkError }) => {
        if (networkError) setSignInErrorMessage(networkError);
        if (graphQLErrors) setSignInErrorMessage(graphQLErrors[0].message);
      });
  };

  const signInModalTrigger = (
    <SignInButton basic>
      <Icon name="user circle outline" size="big" />
    </SignInButton>
  );

  return (
    <Container>
      {!signedInUser && (
        <SignInModal size="mini" trigger={signInModalTrigger}>
          <SemanticHeader icon="user circle outline" content="Sign In" />
          <Modal.Content>
            <Modal.Description>
              <Form
                onSubmit={handleSignInFormSubmit}
                error={signInErrorMessage !== []}
              >
                <Form.Field>
                  <label>ID</label>
                  <input type="text" onChange={handleIdInputChange} />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input type="password" onChange={handlePasswordInputChange} />
                </Form.Field>

                {signInErrorMessage && (
                  <Message error content={signInErrorMessage} />
                )}

                <Button primary type="submit">
                  Submit
                </Button>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </SignInModal>
      )}
      {signedInUser && (
        <div>
          <Icon name="user circle outline" size="large" />
          <span>{signedInUser}</span>
          <ActionDropdown
            inline
            className="button icon"
            pointing="top right"
            floating
            options={[
              {
                key: "sign out",
                icon: "sign out",
                text: "Sign Out",
                onClick: handleSignOutButtonClick,
              },
            ]}
            trigger={<></>}
          />
        </div>
      )}
    </Container>
  );
};

export default UserButtonGroup;
