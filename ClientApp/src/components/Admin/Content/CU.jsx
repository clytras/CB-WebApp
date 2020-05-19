import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import LoadingOverlay from '@components/common/LoadingOverlay';
import LoadingButton from '@components/common/LoadingButton';
import FeedbackMessage from '@components/common/FeedbackMessage';
import Delayed from '@components/common/Delayed';
import InlineMessage from '@components/common/InlineMessage';
import { RProgressApi } from 'rprogress';
import { toast } from 'react-toastify';
import { apiGet, apiSave } from '@utils/net';
import { Strings, translateRequestError, httpRejectedError } from '@i18n';


const mdParser = new MarkdownIt();

export default function CU({
  match: {
    params: {
      itemId 
    }
  }
}) {
  const [itemBindToContent, setItemBindToContent] = useState('');
  const [itemContent, setItemContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fetchError, setFetchError] = useState();
  const [redirectTo, setRedirectTo] = useState();
  const [saveError, setSaveError] = useState();
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if(itemId) {
      RProgressApi.start();

      apiGet(`/api/Content/${itemId}`).then(async resp => {
        if(resp.ok) {
          const { bindToContent, content } = await resp.json() || {};

          setItemBindToContent(bindToContent);
          setItemContent(content);
          setShowForm(true);
        } else {
          setFetchError(httpRejectedError(resp.status));
        }
      }).catch(err => {
        setRequestError(translateRequestError(err));
      }).finally(() => {
        RProgressApi.complete();
        setIsLoading(false);
      });
    } else {
      setShowForm(true);
      setIsLoading(false);
    }
  }, []);

  const handleCancelClick = () => setRedirectTo('/admin/content');
  const handleBindToContentChange = ({ currentTarget: { value }}) => {
    setItemBindToContent(value);
    setIsDirty(true);
  }
  const handleContentChange = ({ html, text }) => {
    setItemContent(text);
    setIsDirty(true);
  }
  const handleItemFormSubmit = event => {
    event.preventDefault();

    console.log('submitting');

    RProgressApi.start();
    setSaveError();
    setRequestError();
    setIsSaving(true);

    apiSave('/api/Content', itemId, {
      addAuth: true,
      params: {
        BindToContent: itemBindToContent,
        Content: itemContent
      }
    }).then(resp => {
      if(resp.ok) {
        if(itemId) {
          toast.success(Strings.messages.EntryUpdated);
        } else {
          toast.success(Strings.messages.EntryCreated);
          setRedirectTo('/admin/content')
        }
        setIsDirty(false);
      } else {
        setSaveError(httpRejectedError(resp.status));
      }
    }).catch(err => {
      setRequestError(translateRequestError(err && err.message));
    }).finally(() => {
      RProgressApi.complete();
      setIsSaving(false);
    });
  }

  if(isLoading) {
    return <Delayed><LoadingOverlay/></Delayed>;
  }

  if(redirectTo) {
    return <Delayed><Redirect to={redirectTo} /></Delayed>;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <InlineMessage text={requestError} color="danger"/>
            <InlineMessage text={fetchError} color="warning"/>
            <InlineMessage text={saveError} color="warning"/>
            {showForm && (
              <Form onSubmit={handleItemFormSubmit}>
                <h4>{itemId ? 
                  `Editing Content Block #${itemId}` : 
                  `Create a new Content Block.`}</h4>

                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="Item.BindToContent">Bind To Content</Label>
                      <Input type="text" required name="Item.BindToContent" id="Item.BindToContent" 
                        value={itemBindToContent} 
                        onChange={handleBindToContentChange}
                        disabled={isSaving}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <MdEditor
                    value={itemContent}
                    style={{ height: "500px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleContentChange}
                  />
                </FormGroup>

                {isDirty && (
                  <FormGroup>
                    <LoadingButton color="primary" loading={isSaving}>{itemId ? 'Update' : 'Create'}</LoadingButton>{' '}
                    <Button onClick={handleCancelClick}>Cancel</Button>
                  </FormGroup>
                )}
              </Form>
            )}
          </Col>
        </Row>
      </Container>

    </>
  );

}
