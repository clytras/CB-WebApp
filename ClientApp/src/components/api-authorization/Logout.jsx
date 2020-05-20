import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link, Redirect, useLocation } from 'react-router-dom';
import AuthService from '@api-auth/AuthorizeService';
import FrontContentBase from '@components/common/FrontContentBase';
import { RProgressApi } from 'rprogress';
import { useStoreOf } from '@stores';
import LoadingButton from '@components/common/LoadingButton';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import Delayed from '@components/common/Delayed';
import { StyleSheet, css } from 'aphrodite';
import clsx from 'clsx';
import { translateCodeMessage, translateRequestError } from '@i18n';


export default function Logout() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [requestError, setRequestError] = useState();


  console.log('Logout', authUserProfile, isFetching);

  useEffect(() => {
    (async () => {
      await AuthService.getUser();
      setIsFetching(false);
    })();
  }, []);

  const renderBase = content => <FrontContentBase columnSize="4" centered>{content}</FrontContentBase>;

  const handleLogoutClick = () => {
    console.log("Logging out");

    setIsProcessing(true);
    setRequestError(null);

    fetch('/api/Auth/Logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin'
    }).then(async resp => {
      console.log('logout resp', resp);

      if(resp.ok) {
        console.log('calling ajaxSignOut');
        await AuthService.ajaxSignOut();
      }
    }).catch(err => {
      setRequestError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setIsProcessing(false);
    });
  }

  if(isFetching) {
    return <Delayed><LoadingOverlay/></Delayed>;
  }

  if(authUserProfile.hasUser) {
    const { userName } = authUserProfile;
    return renderBase(
      <>
        <InlineMessage text={requestError} color="danger"/>
        <h4>You are logged in as:</h4>
        <p>{userName}</p>
        <LoadingButton onClick={handleLogoutClick} loading={isProcessing}>Log out</LoadingButton>
      </>
    );
  }

  return renderBase(
    <>
      <InlineMessage text={requestError} color="danger"/>
      <h4>No logged in session found</h4>
      <p>You can login to your account using the <Link to="/account/login">log in form</Link>.</p>
    </>
  );
}
