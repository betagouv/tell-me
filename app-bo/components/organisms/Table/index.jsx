import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import MuiBox from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import MuiIconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiTable from '@mui/material/Table'
import MuiTableBody from '@mui/material/TableBody'
import MuiTableCell from '@mui/material/TableCell'
import MuiTableHead from '@mui/material/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import PropTypes from 'prop-types'

import Button from '../../atoms/Button'
import IconInput from '../../atoms/IconInput'
import LinkIconButton from '../../atoms/LinkIconButton'
import Loader from './Loader'

const Card = styled(MuiCard)`
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(204, 197, 185, 0.75);
  padding: 1rem;
`

const ActionsContainer = styled(MuiBox)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.75rem;
`

const TableHead = styled(MuiTableHead)`
  .MuiTableCell-head {
    font-weight: 700;
  }
`

const TableCell = styled(MuiTableCell)`
  padding: 0.5rem;
`
const IdTableCell = styled(TableCell)`
  max-width: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 4rem;

  &.MuiTableCell-body {
    font-size: 0.75rem;
    padding-bottom: 0;
    padding-top: calc(0.5rem - 5px);
  }
`
const ActionTableCell = styled(TableCell)`
  padding: 0;
  width: 2rem;
`

const EditButton = styled(LinkIconButton)`
  color: ${p => p.theme.palette.info.main};

  :hover {
    color: ${p => p.theme.palette.info.dark};
  }
`

const DeleteButton = styled(MuiIconButton)`
  color: ${p => p.theme.palette.error.main};

  :hover {
    color: ${p => p.theme.palette.error.dark};
  }
`

export default function Table({ columns, data, isLoading, name, onAdd, onDelete, path, title }) {
  const canAdd = onAdd !== null

  return (
    <Card>
      <ActionsContainer>
        <IconInput color="primary" disabled={isLoading} size="small">
          <SearchOutlinedIcon color="primary" />
        </IconInput>

        {canAdd && <Button color="primary" disabled={isLoading} onClick={onAdd} size="small">{`New ${name}`}</Button>}
      </ActionsContainer>

      <MuiTable>
        <TableHead>
          <MuiTableRow>
            <IdTableCell>Id</IdTableCell>
            {columns.map(({ label }) => (
              <TableCell key={label}>{label}</TableCell>
            ))}
            <ActionTableCell />
            <ActionTableCell />
          </MuiTableRow>
        </TableHead>

        <MuiTableBody>
          {!isLoading && data.length === 0 && (
            <MuiTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell colSpan={columns.length + 3}>No data.</TableCell>
            </MuiTableRow>
          )}

          {data.map(({ _id: id, ...dataItem }) => (
            <MuiTableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <IdTableCell component="th" scope="row">
                {id}
              </IdTableCell>

              {columns.map(({ key }) => (
                <TableCell key={key}>{dataItem[key]}</TableCell>
              ))}

              <ActionTableCell>
                <EditButton to={`/${path}/${id}`}>
                  <EditOutlinedIcon fontSize="small" />
                </EditButton>
              </ActionTableCell>

              <ActionTableCell>
                <DeleteButton onClick={() => onDelete(id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </DeleteButton>
              </ActionTableCell>
            </MuiTableRow>
          ))}
        </MuiTableBody>
      </MuiTable>

      {isLoading && <Loader />}
    </Card>
  )
}

Table.defaultProps = {
  onAdd: null,
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
