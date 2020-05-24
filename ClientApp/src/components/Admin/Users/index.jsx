import React, { useState, useEffect, useMemo, useRef } from 'react';
import DateTime from 'luxon/src/datetime.js'
// import { Link, Redirect } from 'react-router-dom';
import { Container, Row, Col /*, Button*/ } from 'reactstrap';
import DataTable /*, { Actions }*/ from '@components/common/DataTable';
import InlineMessage from '@components/common/InlineMessage';
import { RProgressApi } from 'rprogress';
import { apiGet /*, apiDelete*/ } from '@utils/net';
import { translateRequestError, httpRejectedError } from '@i18n';
import MsgBox from '@components/common/MsgBox';
// import { toast } from 'react-toastify';
// import { Strings } from '@i18n';


export default function Users() {
  const [rows, setRows] = useState([]);
  // const [doEditId, setDoEditId] = useState();
  const [pending, setPending] = useState(true);
  const [fetchError, setFetchError] = useState();
  const [requestError, setRequestError] = useState();
  const msgboxRef = useRef();

  // const handleEditClick = ({ target }) => {
  //   console.log('Edit', target.dataset.id);
  //   setDoEditId(target.dataset.id);
  // }
  // const handleDeleteClick = ({ target }) => {
  //   console.log('Delete', target.dataset.id, target.parentNode);

  //   const { id } = target.dataset;

  //   if(id) {
  //     msgboxRef.current.show({
  //       title: `Delete Content Block Id#${id}?`,
  //       message: `${Strings.messages.DeleteEntry}`,
  //       color: 'danger',
  //       buttons: 'delete,cancel',
  //       onConfirm: async () => {
  //         console.log('deleting', id);

  //         target.parentNode.classList.add('disabled');

  //         try {
  //           const resp = await apiDelete(`/api/Content/${id}`, { addAuth: true });

  //           if(resp.ok) {
  //             toast.success(Strings.messages.EntryDeleted);

  //             setRows(prevRows => {
  //               const rowIndex = prevRows.findIndex(item => item.id == id);
      
  //               if(rowIndex !== -1) {
  //                 prevRows.splice(rowIndex, 1);
  //                 return [...prevRows];
  //               }
    
  //               return prevRows;
  //             });
  //           } else {
  //             target.parentNode.classList.remove('disabled');
  //             setFetchError(httpRejectedError(resp.status));
  //           }
  //         } catch(err) {
  //           target.parentNode.classList.remove('disabled');
  //           setRequestError(translateRequestError(err && err.message));
  //         }
  //       }
  //     });
  //   }
  // }

  const columns = useMemo(() => [
    {
      name: 'Email',
      selector: 'email',
      sortable: true
    },
    {
      name: 'Roles',
      selector: 'roleNames',
      cell: ({ roleNames }) => roleNames.join(', ')
    },
    {
      name: 'Phone number',
      selector: 'phoneNumber'
    },
    {
      name: 'Registration',
      selector: 'registrationDate',
      sortable: true,
      cell: ({ registrationDate }) => registrationDate && 
        DateTime.fromISO(registrationDate, { setZone: 'utc' }).toLocaleString()
    },
    {
      name: 'Last Login',
      selector: 'lastLoginTime',
      sortable: true,
      cell: ({ lastLoginTime }) => lastLoginTime && 
        DateTime.fromISO(lastLoginTime, { setZone: 'utc' }).toLocaleString(DateTime.DATETIME_SHORT)
    },
    // {
    //   name: 'Actions',
    //   button: true,
    //   width: '200px',
    //   cell: ({ id }) => <Actions onEdit={handleEditClick} onDelete={handleDeleteClick} data-id={id}/>
    // }
  ], []);

  useEffect(() => fetchData(), []);

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

  // if(doEditId) {
  //   return <Redirect to={`/admin/content/edit/${doEditId}`}/>
  // }

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
        // actions={<Button color="primary" tag={Link} to="/admin/content/add">Add new Content Block</Button>}
        data={rows}
        progressPending={pending}
        pagination />
      <MsgBox ref={msgboxRef} />
    </>
  );
}
