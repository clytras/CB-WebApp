import React from 'react';
import { useStoreOf } from '@stores';
import styled from 'styled-components';
import EmailVerificationNotice from '../EmailVerificationNotice';
import BusinessProfileUnvisibleNotice from '../BusinessProfileUnvisibleNotice';
import BusinessProfileNotice from '../BusinessProfileNotice';
import InformationBlock from './InformationBlock';
import ActivitiesBlock from './ActivitiesBlock';
import ProfileSummary from './ProfileSummary';
import { MdPhone, MdMail } from 'react-icons/md';


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
  const { hasProfile = false } = userBusinessProfile || {};

  return hasUser && (
    <>
      <EmailVerificationNotice/>
      <BusinessProfileUnvisibleNotice/>
      <BusinessProfileNotice/>

      {hasProfile && (
        <ProfileSummary profile={userBusinessProfile} userEmail={userEmail} />
        // <>
        //   <Header>{companyName}</Header>
        //   <HeaderEmail className="text-secondary"><MdMail/> {email || userEmail}</HeaderEmail>
        //   <hr/>
        //   <InformationBlock profile={userBusinessProfile} />
        //   <ActivitiesBlock profile={userBusinessProfile} />
        // </>    
      )}
    </>
  );
}
