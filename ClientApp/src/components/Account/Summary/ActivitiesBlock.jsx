import React, { useMemo, useCallback } from 'react';
import { Row, Col, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { getActivitiesListWithCounters } from '@data/BusinessProfile/Lists';
import { MdDone } from 'react-icons/md';
import { Strings } from '@i18n';
import clsx from 'clsx';


export default function ActivitiesBlock({ profile }) {
  // const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const activities = useMemo(() => {
    return getActivitiesListWithCounters(null, profile.activities);
  }, [profile]);

  const makeActivityAlias = (head, sub, option) => sub ? `${head}.${sub}.$${option}` : `${head}.$${option}`;

  const hasActivity = useCallback(alias => {
    // const alias = makeActivityAlias();
    const { activities } = profile;
    return activities && activities.indexOf(alias) > -1;
  }, [profile]);

  function renderActivities(head) {
    let subs = activities[head];
    const own = [];
    const { _select = 0, _count = 0 } = subs;
    const { otherActivities = {}} = profile || {};

    const renderItem = (head, sub, option, className) => {
      const alias = makeActivityAlias(head, sub, option);
      const selected = hasActivity(alias);
      return <li key={`activity-${alias}`} className={clsx('option', className, selected ? 'selected' : 'unselected')}><MdDone className="mr-1 mb-1" size="1.2em"/>{Strings.Business.Lists[option]}</li>;
    }

    return (
      <ListGroup className={`display-group mb-4 list-activities-head-${head}`}>
        <ListGroupItem color="success">
          <h4 className="header">{Strings.Business.Lists[head]}<Badge color="success">{`${_select} / ${_count}`}</Badge></h4>
        </ListGroupItem>
        <div className="list-group-item">
          <ul className="subs">
            {Object.entries(subs).map(([sub, options]) => {
              if (options === '$') {
                own.push(sub);
              } else if (sub !== '_select' && sub !== '_count') {
                // return renderSubActivities(head, sub, options);
                return (
                  <li key={`activity-group-${head}.${sub}`}>{Strings.Business.Lists[sub]}
                    <ul className="options">{options.$.map(option => renderItem(head, sub, option))}</ul>
                  </li>
                );
              }

              return null;
            })}
          </ul>
          {own.length > 0 && own.map(option => renderItem(head, null, option))}
          {head in otherActivities && !!otherActivities[head] && (
            <ul className="subs other">
              <li>{Strings.titles.OtherText}
                <div className="other-text">{otherActivities[head]}</div>
              </li>
            </ul>
          )}
        </div>
    </ListGroup>
    );
  }

  return activities && (
    <>
      <Row>
        <Col>
          {renderActivities('TopicsOfInterest')}
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          {renderActivities('Offer')}
        </Col>
        <Col lg={6}>
          {renderActivities('Request')}
        </Col>
      </Row>
    </>
  );
}
