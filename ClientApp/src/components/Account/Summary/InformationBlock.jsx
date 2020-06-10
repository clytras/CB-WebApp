import React from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Strings } from '@i18n';


export default function InformationBlock({ profile }) {
  const {
    companyLocation,
    contactPerson
  } = profile || {};

  const {
    streetAddress = '',
    addressLine2,
    region,
    city = '',
    postalCode = '',
    country = ''
  } = companyLocation || {};

  const {
    name: contactName = '',
    email: contactEmail,
    telephone: contactPhone
  } = contactPerson || {};

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
                  <dd><a href={`mailto:${contactEmail}`}>{contactEmail}</a></dd>
                </>
              )}
              {contactPhone && (
                <>
                  <dt>{Strings.titles.Telephone}</dt>
                  <dd><a href={`tel:${contactPhone}`}>{contactPhone}</a></dd>
                </>
              )}
            </dl>
          </ListGroupItem>
        </ListGroup>
      </Col>

    </Row>
  );
}
