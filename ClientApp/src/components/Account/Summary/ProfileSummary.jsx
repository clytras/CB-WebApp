import React, { useRef } from 'react';
import LoadingButton from '@components/common/LoadingButton';
import MsgBox from '@components/common/MsgBox';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import InformationBlock from './InformationBlock';
import ActivitiesBlock from './ActivitiesBlock';
import { sendContactRequest } from '@data/BusinessProfile';
import { MdPhone, MdMail } from 'react-icons/md';
import { Strings, translateResponseMessage, translateRequestError } from '@i18n';


const Header = styled.div`
  font-weight: 500;
  line-height: 1.2;
  font-size: 2rem;
`;

const HeaderEmail = styled.div`font-size: .8rem`;
const HeaderContact = styled.div`display: flex`;
const HeaderContactInfo = styled.div`flex: 1`;

export default function ProfileSummary({ profile, userEmail = '', showSendContactRequest = false }) {
  const msgboxContactRequestRef = useRef();
  const { companyName = '', email, telephone = '' } = profile || {};
  const emailUse = email || userEmail;

  const handleContectRequestSendClick = () => {
    const { profileId, companyName = '' } = profile || {};
    msgboxContactRequestRef.current.show({
      title: Strings.titles.SendContactRequest,
      message: Strings.formatString(Strings.messages.Business.SendContactRequest, { companyName }),
      color: 'primary',
      buttons: 'yes,cancel',
      yesText: Strings.titles.Send,
      onConfirm: () => {
        console.log('sending');

        sendContactRequest(profileId).then(resp => {
          if (resp.ok) {
            console.log('Contact req send OK');
          } else {
            toast.warning(translateResponseMessage(resp));
          }
        }).catch(err => {
          toast.error(translateRequestError(err));
        });
      }
    });
  }

  return (
    <>
      <Header>{companyName}</Header>
      <HeaderContact>
        <HeaderContactInfo>
          <HeaderEmail className="text-secondary"><MdMail/> <a href={`mailto:${emailUse}`}>{emailUse}</a></HeaderEmail>
          <HeaderEmail className="text-secondary"><MdPhone/> <a href={`tel:${telephone}`}>{telephone}</a></HeaderEmail>
        </HeaderContactInfo>
        {showSendContactRequest && <LoadingButton color="primary" onClick={handleContectRequestSendClick}>{Strings.titles.SendContactRequest}</LoadingButton>}
      </HeaderContact>

      <MsgBox ref={msgboxContactRequestRef}></MsgBox>

      <hr/>
      <InformationBlock profile={profile} />
      <ActivitiesBlock profile={profile} />
    </>    
  );
}
