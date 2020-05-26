import React from 'react';
import ReactDataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import LoadingOverlay from './LoadingOverlay';


export default function DataTable(props) {
  return (
    <ReactDataTable {...props}
      progressComponent={<LoadingOverlay/>}
      customStyles={{
        tableWrapper: {
          style: {
            height: 'auto'
          }
        }
      }}
    />
  );
}

export function Actions({
  onEdit,
  onDelete,
  ...rest
}) {

  return (
    <div className="datatable-actions">
      {onEdit && <Button size="sm" color="primary" onClick={onEdit} {...rest}>Edit</Button>}
      {onDelete && <Button size="sm" color="danger" onClick={onDelete} {...rest}>Delete</Button>}
    </div>
  );
}
