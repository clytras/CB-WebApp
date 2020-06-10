import React, { useState, useRef } from 'react';
import LoadingButton from '@components/common/LoadingButton';
import MsgBox from '@components/common/MsgBox';
import DateTime from 'luxon/src/datetime';
import { toast } from 'react-toastify';
import { useStoreOf } from '@stores';
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
const HeaderContactInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ContactRequest = styled.div`
  text-align: right;
`;
const LastRequestSend = styled.div`
  font-size: .6em;
`;

export default function ProfileSummary({
  profile,
  userEmail = '',
  showSendContactRequest = false
}) {
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const [hasSent, setHasSent] = useState();
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

        sendContactRequest(profileId).then(async resp => {
          if (resp.ok) {
            const { date: dateSent } = await resp.json();
            setHasSent(dateSent);
            toast.success(Strings.messages.ContactRequestHasSent);
          } else {
            toast.warning(translateResponseMessage(resp));
          }
        }).catch(err => {
          toast.error(translateRequestError(err));
        });
      }
    });
  }

  function renderContactRequest() {
    let sendDateInfo = null;

    if (showSendContactRequest && userBusinessProfile.profileId !== profile.profileId) {
      let { lastContactRequestSend } = profile;
      let canSend = true;

      console.log('lastContactRequestSend', lastContactRequestSend, profile);

      if (lastContactRequestSend || hasSent) {
        // const { date: dateSend } = lastContactRequestSend;
        const dateSend = hasSent || lastContactRequestSend.date;

        const dtSent = DateTime.fromISO(dateSend, { zone: 'utc' }).toLocal();
        const datetime = dtSent.toLocaleString(DateTime.DATETIME_SHORT);
        const diff = DateTime.local().diff(dtSent);

        console.log('dateSend', dateSend, datetime);

        console.log('diff', diff.as('days'));
        console.log('diff date', DateTime.local().plus(diff).toLocaleString(DateTime.DATETIME_SHORT));

        canSend = diff.as('days') >= 7;
        const cantSendUntil = !canSend && Strings.formatString(
          Strings.messages.YouCantSendAnotherContectRequestUntil, {
            datetime: dtSent.plus({ days: 7 }).toLocaleString(DateTime.DATETIME_SHORT)
          });

        sendDateInfo = (
          <LastRequestSend className="text-muted">
            <div>{Strings.formatString(Strings.messages.ContactRequestHasBeenSent, { datetime })}</div>
            {cantSendUntil && <div className="text-danger">{cantSendUntil}</div>}
          </LastRequestSend>
        );
      }

      return (
        <ContactRequest>
          {canSend && <LoadingButton color="primary" onClick={handleContectRequestSendClick}>{Strings.titles.SendContactRequest}</LoadingButton>}
          {sendDateInfo}
        </ContactRequest>
      );
    }

    return null;
  }

  return (
    <>
      <Header>{companyName}</Header>
      <HeaderContact>
        <HeaderContactInfo>
          <HeaderEmail className="text-secondary"><MdMail/> <a href={`mailto:${emailUse}`}>{emailUse}</a></HeaderEmail>
          <HeaderEmail className="text-secondary"><MdPhone/> <a href={`tel:${telephone}`}>{telephone}</a></HeaderEmail>
        </HeaderContactInfo>
        {/* {showSendContactRequest && <LoadingButton color="primary" onClick={handleContectRequestSendClick}>{Strings.titles.SendContactRequest}</LoadingButton>} */}
        {renderContactRequest()}
      </HeaderContact>

      <MsgBox ref={msgboxContactRequestRef}></MsgBox>

      <hr/>
      <InformationBlock profile={profile} />
      <ActivitiesBlock profile={profile} />
    </>    
  );
}
