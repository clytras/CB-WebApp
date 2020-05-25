import React from 'react';
import { Row, Col  } from 'reactstrap';
import { useStoreOf } from '@stores';
import InformationData from './InformationData';
import ActivitiesData from './ActivitiesData';
import EmailVerificationNotice from '../EmailVerificationNotice';
import BusinessProfileNotice from '../BusinessProfileNotice';


export default function Profile() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const { hasUser = false } = authUserProfile || {};

  return hasUser && (
    <>
      <EmailVerificationNotice/>
      <BusinessProfileNotice/>

      <Row>
        <Col className="mb-3">
          <InformationData/>
        </Col>
      </Row>      

      {(
        <Row>
          <Col className="mb-3">
            <ActivitiesData/>
          </Col>
        </Row>
      )}

    </>
  );
}
