import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link, Redirect, useLocation } from 'react-router-dom';
import authService, { AuthenticationResultStatus } from '../AuthorizeService';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordValidator from 'password-validator';
import Markdown from '@components/common/Markdown';
import isEmail from 'validator/lib/isEmail';
import { RProgressApi } from 'rprogress';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';
import LoadingButton from '@components/common/LoadingButton';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import { StyleSheet, css } from 'aphrodite';
import clsx from 'clsx';
import { translateCodeMessage, translateRequestError } from '@i18n';

export default function Register() {
  // const location = useLocation();
  const [authUser] = useStoreOf('authUser');

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [inputPasswordScore, setInputPasswordScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [registerError, setRegisterError] = useState();
  const [requestError, setRequestError] = useState();
  const [redirectTo, setRedirectTo] = useState();
  const [accountCreated, setAccountCreated] = useState(false);
  const [successContent, setSuccessContent] = useState();
  const [initAt] = useState(new Date);
  const [preventAutoComplete, setPreventAutoComplete] = useState(true);

  console.log('Register', authUser, isFetching);

  useEffect(() => {
    setIsFetching(true);
    (async () => {
      await authService.getUser();
      setIsFetching(false);
      setTimeout(() => setPreventAutoComplete(false), 600);
    })();
  }, []);

  const handleEmailChange = ({ currentTarget: { value }}) => setInputEmail(value);
  const handlePasswordChange = ({ currentTarget: { value }}) => setInputPassword(value);
  const handleConfirmPasswordChange = ({ currentTarget: { value }}) => setInputConfirmPassword(value);
  const handlePasswordScoreChange = score => setInputPasswordScore(score);

  const handleRegisterFormSubmit = event => {
    event.preventDefault();

    console.log("Submitting Register");

    if(!validateForm()) return;

    setIsProcessing(true);

    RProgressApi.start();

    fetch('/api/Auth/Register', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: inputEmail,
        Password: inputPassword,
        ConfirmPassword: inputConfirmPassword
      })
    }).then(async resp => {
      console.log('Ajax register resp', resp);

      let errorCode;

      if(resp.ok) {
        // const { status, message } = await authService.ajaxSignIn();
        // console.log('ajaxRegister', status, message);

        // if(status === AuthenticationResultStatus.Fail) {
        //   if(message) {
        //     setRegisterError(JSON.stringify(message, null, 2));
        //   } else {
        //     errorCode = 'LoginFail';
        //   }
        // } else {
        //   setRedirectTo(location?.state?.from?.pathname || '/');
        // }

        let content;

        try {
          ({ content } = await resp.json());
        } catch(err) {}

        if(content && !Array.isArray(content)) {
          content = [content];
        }

        setAccountCreated(true);
        setSuccessContent(content);
      } else {
        
        try {
          ({ errorCode } = await resp.json());
        } catch(err) {}

        setRegisterError(translateCodeMessage(errorCode, 'LoginFail'));
      }
    }).catch(err => {
      setRequestError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setIsProcessing(false);
    });
  }

  function validateForm() {
    setRequestError(null);
    setSuccessContent(null);

    const errors = [];

    if(!isEmail(inputEmail)) {
      errors.push(Strings.messages.Auth.InvalidEmailAddress);
    }

    const passwordValidatorSchema = new PasswordValidator();

    passwordValidatorSchema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();
    
    if(!passwordValidatorSchema.validate(inputPassword)) {
      errors.push(Strings.messages.Auth.InvalidPassword);
    }

    if(inputPassword !== inputConfirmPassword) {
      errors.push(Strings.messages.Auth.ConfirmPasswordNotMatch);
    }

    if(inputPassword.length && inputPasswordScore < 3) {
      errors.push(Strings.messages.Auth.WeakVulnerablePassword);
    }

    setRegisterError(errors);
    return errors.length === 0;
  }

  function renderBase(content) {
    return <div className={clsx('col-md-4 col-md-offset-4', css(styles.container))}>{content}</div>
  }

  if(isFetching) {
    return <LoadingOverlay/>;
  }

  // if(redirectTo) {
  //   return <Redirect to={redirectTo} />;
  // }

  if(authUser) {
    const { name } = authUser;
    return renderBase(
      <>
        <h4>You are logged in as:</h4>
        <p>{name}</p>
      </>
    );
  }

  if(accountCreated) {
    if(successContent && successContent.length) {
      return renderBase(
        <>
          {successContent.map((source, index) => <Markdown key={`register-success-content-block-${index}`} source={source} />)}
        </>
      );
    }

    return renderBase(
      <>
        <h2>The account has been created.</h2>
        <p>You can now use your cedentials to <Link to="/account/login">login</Link>.</p>
      </>
    );
  }

  return renderBase(
    <>
      <h1>Register</h1>
      <InlineMessage text={requestError} color="danger"/>
      <InlineMessage text={registerError} color="warning"/>
      <section>
        <Form onSubmit={handleRegisterFormSubmit}>
          <h4>Create a new account.</h4>

          <FormGroup>
            <Label for="Register.Email">Email</Label>
            <Input type="email" required name="Register.Email" id="Register.Email" 
              value={inputEmail} 
              onChange={handleEmailChange}
              disabled={isProcessing}
              readOnly={preventAutoComplete}
            />
          </FormGroup>

          <FormGroup>
            <Label for="Register.Password">Password</Label>
            <Input type="password" required name="Register.Password" id="Register.Password"
              value={inputPassword} 
              onChange={handlePasswordChange}
              disabled={isProcessing}
              readOnly={preventAutoComplete}
            />
            <PasswordStrengthBar password={inputPassword} onChangeScore={handlePasswordScoreChange} />
          </FormGroup>

          <FormGroup>
            <Label for="Input.ConfirmPassword">Confirm Password</Label>
            <Input type="password" required name="Input.ConfirmPassword" id="Input.ConfirmPassword"
              value={inputConfirmPassword} 
              onChange={handleConfirmPasswordChange}
              disabled={isProcessing}
              readOnly={preventAutoComplete}
            />
          </FormGroup>

          <FormGroup>
            <LoadingButton loading={isProcessing}>Register</LoadingButton>
          </FormGroup>

          <FormGroup>
            <p>
                <Link to={"/account/forgot-password"}>Forgot your password?</Link>
            </p>
            <p>
                <Link to={"/account/login"}>Log in using existing account</Link>
            </p>
            <p>
                <Link to={"/account/resend-email-confirmation"}>Resend email confirmation</Link>
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
  },
  hiddenField: {
    display: 'none'
  }
});
