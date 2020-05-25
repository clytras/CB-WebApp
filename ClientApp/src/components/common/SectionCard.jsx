import React, { useState, useEffect } from 'react';
import { Card, CardTitle, Collapse  } from 'reactstrap';
import { MdCheck, MdClose, MdWarning } from 'react-icons/md';
import styled from 'styled-components';
import clsx from 'clsx';


const Title = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ opened }) => opened ? '1em': 0};
  transition: margin 200ms;
`;

const Subtitle = styled.div`
  font-style: italic;
`;

const Icons = {
  success: MdCheck,
  danger: MdClose,
  warning: MdWarning
}

export default function SectionCard({
  title,
  subtitle,
  icon,
  color = 'primary',
  allowToggle = true,
  opened = true,
  outline = true,
  children
}) {
  const [showSection, setShowSection] = useState(opened);
  const [applyTitleOpened, setApplyTitleOpened] = useState(opened)
  const toggleSection = () => setShowSection(prev => !prev);
  const Icon = icon && icon in Icons && Icons[icon];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setShowSection(opened), [opened]);

  const onCollapseEntering = () => setApplyTitleOpened(true);
  const onCollapseExited = () => setApplyTitleOpened(false);

  return (
    <Card className={clsx('action-form', !showSection && 'collapsed')} body inverse={false} outline={outline} color={color}>
      {!!title && (
        <Title opened={applyTitleOpened}>
          <CardTitle className={clsx(allowToggle && 'toggle')} tag="h4" onClick={allowToggle ? toggleSection : null}>{title}</CardTitle>
          {Icon && <Icon className={`text-${icon}`} size="2em"/>}
        </Title>
      )}
      {!!subtitle && !showSection && <Subtitle className="text-secondary">{subtitle}</Subtitle>}
      <Collapse onEntering={onCollapseEntering} onExited={onCollapseExited} isOpen={showSection}>{children}</Collapse>
    </Card>
  );
}
