import React, { useState } from 'react';
import { Row, Col, FormGroup, Form, Label, Input } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordValidator from 'password-validator';
import { useStoreOf } from '@stores';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import SectionCard from '@components/common/SectionCard';
import clsx from 'clsx';


export default function ActivitiesData({ authUserProfile }) {
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const [validation, setValidation] = useState();
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const { hasProfile = false } = userBusinessProfile || {};

  console.log('Activities', hasProfile, userBusinessProfile);

  const handleCurrentPasswordChange = ({ currentTarget: { value }}) => setInputCurrentPassword(value);
  const handleNewPasswordChange = ({ currentTarget: { value }}) => setInputNewPassword(value);
  const handleConfirmPasswordChange = ({ currentTarget: { value }}) => setInputConfirmPassword(value);
  const handlePasswordChangeClick = () => {
    setActionError();
    setError();

    if(validate()) {
      RProgressApi.start();
      setProcessing(true);
      apiPost(`/api/Auth/ChangePassword`, {
        addAuth: true,
        params: {
          CurrentPassword: inputCurrentPassword,
          NewPassword: inputNewPassword,
          ConfirmPassword: inputConfirmPassword
        }
      }).then(async resp => {
        if(resp.ok) {
          setInputCurrentPassword('');
          setInputNewPassword('');
          setInputConfirmPassword('');
          setInputPasswordScore(0);
          toast.success(Strings.messages.Auth.PasswordChangedSuccessfully);
        } else if(resp.status === HttpStatus.UNAUTHORIZED) {
          setInputCurrentPassword('');
          setActionError(Strings.messages.Auth.CheckCurrentPasswordRetry);
        } else {
          let errorCode;

          try {
            ({ errorCode } = await resp.json());
          } catch(err) {}
  
          setActionError(translateCodeMessage(errorCode, `${HttpStatus.getStatusText(resp.status)} (${resp.status})`));
        }
      }).catch(err => {
        setError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setProcessing(false);
      });
    }
  }

  function validate() {
    setValidation();

    const errors = [];
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

    if(inputNewPassword.length && inputPasswordScore < 3) {
      errors.push(Strings.messages.Auth.WeakVulnerablePassword);
    }

    setValidation(errors);
    return errors.length === 0;
  }

  return (
    <SectionCard title="Activities" subtitle={!hasProfile && Strings.messages.Business.SaveBasicInformationBeforeActivities}
      allowToggle={hasProfile}
      color={hasProfile ? 'primary' : 'light'}
      opened={hasProfile}
      outline={hasProfile}>
      {/* <InlineMessage text={error} color="danger" />
      <InlineMessage text={validation || actionError} color="warning" />
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="User.CurrentPassword">Current password</Label>
            <Input type="password" name="User.CurrentPassword" id="User.CurrentPassword"
              value={inputCurrentPassword}
              onChange={handleCurrentPasswordChange} />
          </FormGroup>
        </Col>
      </Row>
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="User.NewPassword">New password</Label>
            <Input type="password" name="User.NewPassword" id="User.NewPassword"
              value={inputNewPassword}
              onChange={handleNewPasswordChange} />
            <PasswordStrengthBar password={inputNewPassword} onChangeScore={handlePasswordScoreChange} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="User.ConfirmPassword">Confirm password</Label>
            <Input type="password" name="User.ConfirmPassword" id="User.ConfirmPassword" 
              value={inputConfirmPassword}
              onChange={handleConfirmPasswordChange} />
          </FormGroup>
        </Col>
      </Row>
      <Row noGutters className="button-group horizontal fluid">
        <LoadingButton loading={processing} color="primary" onClick={handlePasswordChangeClick}>Change password</LoadingButton>
      </Row> */}
    </SectionCard>
  );
}
