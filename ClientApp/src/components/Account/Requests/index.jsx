import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DateTime from 'luxon/src/datetime';
import { useStoreOf } from '@stores';
import { BsBoxArrowInDownRight, BsBoxArrowUpRight, BsFillEnvelopeFill, BsFillEnvelopeOpenFill } from 'react-icons/bs';
import DataTable from '@components/common/DataTable';
import EmailVerificationNotice from '../EmailVerificationNotice';
import BusinessProfileNotice from '../BusinessProfileNotice';
import { apiGet } from '@utils/net';
import { toast } from 'react-toastify';
import { Strings, translateResponseMessage, translateRequestError } from '@i18n';
import clsx from 'clsx';


export default function Requests() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const [, setNewContactRequests] = useStoreOf('newContactRequests', 'setNewContactRequests');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { hasUser = false } = authUserProfile || {};
  const { profileId } = userBusinessProfile || {};

  const columns = useMemo(() => [
    {
      name: Strings.titles.FromSlashTo,
      sortable: false,
      cell: ({ fromId, toId, isOpened, connectionCompanyName }) => (
        <>
          <span className={clsx('mr-1', connectionCompanyName ? (isOpened && 'text-info') : 'text-muted')}>{isOpened ? <BsFillEnvelopeOpenFill/> : <BsFillEnvelopeFill/>}</span>
          <span className={clsx('mr-1', connectionCompanyName ? (profileId === fromId ? 'text-success' : 'text-primary') : 'text-muted')}>{profileId === fromId ? <BsBoxArrowUpRight/> : <BsBoxArrowInDownRight/>}</span>
          <span className={clsx(!connectionCompanyName && 'font-italic text-muted')}>{
            connectionCompanyName ? <Link to={`/discover/profile/${profileId === fromId ? toId : fromId}`}>{connectionCompanyName}</Link> : Strings.messages.ProfileHasBeenDeleted
          }</span>
        </>
      )
    },
    {
      name: Strings.titles.DateSlashTime,
      cell: ({ date }) => <span>{DateTime.fromISO(date, { setZone: 'utc' }).toLocaleString(DateTime.DATETIME_SHORT)}</span>
    }
  ], [profileId]);

  useEffect(() => {
    fetchRequests(page, perPage);
  }, [page, perPage]);

  const handlePageChange = page => {
    // fetchRequests(page);
    setPage(page);
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPage(page);
    setPerPage(newPerPage);

    // setLoading(true);

    // const response = await axios.get(
    //   `https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`,
    // );

    // setData(response.data.data);
    // setPerPage(newPerPage);
    // setLoading(false);
  }

  const fetchRequests = (page, perPage) => {
    setLoading(true);

    apiGet(`/api/BusinessProfile/ContactRequests/${page}/${perPage}`).then(async resp => {
      if (resp.ok) {
        const { total, data, newContactRequests } = await resp.json();

        setTotalRows(total);
        setRows(data);
        setNewContactRequests(newContactRequests);
      } else {
        toast.warning(translateResponseMessage(resp));
      }
    }).catch(err => {
      toast.error(translateRequestError(err));
    }).finally(() => {
      setLoading(false);
    });
  }


  return hasUser && (
    <>
      <EmailVerificationNotice/>
      <BusinessProfileNotice>
        <DataTable
          title={Strings.titles.ContactRequests}
          columns={columns}
          dense={true}
          data={rows}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}

          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />    
      </BusinessProfileNotice>
    </>
  );
}
