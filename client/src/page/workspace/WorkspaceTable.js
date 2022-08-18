import React, { Fragment, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { Link } from "react-router-dom";
import {
  deleteAllWorkspaceUser,
  deleteUserWorkspace,
} from "../../api/workspaceUserApi";
import { getUser } from "../../component/getUser/getUser";
import { Button } from "@mui/material";
import AddMember from "../main/AddMember";
import EditIcon from "@material-ui/icons/Edit";
import EditTitle from "./EditTitle";

function createData(
  title,
  master,
  registerDate,
  member,
  workspaceNo,
  workspace
) {
  return { title, master, registerDate, member, workspaceNo, workspace };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// type Order = 'asc' | 'desc';

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "워크스페이스명",
  },
  {
    id: "master",
    numeric: true,
    disablePadding: false,
    label: "생성자",
  },
  {
    id: "registerDate",
    numeric: true,
    disablePadding: false,
    label: "생성일",
  },
  {
    id: "member",
    numeric: true,
    disablePadding: false,
    label: "멤버",
  },
  {
    id: "setting",
    numeric: true,
    disablePadding: false,
    label: "옵션",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === 5}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected, setWorkspace, setSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 && (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => {
              deleteAllWorkspaceUser(getUser().userNo, selected, setWorkspace);
              setSelected([]);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function WorkspaceTable({ user, workspace, setWorkspace }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState({ member: false, edit: false });
  const [row, setRow] = useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const rows = [];
  if (workspace.length !== 0) {
    workspace.map((v) =>
      rows.push(
        createData(
          v.workspaceNo.title,
          v.workspaceNo.master.name,
          v.workspaceNo.registerDate,
          v.member,
          v.workspaceNo.workspaceNo,
          v
        )
      )
    );
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows
        .slice(page * 5, (page + 1) * 5)
        .map((n) => n.workspaceNo);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, workspaceNo) => {
    const selectedIndex = selected.indexOf(workspaceNo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, workspaceNo);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  console.log(rows);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setWorkspace={setWorkspace}
          setSelected={setSelected}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * 5, page * 5 + 5)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.workspaceNo);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.workspaceNo}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={(event) =>
                            handleClick(event, row.workspaceNo)
                          }
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Link to={`/main/document?room=${row.workspaceNo}`}>
                          {row.title}
                        </Link>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => {
                            const open = { member: false, edit: true };
                            setOpen(open);
                            setRow(row);
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">{row.master}</TableCell>
                      <TableCell align="right">
                        {row.registerDate.split("T")[0]}
                      </TableCell>
                      <TableCell align="right">
                        {row.member.map((member, index) =>
                          row.member.length - 1 != index ? (
                            <Fragment key={index}>{`${
                              member.split(",")[1]
                            },`}</Fragment>
                          ) : (
                            <Fragment key={index}>
                              {member.split(",")[1]}
                            </Fragment>
                          )
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => {
                            setRow(row);
                            open.member = true;
                            setOpen(open);
                          }}
                        >
                          멤버추가
                        </Button>

                        <Button
                          sx={{ color: "red" }}
                          onClick={() =>
                            deleteUserWorkspace(
                              user.userNo,
                              row.workspaceNo,
                              setWorkspace
                            )
                          }
                        >
                          나가기
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={rows.length}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      <AddMember
        open={open}
        setOpen={setOpen}
        row={row}
        setList={setWorkspace}
      />
      <EditTitle
        open={open}
        setOpen={setOpen}
        row={row}
        setList={setWorkspace}
      />
    </Box>
  );
}
