import React from 'react';
import LoadingButton from '@components/common/LoadingButton';
import styled from 'styled-components';
import InformationBlock from './InformationBlock';
import ActivitiesBlock from './ActivitiesBlock';
import { MdPhone, MdMail } from 'react-icons/md';


const Header = styled.div`
  font-weight: 500;
  line-height: 1.2;
  font-size: 2rem;
`;

const HeaderEmail = styled.div`font-size: .8rem`;
const HeaderContact = styled.div`display: flex`;
const HeaderContactInfo = styled.div`flex: 1`;

export default function ProfileSummary({ profile, userEmail = '', showSendContactRequest = false }) {
  const { companyName = '', email, telephone = '' } = profile || {};
  const emailUse = email || userEmail;

  return (
    <>
      <Header>{companyName}</Header>
      <HeaderContact>
        <HeaderContactInfo>
          <HeaderEmail className="text-secondary"><MdMail/> <a href={`mailto:${emailUse}`}>{emailUse}</a></HeaderEmail>
          <HeaderEmail className="text-secondary"><MdPhone/> <a href={`tel:${telephone}`}>{telephone}</a></HeaderEmail>
        </HeaderContactInfo>
        {showSendContactRequest && <LoadingButton color="primary" onClick={() => {}}>Send contact request</LoadingButton>}
      </HeaderContact>

      <hr/>
      <InformationBlock profile={profile} />
      <ActivitiesBlock profile={profile} />
    </>    
  );
}
