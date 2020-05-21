import React, { useEffect } from 'react';
import EmailVerificationNotice from './EmailVerificationNotice';


export default function Summary() {
  return (
    <>
      <EmailVerificationNotice/>
      <div>Summary</div>
    </>
  );
}
