import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import isEmail from 'validator/lib/isEmail';
import DateTime from 'luxon/src/datetime';
import { RProgressApi } from 'rprogress';
import { apiPost } from '@utils/net';
import LoadingButton from '@components/common/LoadingButton';
import InlineMessage from '@components/common/InlineMessage';
import FrontContentBase from '@components/common/FrontContentBase';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';

export default function ForgotPassword() {
  const [inputEmail, setInputEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState();
  const [actionError, setActionError] = useState();
  const [requestError, setRequestError] = useState();

  const renderBase = content => <FrontContentBase className="reset-font-size" centered>{content}</FrontContentBase>;
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
      }).then(async resp => {
        if(resp.ok) {
          setActionSuccess(Strings.messages.Auth.PasswordResetRequestSent);
        } else {
          let errorCode, content;

          try {
            ({ errorCode, content } = await resp.json());
          } catch(err) {}
  
          // setActionError(translateCodeMessage(errorCode || 'CouldNotSendPasswordRequest', `${HttpStatus.getStatusText(resp.status)} (${resp.status})`));

          let message = translateCodeMessage(errorCode, 'CouldNotSendPasswordRequest');

          if (errorCode === 'AccountLocked' && content) {
            const lockedUntil = DateTime.fromISO(content).toLocaleString(DateTime.DATETIME_SHORT);
            message = Strings.formatString(message, { lockedUntil });
          }

          setActionError(message);
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
