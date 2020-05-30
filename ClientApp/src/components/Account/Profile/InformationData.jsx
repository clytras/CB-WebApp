import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Row, Col, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import isEmpty from 'validator/es/lib/isEmpty';
import isEmail from 'validator/es/lib/isEmail';
import isLength from 'validator/es/lib/isLength';
import isPostalCode from 'validator/es/lib/isPostalCode';
import { isPhoneNumber, ifString, isString } from '@utils/validators';
import CheckBox, { OptionsGroup } from '@components/common/CheckBox';
import { useStoreOf } from '@stores';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import { BusinessProfile, saveProfileInformation }  from '@data/BusinessProfile';
import SectionCard from '@components/common/SectionCard';
import Select from '@components/common/Select';
import { getCountriesForSelect } from '@data/Countries';
import clsx from 'clsx';


export default function InformationData() {
  const countriesOptions = useMemo(() => getCountriesForSelect(), []);
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile, setUserBusinessProfile] = useStoreOf('userBusinessProfile', 'setUserBusinessProfile');
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
    Country: '',
    PostalCode: '',
    ContactName: '',
    ContactEmail: '',
    ContactPhone: ''
  });
  const [profileCountryValue, setProfileCountryValue] = useState({ value: '', label: '' });
  const [validation, setValidation] = useState({});
  const [validationError, setValidationError] = useState();
  const [actionError, setActionError] = useState();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // console.log('InfoData', authUserProfile, userBusinessProfile, countriesOptions);

    if (userBusinessProfile.hasProfile) {
      let {
        companyName: CompanyName = '',
        email: Email,
        telephone: Telephone = '',
        companyLocation: {
          streetAddress: StreetAddress = '',
          addressLine2: AddressLine2 = '',
          city: City = '',
          region: Region = '',
          postalCode: PostalCode = '',
          country: Country = ''
        } = {},
        contactPerson: {
          name: ContactName = '',
          email: ContactEmail = '',
          telephone: ContactPhone = ''
        } = {}
      } = userBusinessProfile || {};

      if (!Boolean(Email)) {
        setUseEmailAccount(true);
        Email = '';
      }

      let countryText = '';
      const selectedCountry = Country && countriesOptions.find(({ value: v }) => v === Country);
      if (selectedCountry) {
        countryText = selectedCountry.label;
      }

      setProfileCountryValue({ value: countryText, label: countryText });
      setProfile({
        CompanyName, Email, Telephone,
        StreetAddress, AddressLine2, City, Region, PostalCode, Country,
        ContactName, ContactEmail, ContactPhone
      });
    }
  }, [userBusinessProfile]);

  useEffect(() => {
    if (!useAccountEmail) {
      inputEmailRef.current.focus();
    } else {
      setProfile(p => ({ ...p, Email: '' }));
    }
  }, [useAccountEmail, setProfile]);

  const handleUseAccountEmailChange = useCallback(() => {
    setUseEmailAccount(prev => !prev);
    setIsDirty(true);
  }, [setUseEmailAccount, setIsDirty]);

  const handleInputChange = field => data => {
    const { value } = 'value' in data ? data : data.currentTarget;
    setIsDirty(true);
    setValidationError();
    const v = value !== undefined ? value : '';
    setValidation(p => ({ ...p, [field]: false }));
    setProfile(p => ({ ...p, [field]: v }));
  }

  const handleCountryChange = ({ value, label }) => {
    console.log('handleCountryChange', value, label);
    setProfileCountryValue({ value, label });
    setIsDirty(true);
    setValidationError();
    setValidation(p => ({ ...p, Country: false }));
    setProfile(p => ({ ...p, Country: value }));
  }

  const handleSaveProfileClick = event => {
    setActionError();
    setError();
    setSuccess();

    if (validate()) {
      RProgressApi.start();
      setValidationError();
      setProcessing(true);

      const {
        CompanyName, Email, Telephone,
        StreetAddress, AddressLine2, City, Region, PostalCode, Country,
        ContactName, ContactEmail, ContactPhone
      } = profile;
      
      saveProfileInformation({
        CompanyName,
        Email: useAccountEmail ? null : Email,
        Telephone,
        CompanyLocation: {
          StreetAddress,
          AddressLine2,
          City,
          Region,
          PostalCode,
          Country
        },
        ContactPerson: {
          Name: ContactName,
          Email: ContactEmail || null,
          Telephone: ContactPhone || null
        }
      }).then(async resp => {
        if (resp.ok) {
          setSuccess(Strings.messages.ProfileInformationSaved);
          setIsDirty(false);

          const newProfile = await resp.json();
          setUserBusinessProfile(new BusinessProfile(newProfile));
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
    } else {
      setValidationError(Strings.messages.InvalidFieldsDataTryAgain);
    }
  }

  const validate = useCallback((field, value) => {
    const errors = {};
    const only = (name, f) => {
      const v = value === undefined ? profile[name] : value;
      if (field === name) {
        errors[field] = false;
        f(v);
        setValidation(p => ({ ...p, ...errors }));
        return true;
      } else if(field === undefined) {
        f(v);
      }
    }

    if (only('CompanyName', v => {
      if (isEmpty(v)) {
        errors.CompanyName = true;
      }
    })) return;

    if (only('Email', v => {
      if (!useAccountEmail) {
        if (isEmpty(v)) {
          errors.Email = true;
        } else if (!isEmail(v)) {
          errors.Email = Strings.validation.Fields.NotValidEmail;
        }
      }
    })) return;

    if (only('Telephone', v => {
      if (isEmpty(v)) {
        errors.Telephone = true;
      } else if(!isPhoneNumber(v)) {
        errors.Telephone = Strings.formatString(
          Strings.validation.Fields.InvalidTelephone, { min: 10, max: 15 });
      }
    })) return;

    if (only('StreetAddress', v => {
      if (isEmpty(v)) {
        errors.StreetAddress = true;
      }
    })) return;

    if (only('City', v => {
      if (isEmpty(v)) {
        errors.City = true;
      }
    })) return;

    if (only('PostalCode', v => {
      if (isEmpty(v)) {
        errors.PostalCode = true;
      } else if (!isPostalCode(v, 'any')) {
        errors.PostalCode = Strings.validation.Fields.NotValidPostalCode;
      }
    })) return;

    if (only('Country', v => {
      if (isEmpty(v)) {
        errors.Country = true;
      }
    })) return;

    if (only('ContactName', v => {
      if (isEmpty(v)) {
        errors.ContactName = true;
      }
    })) return;

    // if (only('ContactEmail', v => {
    //   if (isEmpty(v)) {
    //     errors.ContactEmail = true;
    //   } else if (!isEmail(v)) {
    //     errors.ContactEmail = Strings.validation.Fields.NotValidEmail;
    //   }
    // })) return;

    if (only('ContactPhone', v => {
      if(!isEmpty(v) && !isPhoneNumber(v)) {
        errors.ContactPhone = Strings.formatString(
          Strings.validation.Fields.InvalidTelephone, { min: 10, max: 15 });
      }
      // if (isEmpty(v)) {
      //   errors.ContactPhone = true;
      // } else if(!isPhoneNumber(v)) {
      //   errors.ContactPhone = Strings.formatString(
      //     Strings.validation.Fields.InvalidTelephone, { min: 10, max: 15 });
      // }
    })) return;

    setValidation(errors);
    return Object.keys(errors).length === 0;
  }, [profile, useAccountEmail, setValidation]);

  return (
    <SectionCard title={Strings.titles.Information} allowToggle={true}>
      <InlineMessage text={error} color="danger" />

      <Row form>
        <Col md={8}>
          <FormGroup>
            <Label for="Profile.CompanyName">{Strings.titles.CompanyName}</Label>
            <Input name="Profile.CompanyName" id="Profile.CompanyName" required
              invalid={!!validation.CompanyName}
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
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={useAccountEmail ? authUserProfile.userName : profile.Email}
              onChange={handleInputChange('Email')} />
            {isString(validation.Email) && <FormFeedback>{validation.Email}</FormFeedback>}
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
            {isString(validation.Telephone) && <FormFeedback>{validation.Telephone}</FormFeedback>}
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
          invalid={!!validation.StreetAddress}
          value={profile.StreetAddress}
          onChange={handleInputChange('StreetAddress')} />
      </FormGroup>

      <FormGroup>
        <Label for="Profile.CompanyLocation.AddressLine2">{Strings.titles.AdditionalAddressInformation}</Label>
        <Input name="Profile.CompanyLocation.AddressLine2" id="Profile.CompanyLocation.AddressLine2"
          value={profile.AddressLine2 || ''}
          onChange={handleInputChange('AddressLine2')} />
      </FormGroup>
      
      <Row form>
        <Col lg={4} md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.City">{Strings.titles.City}</Label>
            <Input name="Profile.CompanyLocation.City" id="Profile.CompanyLocation.City" required
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              invalid={!!validation.City}
              value={profile.City}
              onChange={handleInputChange('City')} />
          </FormGroup>
        </Col>
        <Col lg={4} md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.Region">{Strings.titles.StateRegionProvince}</Label>
            <Input name="Profile.CompanyLocation.Region" id="Profile.CompanyLocation.Region"
              value={profile.Region || ''}
              onChange={handleInputChange('Region')} />
          </FormGroup>
        </Col>
        <Col lg={4} md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.PostalCode">{Strings.titles.PostalCode}</Label>
            <Input name="Profile.CompanyLocation.PostalCode" id="Profile.CompanyLocation.PostalCode" required
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              invalid={!!validation.PostalCode}
              value={profile.PostalCode}
              onChange={handleInputChange('PostalCode')} />
            {isString(validation.PostalCode) && <FormFeedback>{validation.PostalCode}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>

      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="Profile.CompanyLocation.Country">{Strings.titles.Country}</Label>
            <Select name="Profile.CompanyLocation.Country" inputId="Profile.CompanyLocation.Country"
              invalid={!!validation.Country}
              // defaultInputValue={profileCountryLabel}
              // defaultValue={profileCountryCode}
              // inputValue={profileCountryLabel}
              value={profileCountryValue}
              placeholder={Strings.placeholders.ThisFieldIsRequired}
              onChange={handleCountryChange}
              // onInputChange={handleCountryChange}
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
            {isString(validation.ContactName) && <FormFeedback>{validation.ContactName}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col lg={4} md={8}>
          <FormGroup>
            <Label for="Profile.ContactPerson.Email">{Strings.titles.Email}</Label>
            <Input name="Profile.ContactPerson.Email" id="Profile.ContactPerson.Email" type="email"
              invalid={!!validation.ContactEmail}
              // placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.ContactEmail || ''}
              onChange={handleInputChange('ContactEmail')} />
            {isString(validation.ContactEmail) && <FormFeedback>{validation.ContactEmail}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col lg={4} md={8}>
          <FormGroup>
            <Label for="Profile.ContactPerson.Telephone">{Strings.titles.Telephone}</Label>
            <Input name="Profile.ContactPerson.Telephone" id="Profile.ContactPerson.Telephone"
              invalid={!!validation.ContactPhone}
              // placeholder={Strings.placeholders.ThisFieldIsRequired}
              value={profile.ContactPhone || ''}
              onChange={handleInputChange('ContactPhone')} />
            {isString(validation.ContactPhone) && <FormFeedback>{validation.ContactPhone}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>

      <InlineMessage markdown={success} color="success" />
      <InlineMessage markdown={validationError || actionError} color="warning" />

      <Row noGutters className="button-group horizontal fluid">
        {isDirty && <LoadingButton color="primary" loading={processing} 
          onClick={handleSaveProfileClick}>{Strings.titles.SaveProfileInformation}</LoadingButton>}
      </Row>
    </SectionCard>
  );
}
