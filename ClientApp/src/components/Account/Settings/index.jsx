import React from 'react';
import { Row, Col, FormGroup, Form, Label, Input } from 'reactstrap';
import { useStoreOf } from '@stores';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import ResendEmailConfirmation from './ResendEmailConfirmation';
import EmailVerificationNotice from '../EmailVerificationNotice';


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
      <Row>
        <Col className="mb-3">
          <DeleteAccount/>
        </Col>
      </Row>  
    </>
  );
}
