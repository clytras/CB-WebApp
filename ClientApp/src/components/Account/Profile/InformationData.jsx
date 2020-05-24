import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, FormGroup, Form, FormFeedback, FormText, Label, Input } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import isEmpty from 'validator/es/lib/isEmpty';
import isEmail from 'validator/es/lib/isEmail';
import isLength from 'validator/es/lib/isLength';
import isPostalCode from 'validator/es/lib/isPostalCode';
import { isPhoneNumber, ifString } from '@utils/validators';
import CheckBox, { OptionsGroup } from '@components/common/CheckBox';
import { useStoreOf } from '@stores';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import SectionCard from '@components/common/SectionCard';
import Select from '@components/common/Select';
import { getCountriesForSelect } from '@data/Countries';
import clsx from 'clsx';


const countriesOptions = getCountriesForSelect();

export default function InformationData() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const inputEmailRef = useRef();
  const [isDirty, setIsDirty] = useState(false);
  const [useAccountEmail, setUseEmailAccount] = useState(true);
  const [profile, setProfile] = useState({
    CompanyName: '',
    Email: '',
    Telephone: '',
    StreetAddress: '',
    AddressLine2: '',
    City: '',
    Region: '',
    PostalCode: '',
    ContactName: '',
    ContactEmail: '',
    ContactPhone: ''
  });

  const [validation, setValidation] = useState({
    // Telephone: 'Wrong number',
    // Email: true
  });
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    console.log('InfoData', authUserProfile, userBusinessProfile);
    const {
      CompanyName = '',
      Email = null,
      Telephone,
      StreetAddress
    } = userBusinessProfile || {};

    // setProfileCompanyName(CompanyName)
  }, []);

  useEffect(() => {
    if (!useAccountEmail) {
      inputEmailRef.current.focus()
    }
  }, [useAccountEmail]);

  const handleUseAccountEmailChange = useCallback(() => {
    setUseEmailAccount(prev => !prev);
  }, [setUseEmailAccount]);

  const handleInputChange = field => ({ currentTarget: { value }}) => {
    setIsDirty(true);
    setProfile(p => ({ ...p, [field]: value }));
  }


  const handlePasswordChangeClick = () => {

    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
    // return;


    // setActionError();
    // setError();

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

  function validate() {
    const errors = {};

    if (isEmpty(profile.CompanyName)) {
      errors.CompanyName = true;
    }


    setValidation(errors);
    return errors.length === 0;
  }

  return (
    <SectionCard title={Strings.titles.Information} allowToggle={true}>
      <InlineMessage text={error} color="danger" />
      <InlineMessage text={validation || actionError} color="warning" />

      <Row form>
        <Col md={8}>
          <FormGroup>
            <Label for="Profile.CompanyName">{Strings.titles.CompanyName}</Label>
            <Input name="Profile.CompanyName" id="Profile.CompanyName" required
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.CompanyName}
              onChange={handleInputChange('CompanyName')} />
          </FormGroup>
        </Col>
      </Row>

      <Row form>
        <Col md={7}>
          <FormGroup>
            <Label for="Profile.Email">{Strings.titles.EmailAddress}</Label>
            <Input innerRef={inputEmailRef} name="Profile.Email" id="Profile.Email" required type="email"
              invalid={!!validation.Email}
              disabled={useAccountEmail}
              value={useAccountEmail ? authUserProfile.userName : profile.ContactEmail}
              onChange={handleInputChange('Email')} />
            {ifString(validation.Email, <FormFeedback>{validation.Email}</FormFeedback>)}
            <CheckBox className="mt-2" label={Strings.titles.UseAccountEmailAddress}
              checked={useAccountEmail} onChange={handleUseAccountEmailChange} />
          </FormGroup>
        </Col>
        <Col md={5}>
          <FormGroup>
            <Label for="Profile.Telephone">{Strings.titles.TelephoneNumber}</Label>
            <Input name="Profile.Telephone" id="Profile.Telephone" required
              invalid={!!validation.Telephone}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.Telephone}
              onChange={handleInputChange('Telephone')} />
            {ifString(validation.Telephone, <FormFeedback>{validation.Telephone}</FormFeedback>)}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>{Strings.titles.Address}</h5>
        </Col>
      </Row>

      <FormGroup>
        <Label for="Profile.CompanyLocation.StreetAddress">{Strings.titles.StreenAddress}</Label>
        <Input name="Profile.CompanyLocation.StreetAddress" id="Profile.CompanyLocation.StreetAddress" required
          placeholder={Strings.placeholders.ThisFieldIsRequired}
          value={profile.StreetAddress}
          onChange={handleInputChange('StreetAddress')} />
      </FormGroup>

      <FormGroup>
        <Label for="Profile.CompanyLocation.AddressLine2">{Strings.titles.AdditionalAddressInformation}</Label>
        <Input name="Profile.CompanyLocation.AddressLine2" id="Profile.CompanyLocation.AddressLine2"
          value={profile.AddressLine2}
          onChange={handleInputChange('AddressLine2')} />
      </FormGroup>
      
      <Row form>
        <Col lg={4} md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.City">{Strings.titles.City}</Label>
            <Input name="Profile.CompanyLocation.City" id="Profile.CompanyLocation.City" required
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.City}
              onChange={handleInputChange('City')} />
          </FormGroup>
        </Col>
        <Col lg={4} md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.Region">{Strings.titles.StateRegionProvince}</Label>
            <Input name="Profile.CompanyLocation.Region" id="Profile.CompanyLocation.Region"
              value={profile.Region}
              onChange={handleInputChange('Region')} />
          </FormGroup>
        </Col>
        <Col md={'auto'}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.PostalCode">{Strings.titles.PostalCode}</Label>
            <Input name="Profile.CompanyLocation.PostalCode" id="Profile.CompanyLocation.PostalCode" required
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.PostalCode}
              onChange={handleInputChange('PostalCode')} />
          </FormGroup>
        </Col>
      </Row>

      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.Country">{Strings.titles.Country}</Label>
            <Select name="Profile.CompanyLocation.Country" inputId="Profile.CompanyLocation.Country"
              value={profile.Country}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              onChange={() => {}}
              options={countriesOptions} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>{Strings.titles.ContactPerson}</h5>
        </Col>
      </Row>

      <Row form>
        <Col lg={4} md={12}>
          <FormGroup>
            <Label for="Profile.ContactPerson.Name">{Strings.titles.Name}</Label>
            <Input name="Profile.ContactPerson.Name" id="Profile.ContactPerson.Name" required
              invalid={!!validation.ContactName}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.ContactName}
              onChange={handleInputChange('ContactName')} />
            {ifString(validation.ContactName, <FormFeedback>{validation.ContactName}</FormFeedback>)}
          </FormGroup>
        </Col>
        <Col lg={4} md={8}>
          <FormGroup>
            <Label for="Profile.ContactPerson.Email">{Strings.titles.Email}</Label>
            <Input name="Profile.ContactPerson.Email" id="Profile.ContactPerson.Email" required type="email"
              invalid={!!validation.ContactEmail}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.ContactEmail}
              onChange={handleInputChange('ContactEmail')} />
            {ifString(validation.ContactEmail, <FormFeedback>{validation.ContactEmail}</FormFeedback>)}
          </FormGroup>
        </Col>
        <Col lg={4} md={8}>
          <FormGroup>
            <Label for="Profile.ContactPerson.Telephone">{Strings.titles.Telephone}</Label>
            <Input name="Profile.ContactPerson.Telephone" id="Profile.ContactPerson.Telephone" required
              invalid={!!validation.ContactPhone}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.ContactPhone}
              onChange={handleInputChange('ContactPhone')} />
            {ifString(validation.ContactPhone, <FormFeedback>{validation.ContactPhone}</FormFeedback>)}
          </FormGroup>
        </Col>
      </Row>

      <Row noGutters className="button-group horizontal fluid">
        {isDirty && <LoadingButton color="primary" loading={processing} 
          onClick={handlePasswordChangeClick}>{Strings.titles.SaveProfileInformation}</LoadingButton>}
      </Row>
    </SectionCard>
  );
}
