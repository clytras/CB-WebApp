import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormGroup, Form, Label, Input, Card, Button, CardTitle, CardText, CardBody, Collapse  } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import { apiPost } from '@utils/net';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';
import clsx from 'clsx';


export default function ResendEmailConfirmation({ email }) {
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);

  const toggleForm = () => setShowForm(prev => !prev);
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
        setShowForm(false);
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
    <Card className={clsx('action-form', !showForm && 'collapsed')} body inverse={false} outline color="primary">
      <CardTitle tag="h5" onClick={toggleForm}>Resend email confirmation</CardTitle>
      <Collapse isOpen={showForm}>
        <InlineMessage text={error} color="danger" />
        <InlineMessage text={actionError} color="warning" />
        <Row noGutters className="button-group horizontal fluid">
          <LoadingButton loading={processing} color="primary" onClick={handleResendClick}>Resend email</LoadingButton>
        </Row>
      </Collapse>
    </Card>
  );
}
