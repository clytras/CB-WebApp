import React, { useState, useEffect, useMemo, useRef } from 'react';
import DateTime from 'luxon/src/datetime';
import Duration from 'luxon/src/duration';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import DataTable, { rebuildTooltip } from '@components/common/DataTable';
import ReactTooltip from "react-tooltip";
import InlineMessage from '@components/common/InlineMessage';
import { RProgressApi } from 'rprogress';
import { apiGet } from '@utils/net';
import { setProfileOfUserVisibility } from '@data/BusinessProfile';
import { lockoutAccount } from '@api-auth/AuthorizeService';
import { FaEye, FaEyeSlash, FaLock, FaLockOpen } from 'react-icons/fa';
import MsgBox from '@components/common/MsgBox';
import { toast } from 'react-toastify';
import { Strings, translateResponseMessage, translateRequestError, httpRejectedError } from '@i18n';
import clsx from 'clsx';


function ListActions({
  item,
  onProfileVisibilityClick,
  onAccountLockClick,
  iconsSize = '1.3em',
  tooltipId
}) {
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockedUntil, setLockedUntil] = useState();
  
  useEffect(() => { rebuildTooltip(); }, []);
  useEffect(() => {
    const { lockoutEnabled, lockoutEnd } = item;

    let locked = false;
    let until;

    if (lockoutEnabled) {
      if (lockoutEnd) {
        locked = DateTime.fromISO(lockoutEnd).diffNow().milliseconds > 0;
        until = DateTime.fromISO(lockoutEnd).toLocaleString(DateTime.DATETIME_SHORT);
      }
    }
    setIsAccountLocked(locked);
    setLockedUntil(until);
    rebuildTooltip();
  }, [item]);

  const handleEyeClick = () => {
    onProfileVisibilityClick && onProfileVisibilityClick(item);
  }

  const handleLockClick = () => {
    onAccountLockClick && onAccountLockClick({ ...item, isAccountLocked, lockedUntil });
  }

  function renderEye() {
    const { hasProfile, isProfileVisible } = item;

    if (hasProfile) {
      if (isProfileVisible) {
        return <FaEye size={iconsSize}
          data-for={tooltipId} data-tip={Strings.messages.MakeProfileHidden} 
          onClick={handleEyeClick} />;
      }
      return <FaEyeSlash size={iconsSize} className="text-danger"
        data-for={tooltipId} data-tip={Strings.messages.MakeProfileVisible} 
        onClick={handleEyeClick} />;
    }
    return <FaEye className="disabled" size={iconsSize}
      data-for={tooltipId} data-tip={Strings.messages.UserHasNoProfile} />;
  }

  function renderLock() {
    const { lockoutEnabled } = item;

    if (lockoutEnabled) {
      if (isAccountLocked) {
        return <FaLock size={iconsSize} className="text-danger"
          data-for={tooltipId} data-tip={Strings.formatString(Strings.messages.AccountLockedUntil, { lockedUntil })}
          onClick={handleLockClick} />;
      }
      return <FaLockOpen size={iconsSize} 
        data-for={tooltipId} data-tip={Strings.messages.LockAccount}
        onClick={handleLockClick} />
    }
    return <FaLockOpen className="disabled" size={iconsSize} 
      data-for={tooltipId} data-tip={Strings.messages.AccountCannotBeLocked} />;
  }

  return (
    <div className="datatable-actions">
      {renderEye()}
      {renderLock()}
    </div>
  );
}

export default function Users() {
  const tooltipId = useMemo(() => 'users-list-tooltips', []);
  const [rows, setRows] = useState([]);
  const [pending, setPending] = useState(true);
  const [fetchError, setFetchError] = useState();
  const [requestError, setRequestError] = useState();
  const [msgboxLockoutDisableButtons, setMsgboxLockoutDisableButtons] = useState();
  const [lockoutDurationSelected, setLockoutDurationSelected] = useState();
  const lockoutDuration = useRef();
  const msgboxRef = useRef();
  const msgboxLockoutRef = useRef();

  const columns = useMemo(() => [
    {
      name: Strings.titles.Email,
      selector: 'email',
      sortable: true,
      grow: 3
    },
    {
      name: Strings.titles.Roles,
      selector: 'roleNames',
      hide: 'md',
      cell: ({ roleNames }) => roleNames.join(', ')
    },
    {
      name: Strings.titles.TelephoneNumber,
      selector: 'phoneNumber'
    },
    {
      name: Strings.titles.Registration,
      selector: 'registrationDate',
      hide: 'md',
      sortable: true,
      cell: ({ registrationDate }) => registrationDate && 
        DateTime.fromISO(registrationDate, { setZone: 'utc' }).toLocaleString()
    },
    {
      name: Strings.titles.LastLogin,
      selector: 'lastLoginTime',
      hide: 'md',
      sortable: true,
      cell: ({ lastLoginTime }) => lastLoginTime && 
        DateTime.fromISO(lastLoginTime, { setZone: 'utc' }).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
      name: Strings.titles.Actions,
      button: true,
      width: '200px',
      cell: item => <ListActions item={item} tooltipId={tooltipId}
        onProfileVisibilityClick={handleVisibilityClick} 
        onAccountLockClick={handleLockClick} />
    }
  ], []);

  const lockoutDurations = useMemo(() => [[
    [{ hours: 6 }, 'Hours'],
    [{ days: 7 }, 'Days'],
    [{ months: 1}, 'Months']
  ], [
    [{ months: 6 }, 'Months'],
    [{ years: 1 }, 'Years'],
    [{ years: 100 }, 'Permanently']
  ]], []);

  useEffect(() => fetchData(), []);
  useEffect(() => {
    lockoutDuration.current = lockoutDurationSelected;
    setMsgboxLockoutDisableButtons(lockoutDurationSelected ? '' : 'yes');
  }, [lockoutDurationSelected]);

  const handleVisibilityClick = ({ userId, email, hasProfile, isProfileVisible }) => {
    if (hasProfile) {
      msgboxRef.current.show({
        title: Strings.messages.Confirms[isProfileVisible ? 'HideProfile' : 'MakeProfileVisible'],
        message: Strings.formatString(
          Strings.messages.Confirms[isProfileVisible ? 
            'HideProfileFromSearch' : 
            'MakeProfileVisibleInSearch'], { email }),
        color: 'primary',
        buttons: 'yes,cancel',
        onConfirm: () => {
          setProfileOfUserVisibility(userId, !isProfileVisible).then(resp => {
            if (resp.ok) {
              setRows(prev => {
                const index = prev.findIndex(i => i.userId === userId);
                if (index > -1) {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], isProfileVisible: !isProfileVisible };
                  return updated;
                }
                return prev;
              });
            } else {
              toast.warning(translateResponseMessage(resp));
            }
          }).catch(err => {
            toast.error(translateRequestError(err));
          });
        }
      });
    }
  }

  const handleLockClick = ({ userId, email, lockoutEnabled, isAccountLocked, lockedUntil }) => {
    if (lockoutEnabled) {
      if (isAccountLocked) {
        setMsgboxLockoutDisableButtons('');
      } else {
        setLockoutDurationSelected();
        setMsgboxLockoutDisableButtons('yes');
      }

      msgboxLockoutRef.current.show({
        title: Strings.titles[isAccountLocked ? 'UnlockAccount' : 'LockAccount'],
        renderProps: { email, isAccountLocked, lockedUntil },
        color: 'primary',
        buttons: 'yes,cancel',
        yesText: Strings.titles[isAccountLocked ? 'Unlock' : 'Lock'],
        onConfirm: () => {
          const duration = isAccountLocked ?
            { seconds: 0 } : // If account is locked we want to unlock it
            Duration.fromObject(lockoutDuration.current).shiftTo('seconds');

          lockoutAccount(userId, duration.seconds).then(async resp => {
            if (resp.ok) {
              const { lockoutEnd: newLockoutEnd } = await resp.json();

              setRows(prev => {
                const index = prev.findIndex(i => i.userId === userId);
                if (index > -1) {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], lockoutEnd: newLockoutEnd };
                  return updated;
                }
                return prev;
              });
            } else {
              toast.warning(translateResponseMessage(resp));
            }
          }).catch(err => {
            toast.error(translateRequestError(err));
          });
        }
      });
    }
  }

  function fetchData() {
    setPending(true);
    setFetchError();
    setRequestError();
    setRows([]);
    RProgressApi.start();

    apiGet('/api/Accounts', {
      addAuth: true
    }).then(async resp => {
      if(resp.ok) {
        const data = await resp.json();
        setRows(data);
      } else {
        setFetchError(httpRejectedError(resp.status));
      }
    }).catch(err => {
      setRequestError(translateRequestError(err && err.message));
    }).finally(() => {
      setPending(false);
      RProgressApi.complete();
    });
  }

  return (
    <>
      {!!(requestError || fetchError) && (
        <Container>
          <Row>
            <Col>
              <InlineMessage text={requestError} color="danger"/>
              <InlineMessage text={fetchError} color="warning"/>
            </Col>
          </Row>
        </Container>
      )}
      <DataTable
        columns={columns}
        noContextMenu
        // responsive={false}
        data={rows}
        onChangePage={rebuildTooltip}
        progressPending={pending}
        pagination />
      <MsgBox ref={msgboxRef} />
      <MsgBox ref={msgboxLockoutRef} disableButtons={msgboxLockoutDisableButtons}>
        {
          ({ isAccountLocked, lockedUntil, email }) => {
            if (isAccountLocked) {
              return (
                <>
                  <p>{Strings.formatString(Strings.messages.AccountLockedUntil, { lockedUntil })}</p>
                  <p>{Strings.formatString(Strings.messages.Confirms.UnlockAccount, { email })}</p>
                </>
              );
            }

            return (
              <>
                <p>{Strings.formatString(Strings.messages.Confirms.LockAccountFor, { email })}</p>
                {lockoutDurations.map((durations, rindex) => (
                  <ButtonGroup key={`locout-duration-row-${rindex}`} className={clsx(rindex === 0 && 'mb-2')}>
                    {durations.map(([duration, format], cindex) => (
                      <Button key={`lockout-duration-col-${cindex}`} 
                        color={duration === lockoutDurationSelected ? 'primary' : 'light'}
                        onClick={() => setLockoutDurationSelected(duration)}>{
                        Strings.formatPlural(Strings.fields.duration[format], duration)
                      }</Button>
                    ))}
                  </ButtonGroup>
                ))}
              </>
            );
          }
        }
      </MsgBox>
      <ReactTooltip id={tooltipId} effect="float" />
    </>
  );
}
