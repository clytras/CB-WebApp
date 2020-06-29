import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link, Redirect, useLocation } from 'react-router-dom';
import DateTime from 'luxon/src/datetime';
import authService, { AuthenticationResultStatus } from './AuthorizeService';
import FrontContentBase from '@components/common/FrontContentBase';
import { RProgressApi } from 'rprogress';
import { useStoreOf } from '@stores';
import LoadingButton from '@components/common/LoadingButton';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import Delayed from '@components/common/Delayed';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import { apiPost } from '@utils/net';


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
    setIsProcessing(true);
    setLoginError(null);
    setRequestError(null);
    RProgressApi.start();

    apiPost('/api/Auth/Logout', {
      addCsrf: true
    }).then(async resp => {
      if (resp.ok) {
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

    setIsProcessing(true);
    setLoginError(null);
    setRequestError(null);
    RProgressApi.start();

    apiPost('/api/Auth/Login', {
      addCsrf: true,
      params: {
        Email: inputEmail,
        Password: inputPassword,
        RememberMe: inputRememberMe
      }
    }).then(async resp => {
      if (resp.ok) {
        const { status, message } = await authService.ajaxSignIn();

        if (status === AuthenticationResultStatus.Fail) {
          if (message) {
            setLoginError(message);
          } else {
            setLoginError(Strings.messages.Auth.LoginFail);
          }
        } else {
          setRedirectTo(location?.state?.from?.pathname || '/');
        }
      } else {
        let errorCode, content;
        try {
          ({ errorCode, content } = await resp.json());
        } catch(err) {}

        let message = translateCodeMessage(errorCode, 'LoginFail');

        if (errorCode === 'AccountLocked' && content) {
          const lockedUntil = DateTime.fromISO(content).toLocaleString(DateTime.DATETIME_SHORT);
          message = Strings.formatString(message, { lockedUntil });
        }

        setLoginError(message);
      }
    }).catch(err => {
      setRequestError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setIsProcessing(false);
    });
  }

  const renderBase = content => <FrontContentBase className="reset-font-size" lg={6} xl={4} centered>{content}</FrontContentBase>;

  if(redirectTo) {
    return <Delayed><Redirect to={redirectTo} /></Delayed>;
  }

  if(isFetching) {
    return <LoadingOverlay/>;
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
                <Link to={"/account/forgot-password"}>Forgot your password?</Link>
            </p>
            <p>
                <Link to={"/account/register"}>Register as a new user</Link>
            </p>
          </FormGroup>

        </Form>
      </section>
    </>
  );
}
