import React, { useState, useEffect } from 'react';
import { useQuery } from 'lyxlib/react/hooks/router';
import { Button, Alert } from 'reactstrap';
import FrontContentBase from '@components/common/FrontContentBase';
import LoadingOverlay from '@components/common/LoadingOverlay';
import AuthorizeService from '@api-auth/AuthorizeService';
import { Link, Redirect } from 'react-router-dom';
import { RProgressApi } from 'rprogress';
import { translateRequestError } from '@i18n';
import { apiPost } from '@utils/net';


export default function ConfirmEmail() {
  const query = useQuery();
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const userId = query.get('u');
  const confirmationCode = query.get('v');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => confirmEmail(), []);

  const renderBase = content => <FrontContentBase className="reset-font-size" centered>{content}</FrontContentBase>;

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
      }).then(async ({ ok }) => {
        if(ok) {
          try {
            const userProfile = await AuthorizeService.getUserProfile();

            if(userProfile.hasUser) {
              await AuthorizeService.ajaxSignIn();
            }
          } catch(err) {}
        }
        
        setEmailConfirmed(ok);
      }).catch(err => {
        setRequestError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setIsLoading(false);
      });
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
          <Link to={"/account/settings"}>Resend confirmation email</Link>
        </p>
      </>
    );
  }

  return renderBase(
    <Alert color="success">Your email address is now confirmed!</Alert>
  );
}
