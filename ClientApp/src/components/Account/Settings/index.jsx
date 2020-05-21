import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormGroup, Form, Label, Input, Card, Button, CardTitle, CardText, CardBody, Collapse  } from 'reactstrap';
import { useStoreOf } from '@stores';
import ChangePassword from './ChangePassword';
import ResendEmailConfirmation from './ResendEmailConfirmation';
import clsx from 'clsx';
import EmailVerificationNotice from '../EmailVerificationNotice';
import Delayed from '@components/common/Delayed';


export default function Settings() {
  const [authUserProfile] = useStoreOf('authUserProfile');

  const { hasUser = false, userName = '', emailVerified = false } = authUserProfile || {};

  return hasUser && (
    <>
      <EmailVerificationNotice/>
      <Form>
        <Row form>
          <Col md={7}>
            <FormGroup>
              <Label for="User.Email">Username / Email</Label>
              <Input name="User.Email" id="User.Email" disabled value={userName || ''} />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col className="mb-3">
          <ChangePassword/>
        </Col>
      </Row>      
      {!emailVerified && (
        <Row>
          <Col className="mb-3">
            <ResendEmailConfirmation email={userName} />
          </Col>
        </Row>
      )}
    </>
  );
}
