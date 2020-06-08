import React, { useState, useEffect } from 'react';
import { useStoreOf } from '@stores';
import styled from 'styled-components';
import LoadingOverlay from '@components/common/LoadingOverlay';
import InlineMessage from '@components/common/InlineMessage';
import InformationBlock from '@components/Account/Summary/InformationBlock';
import ProfileSummary from '@components/Account/Summary/ProfileSummary';

import { BusinessProfile, fetchProfile } from '@data/BusinessProfile';
import { MdPhone, MdMail } from 'react-icons/md';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';


// const Header = styled.div`
//   font-weight: 500;
//   line-height: 1.2;
//   font-size: 2rem;
// `;

// const HeaderEmail = styled.div`
//   font-size: .8rem;
// `;

export default function OpenProfile({
  match: {
    params: {
      profileId 
    }
  }
}) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setActionError();
    setError();

    fetchProfile(profileId).then(async resp => {
      if (resp.ok) {
        const businessProfile = new BusinessProfile(await resp.json());
        setProfile(businessProfile);
      } else {
        setActionError("Counld not load profile. Please try again.");
      }
    }).catch(err => {
      setError(translateRequestError(err));
    }).finally(() => {
      setLoading(false);
    });
  }, []);


  if (loading) {
    return <LoadingOverlay/>;
  }

  if (actionError) {
    return <InlineMessage markdown={actionError} color="warning" />;
  }

  if (error) {
    return <InlineMessage markdown={error} color="danger" />;
  }

  if (profile) {
    return <ProfileSummary profile={profile} showSendContactRequest />;
  }

  return null;
}
