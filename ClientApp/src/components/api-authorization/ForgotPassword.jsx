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
import { apiPost } from '@utils/net';
import Delayed from '@components/common/Delayed';
import LoadingButton from '@components/common/LoadingButton';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import FrontContentBase from '@components/common/FrontContentBase';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';

export default function ForgotPassword() {
  const [inputEmail, setInputEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState();
  const [actionError, setActionError] = useState();
  const [requestError, setRequestError] = useState();

  const renderBase = content => <FrontContentBase columnSize="6" centered>{content}</FrontContentBase>;
  const handleEmailChange = ({ currentTarget: { value }}) => setInputEmail(value);
  const handleResendFormSubmit = event => {
    event.preventDefault();

    if(validateForm()) {
      RProgressApi.start();
      setProcessing(true);
      setActionSuccess();

      apiPost('/api/Auth/SendResetPasswordRequest', {
        addCsrf: true,
        params: {
          Email: inputEmail
        }
      }).then(({ ok }) => {
        if(ok) {
          setActionSuccess(Strings.messages.Auth.PasswordResetRequestSent);
        } else {
          setActionError(Strings.messages.Auth.CouldNotSendPasswordRequest);
        }
      }).catch(err => {
        setRequestError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setProcessing(false);
      })
    }

  }

  function validateForm() {
    setRequestError();
    const errors = [];

    if(!isEmail(inputEmail)) {
      errors.push(Strings.messages.Auth.InvalidEmailAddress);
    }

    setActionError(errors);
    return errors.length === 0;
  }

  // if(!hasUser) {
  //   return renderBase(
  //     <Delayed>
  //       <InlineMessage text={Strings.messages.Auth.ActionOnlyForAuth} color="warning" />
  //     </Delayed>
  //   );
  // }

  // if(emailVerified) {
  //   return renderBase(<InlineMessage text={Strings.messages.Auth.EmailIsVerified} color="success" />);
  // }

  return renderBase(
    <>
      <InlineMessage text={actionSuccess} color="success"/>
      <InlineMessage text={requestError} color="danger"/>
      <InlineMessage text={actionError} color="warning"/>
      <section>
        <Form onSubmit={handleResendFormSubmit}>
          <h4>Password reset request.</h4>

          <FormGroup>
            <Label for="Input.Email">Your registration email</Label>
            <Input type="email" required name="Input.Email" id="Input.Email" 
              value={inputEmail} 
              onChange={handleEmailChange}
              readOnly={processing || !!actionSuccess}
            />
          </FormGroup>

          {!actionSuccess && (
            <FormGroup>
              <LoadingButton loading={processing}>Send reset email</LoadingButton>
            </FormGroup>
          )}

        </Form>
      </section>
    </>
  );
}
