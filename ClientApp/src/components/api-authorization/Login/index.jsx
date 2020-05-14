import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link, Redirect, useLocation } from 'react-router-dom';
import authService, { AuthenticationResultStatus } from '../AuthorizeService';
import { RProgressApi } from 'rprogress';
import { useStoreOf } from '@stores';
import LoadingButton from '@components/common/LoadingButton';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import { StyleSheet, css } from 'aphrodite';
import clsx from 'clsx';
import { translateCodeMessage, translateRequestError } from '@i18n';


export default function Login() {
  const location = useLocation();
  const [authUser] = useStoreOf('authUser');

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputRememberMe, setInputRememberMe] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [loginError, setLoginError] = useState();
  const [requestError, setRequestError] = useState();
  const [redirectTo, setRedirectTo] = useState();

  console.log('Login', location, authUser, isFetching);

  useEffect(() => {
    setIsFetching(true);
    (async () => {
      await authService.getUser();
      setIsFetching(false);
    })();
  }, []);

  const handleEmailChange = ({ currentTarget: { value }}) => setInputEmail(value);
  const handlePasswordChange = ({ currentTarget: { value }}) => setInputPassword(value);
  const handleRememberMeChange = ({ currentTarget: { checked }}) => setInputRememberMe(checked);

  const handleLogoutClick = () => {
    console.log("Logging out");

    setIsProcessing(true);
    setLoginError(null);
    setRequestError(null);

    fetch('/api/Auth/Logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin'
    }).then(async resp => {
      console.log('logout resp', resp);

      if(resp.ok) {
        console.log('calling ajaxSignOut');
        await authService.ajaxSignOut();
      }
    }).catch(err => {
      setRequestError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setIsProcessing(false);
    });
  }

  const handleLoginFormSubmit = event => {
    event.preventDefault();

    console.log("Submitting Login");

    setIsProcessing(true);
    setLoginError(null);
    setRequestError(null);

    RProgressApi.start();

    fetch('/api/Auth/Login', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: inputEmail,
        Password: inputPassword,
        RememberMe: inputRememberMe
      })
    }).then(async resp => {
      console.log('Ajax login resp', resp);

      let errorCode;

      if(resp.ok) {
        const { status, message } = await authService.ajaxSignIn();
        console.log('ajaxSignIn', status, message);

        if(status === AuthenticationResultStatus.Fail) {
          if(message) {
            setLoginError(JSON.stringify(message, null, 2));
          } else {
            errorCode = 'LoginFail';
          }
        } else {
          // const { state: { from: { pathname = '/' } = {}} = {}} = location || {};
          setRedirectTo(location?.state?.from?.pathname || '/');
        }
      } else {
        
        try {
          ({ errorCode } = await resp.json());
        } catch(err) {}

        setLoginError(translateCodeMessage(errorCode, 'LoginFail'));
      }
    }).catch(err => {
      setRequestError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setIsProcessing(false);
    });
  }

  function renderBase(content) {
    return <div className={clsx('col-md-4 col-md-offset-4', css(styles.container))}>{content}</div>
  }

  if(isFetching) {
    return <LoadingOverlay/>;
  }

  if(redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  if(authUser) {
    const { name } = authUser;
    return renderBase(
      <>
        <h4>You are logged in as:</h4>
        <p>{name}</p>
        <LoadingButton onClick={handleLogoutClick}>Log out</LoadingButton>
      </>
    );
  }

  return renderBase(
    <>
      <h1>Log in</h1>
      <InlineMessage text={requestError} color="danger"/>
      <InlineMessage text={loginError} color="warning"/>
      <section>
        <Form onSubmit={handleLoginFormSubmit}>
          <h4>Use a local account to log in.</h4>

          <FormGroup>
            <Label for="Input.Email">Email</Label>
            <Input type="email" required name="Input.Email" id="Input.Email" 
              value={inputEmail} 
              onChange={handleEmailChange}
              disabled={isProcessing}
            />
          </FormGroup>

          <FormGroup>
            <Label for="Input.Password">Password</Label>
            <Input type="password" required name="Input.Password" id="Input.Password"
              value={inputPassword} 
              onChange={handlePasswordChange}
              disabled={isProcessing}
            />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input type="checkbox" 
                checked={inputRememberMe} 
                onChange={handleRememberMeChange}
                disabled={isProcessing}
              />{' '}
              Remember Me
            </Label>
          </FormGroup>

          <FormGroup>
            <LoadingButton loading={isProcessing}>Log in</LoadingButton>
          </FormGroup>

          <FormGroup>
            <p>
                <Link to={"/forgot-password"}>Forgot your password?</Link>
            </p>
            <p>
                <Link to={"/register"}>Register as a new user</Link>
            </p>
            <p>
                <Link to={"/resend-email-confirmation"}>Resend email confirmation</Link>
            </p>
          </FormGroup>

        </Form>
      </section>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 'auto'
  }
});
