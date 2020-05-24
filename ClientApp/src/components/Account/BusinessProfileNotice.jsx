import React from 'react';
import { useStoreOf } from '@stores';
import InlineMessage from '@components/common/InlineMessage';
import { Strings } from '@i18n';


export default function BusinessProfileNotice() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const { hasUser = false } = authUserProfile || {};
  const { hasProfile = false } = userBusinessProfile || {};

  return hasUser && !hasProfile && (
    <InlineMessage markdown={Strings.messages.Business.BusinessProfileNotComplete} color="warning" fade={false} />
  );
}
