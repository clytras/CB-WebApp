import React, { useState, useRef, useCallback } from 'react';
import { Row, Col, Label, FormText } from 'reactstrap';
import AuthService from '@api-auth/AuthorizeService';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import NoAutoCompletePasswordInput from '@components/common/NoAutoCompletePasswordInput';
import MsgBox from '@components/common/MsgBox';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import SectionCard from '@components/common/SectionCard';


export default function DeleteAccount() {
  const [userPassword, setUserPassword] = useState('');
  const passwordRef = useRef();
  const msgboxRef = useRef();
  const msgboxDeleteAccountRef = useRef();
  const [resetOpened, setResetOpened] = useState(0);
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const [popupHideButtons, setPopupHideButtons] = useState('');
  const [redirect, setRedirect] = useState();

  const handlePopupPasswordChange = pwd => {
    setUserPassword(pwd);
    passwordRef.current = pwd;
    setPopupHideButtons(!pwd ? 'delete' : '');
  }

  const handleDeleteAccountClick = () => {
    msgboxDeleteAccountRef.current.show({
      title: Strings.messages.Confirms.DeleteAccount,
      color: 'danger',
      buttons: 'delete,cancel',
      onConfirm: () => {
        const Password = passwordRef.current;

        console.log(`Deleting account...`);

        if (Password) {
          RProgressApi.start();
          setProcessing(true);
    
          apiPost('/api/Auth/DeleteAccount', {
            addCsrf: true,
            params: { Password }
          }).then(async resp => {
            if (resp.ok) {
              // setActionSuccess(Strings.messages.Auth.PasswordResetSuccess);
              console.log('deleting... log out');

              await AuthService.ajaxSignOut();
              setRedirect('/');
            } else if (resp.status === 400) {
              msgboxRef.current.show({
                title: Strings.titles.WrongPassword,
                message: Strings.messages.Auth.WrongPasswordForDeleteAccount,
                color: 'warning'
              });
            } else {
              let errorCode;
    
              try {
                ({ errorCode } = await resp.json());
              } catch(err) {}
      
              const message = translateCodeMessage(errorCode, `${HttpStatus.getStatusText(resp.status)} (${resp.status})`);
              msgboxRef.current.show({
                title: Strings.messages.Auth.CouldNotDeleteAccount,
                message,
                color: 'warning'
              });
            }
          }).catch(err => {
            const message = translateRequestError(err);
            msgboxRef.current.show({
              title: Strings.titles.RequestProblem,
              message,
              color: 'danger'
            });
          }).finally(() => {
            RProgressApi.complete();
            setProcessing(false);
          });
        }
      }
    });
  };

  if (redirect) {
    window.location.href = '/';
  }

  return (
    <SectionCard title={Strings.titles.DeleteYourAccount} opened={false} resetOpened={resetOpened} color="danger" allowToggle={true}>
      <InlineMessage markdown={Strings.messages.Auth.DeleteAccountAndData} color="danger" />
      <Row noGutters className="button-group horizontal fluid">
        <LoadingButton loading={processing} disabled={Boolean(redirect)} color="danger" onClick={handleDeleteAccountClick}>{Strings.titles.DeleteAccount}</LoadingButton>
      </Row>
      <MsgBox ref={msgboxRef} />
      <MsgBox ref={msgboxDeleteAccountRef} hideButtons={popupHideButtons} size="lg">
        <InlineMessage markdown={Strings.messages.Auth.DeleteAccountConfirm} color="" className="border-danger bg-white text-danger" />
        <Row form>
          <Col lg={{ size: 4, offset: 4 }} md={{ size: 8, offset: 2 }}>
            <Label for="User.CurrentPassword">{Strings.titles.Password}</Label>
            <NoAutoCompletePasswordInput name="User.CurrentPassword" id="User.CurrentPassword"
              onChange={handlePopupPasswordChange}/>
            {!userPassword && <FormText>{Strings.messages.TypeYourPassword}</FormText>}
          </Col>
        </Row>
      </MsgBox>
    </SectionCard>
  );
}
