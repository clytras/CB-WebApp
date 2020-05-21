import React, { useEffect } from 'react';
import EmailVerificationNotice from './EmailVerificationNotice';


export default function Profile() {
  return (
    <>
      <EmailVerificationNotice/>
      <div>Profile</div>
    </>
  );
}
