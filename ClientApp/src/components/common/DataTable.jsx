import React from 'react';
import ReactDataTable from 'react-data-table-component';
import debounce from "lodash.debounce";
import ReactTooltip from "react-tooltip";
import { Button } from 'reactstrap';
import LoadingOverlay from './LoadingOverlay';
import { Strings } from '@i18n';


export default function DataTable({
  customStyles = {},
  ...rest
}) {
  return (
    <ReactDataTable {...rest}
      progressComponent={<LoadingOverlay/>}
      customStyles={{
        tableWrapper: {
          style: {
            height: 'auto'
          }
        },
        ...customStyles
      }}
    />
  );
}

export function Actions({
  onEdit,
  onDelete,
  editDisabled = false,
  deleteDisabled = false,
  ...rest
}) {

  return (
    <div className="datatable-actions">
      {onEdit && <Button size="sm" color="primary" disabled={editDisabled} onClick={onEdit} {...rest}>{Strings.titles.Edit}</Button>}
      {onDelete && <Button size="sm" color="danger" disabled={deleteDisabled} onClick={onDelete} {...rest}>{Strings.titles.Delete}</Button>}
    </div>
  );
}

export const rebuildTooltip = debounce(() => ReactTooltip.rebuild(), 300, {
  leading: false,
  trailing: true
});
