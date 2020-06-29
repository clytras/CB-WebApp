import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
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
import FrontContentBase from '@components/common/FrontContentBase';
import { apiPost } from '@utils/net';
import HttpStatus from 'http-status-codes';
import { translateCodeMessage, translateRequestError } from '@i18n';

export default function Register() {
  const [authUser] = useStoreOf('authUser');

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [inputPasswordScore, setInputPasswordScore] = useState(0);
  const [inputPrivacyPolicyAgree, setInputPrivacyPolicyAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [registerError, setRegisterError] = useState();
  const [requestError, setRequestError] = useState();
  const [accountCreated, setAccountCreated] = useState(false);
  const [successContent, setSuccessContent] = useState();
  const [preventAutoComplete, setPreventAutoComplete] = useState(true);

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
  const handlePrivacyPolicyAgreeChange = ({ currentTarget: { checked }}) => setInputPrivacyPolicyAgree(checked);

  const handleRegisterFormSubmit = event => {
    event.preventDefault();

    if(validateForm()) {
      setIsProcessing(true);
      RProgressApi.start();
  
      apiPost('/api/Auth/Register', {
        addCsrf: true,
        params: {
          Email: inputEmail,
          Password: inputPassword,
          ConfirmPassword: inputConfirmPassword
        }
      }).then(async resp => { 
        if(resp.ok) {
          let content;
  
          try {
            ({ content } = await resp.json());
          } catch(err) {}
  
          if(content && !Array.isArray(content)) {
            content = [content];
          }
  
          setAccountCreated(true);
          setSuccessContent(content);
        } else if(resp.status === HttpStatus.CONFLICT) {
          setRegisterError(Strings.messages.Auth.AccountExists);
        } else {
          let responseData = {};
          try {
            responseData = await resp.json();
          } catch(err) {}

          if (Array.isArray(responseData)) {
            setRegisterError(responseData);
          } else {
            const { errorCode } = responseData || {};
            setRegisterError(translateCodeMessage(errorCode, 'RegistrationError'));
          }

          // resp.json().then(({ errorCode }) => {
          //   setRegisterError(translateCodeMessage(errorCode, 'RegistrationError'));
          // }).catch();
        }
      }).catch(err => {
        setRequestError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setIsProcessing(false);
      });
    }
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
      .has().symbols()
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

  const renderBase = content => <FrontContentBase className="reset-font-size" centered>{content}</FrontContentBase>;

  if(isFetching) {
    return <LoadingOverlay/>;
  }

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

          <FormGroup check>
            <Label check>
              <Input type="checkbox" 
                checked={inputPrivacyPolicyAgree} 
                onChange={handlePrivacyPolicyAgreeChange}
                disabled={isProcessing}
              />{' '}<Markdown source={Strings.messages.Auth.RegisterAgreement} />
            </Label>
          </FormGroup>

          <FormGroup>
            <LoadingButton loading={isProcessing} disabled={!inputPrivacyPolicyAgree}>Register</LoadingButton>
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
