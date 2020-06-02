import React from 'react';
import { Button } from 'reactstrap';
import MoonLoader from "react-spinners/MoonLoader";
import styled from 'styled-components';


const Body = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Content = styled.div`
  margin-left: ${p => p.ml}px;
`;

export default function LoadingButton({
  children,
  loading,
  disabled,
  ...rest
}) {

  return (
    <Button {...rest} disabled={disabled || loading}>
      <Body>
        {loading && <MoonLoader size={14} color="white" />}
        <Content ml={loading ? 5 : 0}>
          {children}
        </Content>
      </Body>
    </Button>
  )
}
