import React from 'react';
import { useStoreOf } from '@stores';
import InlineMessage from '@components/common/InlineMessage';
import { Strings } from '@i18n';


export default function BusinessProfileUnvisibleNotice() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const { hasUser = false } = authUserProfile || {};
  const { hasProfile = false, isProfileVisible = false } = userBusinessProfile || {};

  return hasUser && hasProfile && !isProfileVisible && (
    <InlineMessage markdown={Strings.messages.Business.BusinessProfileUnvisible} color="warning" fade={false} />
  );
}
