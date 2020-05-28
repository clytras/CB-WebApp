import React from 'react';
import { useStoreOf } from '@stores';
import styled from 'styled-components';
import EmailVerificationNotice from '../EmailVerificationNotice';
import BusinessProfileUnvisibleNotice from '../BusinessProfileUnvisibleNotice';
import BusinessProfileNotice from '../BusinessProfileNotice';
import InformationBlock from './InformationBlock';
import ActivitiesBlock from './ActivitiesBlock';


const Header = styled.div`
  font-weight: 500;
  line-height: 1.2;
  font-size: 2rem;
`;

const HeaderEmail = styled.div`
  font-size: .8rem;
`;

export default function Summary() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const { hasUser = false, userName: userEmail = '' } = authUserProfile || {};
  const { hasProfile = false, companyName = '', email } = userBusinessProfile || {};

  return hasUser && (
    <>
      <EmailVerificationNotice/>
      <BusinessProfileUnvisibleNotice/>
      <BusinessProfileNotice/>

      {hasProfile && (
        <>
          <Header>{companyName}</Header>
          <HeaderEmail className="text-secondary">{email || userEmail}</HeaderEmail>
          <hr/>
          <InformationBlock/>
          <ActivitiesBlock/>
        </>    
      )}
    </>
  );
}
