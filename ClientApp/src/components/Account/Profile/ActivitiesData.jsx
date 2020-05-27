import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Input, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { MdDone } from 'react-icons/md';
import InlineMessage from '@components/common/InlineMessage';
import LoadingButton from '@components/common/LoadingButton';
import { useStoreOf } from '@stores';
import Activities from '@data/BusinessProfile/Activities';
import { getActivitiesFlatList } from '@data/BusinessProfile/Lists';
import { BusinessProfile } from '@data/BusinessProfile';
import throttle from 'lodash.throttle';
import { toast } from 'react-toastify';
import { Strings } from '@i18n';
import SectionCard from '@components/common/SectionCard';


export default function ActivitiesData() {
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const countersRef = useRef({});
  const [selected, setSelected] = useState({});
  const [otherActivities, setOtherActivities] = useState({});
  const [otherActivitiesDirty, setOtherActivitiesDirty] = useState({});
  const [processing, setProcessing] = useState({});
  const { hasProfile = false } = userBusinessProfile || {};

  useEffect(() => {
    // console.log('ActivitiesData', userBusinessProfile);

    countersRef.current = getActivitiesFlatList(null, {
      withCounters: true,
      withSelectedCounters: true,
      applySelectionsOf: userBusinessProfile.activities || []
    });

    setSelected(userBusinessProfile.activitiesAssoc);
    setOtherActivities({ ...userBusinessProfile.otherActivities });
    setOtherActivitiesDirty({});
  }, [userBusinessProfile]);

  const handleOtherActivityChange = alias => 
    ({ currentTarget: { value }}) => {
      setOtherActivitiesDirty(p => ({ ...p, [alias]: true }));
      setOtherActivities(p => ({ ...p, [alias]: value }));
    }
  
  const handleOtherActivityUndoClick = alias => () => {
    setOtherActivities(p => ({ ...p, [alias]: userBusinessProfile.otherActivities[alias] || '' }));
    setOtherActivitiesDirty(p => ({ ...p, [alias]: false }));
  }

  const handleOtherActivitySaveClick = alias => () => {
    setProcessing(p => ({ ...p, [alias]: true }));

    BusinessProfile.SaveProfileOtherActivity(alias, otherActivities[alias] || '').then(resp => {
      if (resp.ok) {
        userBusinessProfile.otherActivities = { ...otherActivities };
        toast.success(Strings.messages.DataSaved);
      } else {
        setOtherActivities(p => ({ ...p, [alias]: userBusinessProfile.otherActivities[alias] || '' }));
        toast.warning(Strings.messages.ErrorSaving);
      }
    }).catch(err => {
      console.error('ERR: Save profile other activities', err);
      toast.error(Strings.messages.ErrorSaving);
    }).finally(() => {
      setOtherActivitiesDirty(p => ({ ...p, [alias]: false }));
      setProcessing(p => ({ ...p, [alias]: false }));
    });
  }

  const handleOptionClick = (head, sub, option) => () => {
    selectOption(head, sub, option);
  }

  const selectOption = (head, sub, option, value) => {
    setSelected(p => {
      const { current: counters } = countersRef;
      const alias = sub ? `${head}.${sub}.$${option}` : `${head}.$${option}`;
      const state = alias in p && p[alias];
      let v = value === undefined ? state : value;
      p[alias] = v === undefined ? true : !v;
      const count = p[alias] ? 1 : -1;

      doSaveActivities(p);

      if (sub) {
        counters[`${head}.${sub}`].select += count;
      }

      counters[head].select += count;
      return { ...p };
    });
  }

  const getOption = (options, head, sub, option) => {
    const alias = sub ? `${head}.${sub}.$${option}` : `${head}.$${option}`;
    return alias in options && options[alias];
  }

  const getCounter = (head, sub) => {
    const { current: counters } = countersRef;
    const value = counters[sub ? `${head}.${sub}` : head];
    return value || { total: 0, select: 0 };
  }

  const doSaveActivities = useCallback(
    throttle((activities) => {

      const selectedActivities = Object.entries(activities)
        .filter(([, v]) => v)
        .map(([k]) => k);

      BusinessProfile.SaveProfileActivities(selectedActivities).then(resp => {
        if (resp.ok) {
          userBusinessProfile.activities = [...selectedActivities];
        } else {
          setSelected(userBusinessProfile.activities);
          toast.warning(Strings.messages.ErrorSaving);
        }
      }).catch(err => {
        console.error('ERR: Save profile activities', err);
        toast.error(Strings.messages.ErrorSaving);
      });
      
    }, 1000, { leading: false, trailing: true }),
  []);

  function renderSubActivities(head, sub, options) {
    if (!options || !'$' in options || options.$.length === 0) {
      return null;
    }

    const { total, select } = getCounter(head, sub);

    return (
      <ListGroup key={`sub-activity-${head}-${sub}`} className={'options-list mb-4'}>
        {sub && <ListGroupItem color="primary">{`${Strings.Business.Lists[sub]} (${select} / ${total})`}</ListGroupItem>}
        {options.$.map(option => (
          <ListGroupItem key={`option-activity-${head}-${sub}-${option}`} action
            className={getOption(selected, head, sub, option) ? 'selected' : 'text-secondary'}
            tag="button" onClick={handleOptionClick(head, sub, option)}><MdDone className="text-muted" size="1.5em"/>{Strings.Business.Lists[option]}</ListGroupItem>)
        )}
      </ListGroup>
    );
  }

  return (
    <SectionCard title="Activities" subtitle={!hasProfile && Strings.messages.Business.SaveBasicInformationBeforeActivities}
      allowToggle={hasProfile}
      color={hasProfile ? 'primary' : 'light'}
      opened={hasProfile}
      outline={hasProfile}>
      <InlineMessage text={Strings.messages.ActivitiesAutoSave} color="info" />

      {Object.entries(Activities).map(([head, subs]) => {
        const own = { $: [] };
        const { total, select } = getCounter(head);

        return (
          <div key={`head-activity-${head}`}>
            <Row className="mb-3">
              <Col>
                <h5>{`${Strings.Business.Lists[head]} (${select} / ${total})`}</h5>
                <hr/>
              </Col>
            </Row>
            {Object.entries(subs).map(([sub, options]) => {
              if (options === '$') {
                own.$.push(sub);
                return null;
              } else if (options !== '_selected') {
                return renderSubActivities(head, sub, options);
              }
            })}
            {own.length !== 0 && renderSubActivities(head, null, own)}
            <ListGroup className="mb-4">
              <ListGroupItem color="primary">{`${Strings.Business.Lists[head]} \\ ${Strings.titles.OtherText}`}</ListGroupItem>
              <ListGroupItem className="options-list-textarea">
                <Input type="textarea" name={`Profile.OtherActivities.${head}`} id={`Profile.OtherActivities.${head}`}
                  value={otherActivities[head] || ''}
                  onChange={handleOtherActivityChange(head)} />
                {otherActivitiesDirty[head] && (
                  <Row noGutters className="button-group horizontal fluid mt-2">
                    <Col>
                      <LoadingButton color="primary" loading={processing[head]} 
                        onClick={handleOtherActivitySaveClick(head)}>{Strings.titles.Save}</LoadingButton>
                      {!processing[head] && <Button onClick={handleOtherActivityUndoClick(head)} color="light">{Strings.titles.Undo}</Button>}
                    </Col>
                  </Row>
                )}
              </ListGroupItem>
            </ListGroup>
          </div>
        );
      })}
    </SectionCard>
  );
}
