import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'reactstrap';
import FrontContentBase from '@components/common/FrontContentBase';
import LoadingOverlay from '@components/common/LoadingOverlay';
import { Link, Redirect } from 'react-router-dom';
import { RProgressApi } from 'rprogress';
// import { useStoreOf } from '@stores';
// import { Strings } from '@i18n';

// import InlineMessage from '@components/common/InlineMessage';
// import { StyleSheet, css } from 'aphrodite';
// import clsx from 'clsx';
import { translateRequestError } from '@i18n';
import { apiPost } from '@utils/net';


export default function ConfirmEmail({
  match: {
    params: {
      userId, confirmationCode 
    }
  }
}) {
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => confirmEmail(), []);

  const renderBase = content => <FrontContentBase columnSize="6" centered>{content}</FrontContentBase>;

  function confirmEmail() {
    if(userId && confirmationCode) {
      setIsLoading(true);
      RProgressApi.start();

      apiPost('/api/Auth/ConfirmEmail', {
        addCsrf: true,
        params: {
          UserId: userId,
          ConfirmationCode: confirmationCode
        }
      }).then(async resp => {
        console.log('Ajax confirm email resp', resp);
        setEmailConfirmed(resp.ok);
      }).catch(err => {
        setRequestError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setIsLoading(false);
      });

      // fetch('/api/Auth/ConfirmEmail', {
      //   method: 'POST',
      //   mode: 'cors',
      //   credentials: 'same-origin',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     UserId: userId,
      //     ConfirmationCode: confirmationCode
      //   })
      // }).then(async resp => {
      //   console.log('Ajax confirm email resp', resp);
      //   setEmailConfirmed(resp.ok);
      // }).catch(err => {
      //   setRequestError(translateRequestError(err));
      // }).finally(() => {
      //   RProgressApi.complete();
      //   setIsLoading(false);
      // });
    }
  }

  if(!userId || !confirmationCode) {
    return <Redirect to="/"/>;
  }

  if(isLoading) {
    return renderBase(
      <>
        <p>Validating confirmation code...</p>
        <LoadingOverlay/>
      </>
    );
  }
  
  if(requestError) {
    return renderBase(
      <>
        <Alert color="danger">
          <p>There was a problem with the confirmation request</p>
          <p>{requestError}</p>
        </Alert>
        <Button onClick={confirmEmail}>Repeat confirmation request</Button>
      </>
    );
  }

  if(!emailConfirmed) {
    return renderBase(
      <>
        <Alert color="warning">This email confirmation request is invalid or the validation code is expired</Alert>
        <p>
          <Link to={"/account/forgot-password"}>Resend confirmation email</Link>
        </p>
      </>
    );
  }

  return renderBase(
    <Alert color="success">Your email address is now confirmed!</Alert>
  );

  // return (
  //   <>
  //     <div>Router</div>
  //     <pre>{JSON.stringify(props, null, 2)}</pre>
  //     <pre>{JSON.stringify(router, null, 2)}</pre>
  //   </>
  // );
}
