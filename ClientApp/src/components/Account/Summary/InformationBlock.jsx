import React from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';


export default function InformationBlock() {
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');

  const {
    companyLocation: {
      streetAddress = '',
      addressLine2,
      region,
      city = '',
      postalCode = '',
      country = ''
    } = {},
    contactPerson: {
      name: contactName = '',
      email: contactEmail,
      telephone: contactPhone
    } = {}
  } = userBusinessProfile || {};

  const countryText = country && country in Strings.Collections.Countries ? 
    Strings.Collections.Countries[country] :
    `[${country}]`;

  return (
    <Row>

      <Col lg={6}>
        <ListGroup className="display-group mb-4">
          <ListGroupItem color="info">
            <h4 className="header">{Strings.titles.Address}</h4>
          </ListGroupItem>
          <ListGroupItem>
            <dl>
              <dt>{Strings.titles.StreenAddress}</dt>
              <dd>{streetAddress}</dd>
              {addressLine2 && (
                <>
                  <dt>{Strings.titles.AdditionalAddressInformation}</dt>
                  <dd>{addressLine2}</dd>
                </>
              )}
              <dt>{Strings.titles.City}</dt>
              <dd>{city}</dd>
              {region && (
                <>
                  <dt>{Strings.titles.StateRegionProvince}</dt>
                  <dd>{region}</dd>
                </>
              )}
              <dt>{Strings.titles.PostalCode}</dt>
              <dd>{postalCode}</dd>
              <dt>{Strings.titles.Country}</dt>
              <dd>{countryText}</dd>
            </dl>
          </ListGroupItem>
        </ListGroup>
      </Col>

      <Col lg={6}>
        <ListGroup className="display-group mb-4">
          <ListGroupItem color="info">
            <h4 className="header">{Strings.titles.ContactPerson}</h4>
          </ListGroupItem>
          <ListGroupItem>
            <dl>
              <dt>{Strings.titles.Name}</dt>
              <dd>{contactName}</dd>
              {contactEmail && (
                <>
                  <dt>{Strings.titles.Email}</dt>
                  <dd>{contactEmail}</dd>
                </>
              )}
              {contactPhone && (
                <>
                  <dt>{Strings.titles.Telephone}</dt>
                  <dd>{contactPhone}</dd>
                </>
              )}
            </dl>
          </ListGroupItem>
        </ListGroup>
      </Col>

    </Row>
  );
}
