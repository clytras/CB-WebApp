import React from 'react';
import { useStoreOf } from '@stores';
import InlineMessage from '@components/common/InlineMessage';
import { Strings } from '@i18n';


export default function EmailVerificationNotice() {
  const [authUserProfile] = useStoreOf('authUserProfile');

  const { hasUser = false, emailVerified = false } = authUserProfile || {};

  return hasUser && !emailVerified && (
    <InlineMessage markdown={Strings.messages.Auth.NoVerifiedEmail} color="warning" fade={false} />
  );
}
