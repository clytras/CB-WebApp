import React, { useState } from 'react';
import { Row } from 'reactstrap';
import SectionCard from '@components/common/SectionCard';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';


export default function ResendEmailConfirmation({ email }) {
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);

  const handleResendClick = () => {
    setActionError();
    setError();

    RProgressApi.start();
    setProcessing(true);
    apiPost(`/api/Auth/ResendEmailConfirmation`, {
      addAuth: true,
      params: {
        Email: email
      }
    }).then(async resp => {
      if(resp.ok) {
        toast.success(Strings.messages.Auth.EmailVerificationSent);
      } else {
        let errorCode;

        try {
          ({ errorCode } = await resp.json());
        } catch(err) {}

        setActionError(translateCodeMessage(errorCode, `${HttpStatus.getStatusText(resp.status)} (${resp.status})`));
      }
    }).catch(err => {
      setError(translateRequestError(err));
    }).finally(() => {
      RProgressApi.complete();
      setProcessing(false);
    });
  }

  return (
    <SectionCard title="Resend email confirmation" opened={false} color="primary">
      <InlineMessage text={error} color="danger" />
      <InlineMessage text={actionError} color="warning" />
      <Row noGutters className="button-group horizontal fluid">
        <LoadingButton loading={processing} color="primary" onClick={handleResendClick}>Resend email</LoadingButton>
      </Row>
    </SectionCard>
  );
}
