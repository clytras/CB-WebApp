import React, { useState, useEffect } from 'react';
import { useQuery } from 'lyxlib/react/hooks/router';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordValidator from 'password-validator';
import isEmail from 'validator/lib/isEmail';
import { RProgressApi } from 'rprogress';
import LoadingButton from '@components/common/LoadingButton';
import InlineMessage from '@components/common/InlineMessage';
import FrontContentBase from '@components/common/FrontContentBase';
import { apiPost } from '@utils/net';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';


export default function ResetPassword() {
  const query = useQuery();
  const [inputEmail, setInputEmail] = useState('');
  const [inputNewPassword, setInputNewPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [inputNewPasswordScore, setInputNewPasswordScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState();
  const [actionError, setActionError] = useState();
  const [requestError, setRequestError] = useState();
  const [preventAutoComplete, setPreventAutoComplete] = useState(true);

  const userId = query.get('u');
  const resetPasswordCode = query.get('v');

  useEffect(() => {
    setTimeout(() => setPreventAutoComplete(false), 600);
  }, []);

  const renderBase = content => <FrontContentBase columnSize="6" centered>{content}</FrontContentBase>;
  const handleEmailChange = ({ currentTarget: { value }}) => setInputEmail(value);
  const handleNewPasswordChange = ({ currentTarget: { value }}) => setInputNewPassword(value);
  const handleConfirmPasswordChange = ({ currentTarget: { value }}) => setInputConfirmPassword(value);
  const handleNewPasswordScoreChange = score => setInputNewPasswordScore(score);
  const handleResetFormSubmit = event => {
    event.preventDefault();

    setActionSuccess();

    if(validateForm()) {
      apiPost('/api/Auth/ResetPassword', {
        addCsrf: true,
        params: {
          UserId: userId,
          ConfirmationCode: resetPasswordCode,
          Email: inputEmail,
          NewPassword: inputNewPassword,
          ConfirmPassword: inputConfirmPassword
        }
      }).then(async resp => {
        if(resp.ok) {
          setActionSuccess(Strings.messages.Auth.PasswordResetSuccess);
        } else {
          let errorCode;

          try {
            ({ errorCode } = await resp.json());
          } catch(err) {}
  
          setActionError(translateCodeMessage(errorCode, `${HttpStatus.getStatusText(resp.status)} (${resp.status})`));
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
    setRequestError();

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
    
    if(!passwordValidatorSchema.validate(inputNewPassword)) {
      errors.push(Strings.messages.Auth.InvalidPassword);
    }

    if(inputNewPassword !== inputConfirmPassword) {
      errors.push(Strings.messages.Auth.ConfirmPasswordNotMatch);
    }

    if(inputNewPassword.length && inputNewPasswordScore < 3) {
      errors.push(Strings.messages.Auth.WeakVulnerablePassword);
    }

    setActionError(errors);
    return errors.length === 0;
  }

  if(!userId || !resetPasswordCode) {
    return <Redirect to="/"/>;
  }

  return renderBase(
    <>
      <InlineMessage text={actionSuccess} color="success"/>
      <InlineMessage text={requestError} color="danger"/>
      <InlineMessage text={actionError} color="warning"/>
      {!actionSuccess && (
        <section>
          <Form onSubmit={handleResetFormSubmit}>
            <h4>Password reset.</h4>

            <FormGroup>
              <Label for="Input.Email">Your registration email</Label>
              <Input type="email" required name="Input.Email" id="Input.Email" 
                value={inputEmail} 
                onChange={handleEmailChange}
                readOnly={isProcessing || preventAutoComplete}
              />
            </FormGroup>

            <Row>
              <Col md={8} lg={8}>
                <FormGroup>
                  <Label for="Register.Password">New password</Label>
                  <Input type="password" required name="Input.NewPassword" id="Input.NewPassword"
                    value={inputNewPassword} 
                    onChange={handleNewPasswordChange}
                    readOnly={isProcessing || preventAutoComplete}
                  />
                  <PasswordStrengthBar password={inputNewPassword} onChangeScore={handleNewPasswordScoreChange} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={8} lg={8}>
                <FormGroup>
                  <Label for="Input.ConfirmPassword">Confirm Password</Label>
                  <Input type="password" required name="Input.ConfirmPassword" id="Input.ConfirmPassword"
                    value={inputConfirmPassword} 
                    onChange={handleConfirmPasswordChange}
                    readOnly={isProcessing || preventAutoComplete}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <LoadingButton loading={isProcessing}>Reset password</LoadingButton>
            </FormGroup>

          </Form>
        </section>
      )}
    </>
  );
}
