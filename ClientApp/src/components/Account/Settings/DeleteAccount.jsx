import React, { useState, useRef } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormText } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import NoAutoCompletePasswordInput from '@components/common/NoAutoCompletePasswordInput';
import MsgBox from '@components/common/MsgBox';
import { utsj } from 'lyxlib/utils/time';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import SectionCard from '@components/common/SectionCard';


export default function DeleteAccount() {
  const [userPassword, setUserPassword] = useState('');
  const [inputNewPassword, setInputNewPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [inputPasswordScore, setInputPasswordScore] = useState(0);
  const msgboxRef = useRef();
  const [resetOpened, setResetOpened] = useState(0);
  const [validation, setValidation] = useState();
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const [popupHideButtons, setPopupHideButtons] = useState('');

  const handlePopupPasswordChange = pwd => {
    setUserPassword(pwd);
    setPopupHideButtons(!pwd ? 'delete' : '');
  }

  const handleCurrentPasswordChange = ({ currentTarget: { value }}) => setInputCurrentPassword(value);
  const handleNewPasswordChange = ({ currentTarget: { value }}) => setInputNewPassword(value);
  const handleConfirmPasswordChange = ({ currentTarget: { value }}) => setInputConfirmPassword(value);
  const handlePasswordScoreChange = score => setInputPasswordScore(score);
  const handleDeleteAccountClick = () => {
    msgboxRef.current.show({
      title: `Delete account?`,
      color: 'danger',
      buttons: 'delete,cancel',
      onConfirm: async () => {
        console.log('Deleting account...');
      }
    });
  }


  return (
    <SectionCard title={Strings.titles.DeleteYourAccount} opened={false} resetOpened={resetOpened} color="danger" allowToggle={true}>
      <InlineMessage markdown={Strings.messages.Auth.DeleteAccountAndData} color="danger" />
      <Row noGutters className="button-group horizontal fluid">
        <LoadingButton loading={processing} color="danger" onClick={handleDeleteAccountClick}>{Strings.titles.DeleteAccount}</LoadingButton>
      </Row>
      <MsgBox ref={msgboxRef} hideButtons={popupHideButtons}>
        <InlineMessage markdown={Strings.messages.Auth.DeleteAccountConfirm} color="" className="border-danger bg-white text-danger" />
        <Row form>
          <Col md={{ size: 8, offset: 2 }}>
            <Label for="User.Password">{Strings.titles.Password}</Label>
            <NoAutoCompletePasswordInput name="User.Password" id="User.Password"
              onChange={handlePopupPasswordChange}/>
            {!userPassword && <FormText>{Strings.messages.TypeYourPassword}</FormText>}
          </Col>
        </Row>
      </MsgBox>
    </SectionCard>
  );
}
