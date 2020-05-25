import React, { useState } from 'react';
import { Row, Col, FormGroup, Form, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { MdDone } from 'react-icons/md';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import styled from 'styled-components';
import { useStoreOf } from '@stores';
import Activities from '@data/BusinessProfile/Activities';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import SectionCard from '@components/common/SectionCard';
import clsx from 'clsx';




export default function ActivitiesData({ authUserProfile }) {
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const [selected, setSelected] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [validation, setValidation] = useState();
  const [validationError, setValidationError] = useState();
  const [actionError, setActionError] = useState();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const { hasProfile = false } = userBusinessProfile || {};

  const handleOptionClick = (head, sub, option) => () => {
    selectOption(head, sub, option);
  }

  const selectOption = (head, sub, option, value) => {
    setSelected(o => {
      if (!(head in o)) {
        o[head] = {};
      }

      let oset = o[head];

      if (sub) {
        if (!(sub in oset)) {
          oset[sub] = {};
        }
        oset = oset[sub];
      }

      let v = value === undefined ? oset[option] : value;
      oset[option] = v === undefined ? true : !v;

      return { ...o };
    });
  }

  const hasOption = (options, head, sub, option) => {
    if (head in options) {
      if (sub) {
        if (sub in options[head]) {
          return options[head][sub][option] === true;
        }
      } else {
        return options[head][option] === true;
      }
    }
    return false;
  }

  // const handleNewPasswordChange = ({ currentTarget: { value }}) => setInputNewPassword(value);
  // const handleConfirmPasswordChange = ({ currentTarget: { value }}) => setInputConfirmPassword(value);
  const handleSaveActivitiesClick = () => {
    setActionError();
    setError();

    // if(validate()) {
    //   RProgressApi.start();
    //   setProcessing(true);
    //   apiPost(`/api/Auth/ChangePassword`, {
    //     addAuth: true,
    //     params: {
    //       CurrentPassword: inputCurrentPassword,
    //       NewPassword: inputNewPassword,
    //       ConfirmPassword: inputConfirmPassword
    //     }
    //   }).then(async resp => {
    //     if(resp.ok) {
    //       setInputCurrentPassword('');
    //       setInputNewPassword('');
    //       setInputConfirmPassword('');
    //       setInputPasswordScore(0);
    //       toast.success(Strings.messages.Auth.PasswordChangedSuccessfully);
    //     } else if(resp.status === HttpStatus.UNAUTHORIZED) {
    //       setInputCurrentPassword('');
    //       setActionError(Strings.messages.Auth.CheckCurrentPasswordRetry);
    //     } else {
    //       let errorCode;

    //       try {
    //         ({ errorCode } = await resp.json());
    //       } catch(err) {}
  
    //       setActionError(translateCodeMessage(errorCode, `${HttpStatus.getStatusText(resp.status)} (${resp.status})`));
    //     }
    //   }).catch(err => {
    //     setError(translateRequestError(err));
    //   }).finally(() => {
    //     RProgressApi.complete();
    //     setProcessing(false);
    //   });
    // }
  }

  // function validate() {
  //   setValidation();

  //   const errors = [];
  //   const passwordValidatorSchema = new PasswordValidator();

  //   passwordValidatorSchema
  //     .is().min(8)
  //     .has().uppercase()
  //     .has().lowercase()
  //     .has().digits()
  //     .has().not().spaces();
    
  //   if(!passwordValidatorSchema.validate(inputNewPassword)) {
  //     errors.push(Strings.messages.Auth.InvalidPassword);
  //   }

  //   if(inputNewPassword !== inputConfirmPassword) {
  //     errors.push(Strings.messages.Auth.ConfirmPasswordNotMatch);
  //   }

  //   if(inputNewPassword.length && inputPasswordScore < 3) {
  //     errors.push(Strings.messages.Auth.WeakVulnerablePassword);
  //   }

  //   setValidation(errors);
  //   return errors.length === 0;
  // }

  console.log('Strings.titles', Strings.titles);

  function renderSubActivities(head, sub, options) {
    if (!options || !'$' in options || options.$.length === 0) {
      return null;
    }

    return (
      <ListGroup key={`sub-activity-${head}-${sub}`} className={'options-list mb-4'}>
        {sub && <ListGroupItem color="primary">{Strings.Business.Lists[sub]}</ListGroupItem>}
        {options.$.map(option => (
          <ListGroupItem key={`option-activity-${head}-${sub}-${option}`} action
            className={hasOption(selected, head, sub, option) ? 'selected' : 'text-secondary'}
            tag="button" onClick={handleOptionClick(head, sub, option)}><MdDone className="text-muted" size="1.5em"/>{Strings.Business.Lists[option]}</ListGroupItem>)
        )}
      </ListGroup>
    );
  }

  return (
    <SectionCard title="Activities" subtitle={!hasProfile && Strings.messages.Business.SaveBasicInformationBeforeActivities}
      allowToggle={hasProfile}
      color={hasProfile ? 'primary' : 'light'}
      opened={hasProfile}
      outline={hasProfile}>
      <InlineMessage text={error} color="danger" />
      <InlineMessage text={validation || actionError} color="warning" />

      {Object.entries(Activities).map(([head, subs]) => {
        const own = { $: [] };

        return (
          <div key={`head-activity-${head}`}>
            <Row className="mb-3">
              <Col>
                <h5>{Strings.Business.Lists[head]}</h5>
                <hr/>
              </Col>
            </Row>
            {Object.entries(subs).map(([sub, options]) => {
              if (options === '$') {
                own.$.push(sub);
                return null;
              }
              return renderSubActivities(head, sub, options);
            })}
            {own.length !== 0 && renderSubActivities(head, null, own)}
            <ListGroup className="mb-4">
              <ListGroupItem color="primary">{Strings.titles.OtherText}</ListGroupItem>
              <ListGroupItem>
                <Input type="textarea" />
              </ListGroupItem>
            </ListGroup>
          </div>
        );
      })}

      <InlineMessage markdown={success} color="success" />
      <InlineMessage markdown={validationError || actionError} color="warning" />

      <Row noGutters className="button-group horizontal fluid">
        {isDirty && <LoadingButton color="primary" loading={processing} 
          onClick={handleSaveActivitiesClick}>{Strings.titles.SaveProfileActivities}</LoadingButton>}
      </Row>
    </SectionCard>
  );
}
