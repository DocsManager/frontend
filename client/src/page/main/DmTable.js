import React, { useState, useEffect, createContext } from "react";
import { TableBody, TableCell, TableContainer } from "@mui/material";
import { Box, TablePagination, TableRow } from "@mui/material";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { Table } from "@mui/material";
import { StarBorderOutlined, StarOutlined } from "@mui/icons-material";
import DmTableHead from "./DmTableHead";
import DmTableToolbar from "./DmTableToolbar";
import WriteModal from "./WriteModal";
import {
  openInfoModal,
  getList,
  importantFile,
  removeImportantFile,
} from "../../api/documentApi";
import Modal from "./Modal";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  // console.log(stabilizedThis);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0].documentNo, b[0].documentNo);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const MyContext = createContext({
  check: "",
  setCheckHandler: (check) => {},
});

export default function DmTable(props) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectStar, setSelectStar] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [list, setList] = useState([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [document, setDocument] = useState("");
  const [check, setCheck] = useState(false);

  const setCheckHandler = (check) => setCheck(check);

  useEffect(() => {
    getList(setList, props.documentUrl ? props.documentUrl : "");
  }, [check]);
  let newSelected = [];

  const handleRequestSort = (event, property) => {
    console.log(property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      //체크 표시할 시, 모든 documentNo를 담음
      newSelected = list.map((n) => n.documentNo.documentNo);
      setSelected(newSelected);
      // console.log(newSelected);
    } else {
      setSelected([]); //아닐 경우 selected에는 빈값
    }
  };

  //각 table row에 걸려있는 클릭 이벤트
  const handleClick = (event, li) => {
    const selectedIndex = selected.indexOf(li.documentNo.documentNo); //selected라는 빈 배열에 documentNo 값을 찾았을 때 검색된 문자열이 첫번째로 나타나는 위치를 알려줌
    console.log(li);

    // let newSelected = [];

    if (selectedIndex === -1) {
      //-1이면 찾는 문자열이 배열에 없다는 뜻
      newSelected = newSelected.concat(selected, li.documentNo.documentNo); //newSelected라는 빈 배열에 이미 선택된 값을 담은 selected 배열과 documentNo를 합쳐 담기
      console.log(newSelected);
    } else if (selectedIndex === 0) {
      //이미 선택한 row 인덱스가 제일 처음부터 배열에 존재한다면? => 선택된 값이 담겨있는 selected 배열에서 다음 값(slice 함수 사용)을 합쳐 newSelected 배열에 담아야 함
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    // console.log(documentNo);
    setSelected(newSelected);
  };

  //행마다 별 클릭하는 이벤트
  const handleStarClick = (event, li) => {
    const selectedIndex = selectStar.indexOf(li.documentNo); //selected라는 빈 배열에 documentNo 값을 찾았을 때 검색된 문자열이 첫번째로 나타나는 위치를 알려줌
    // console.log(selectedIndex);
    let newSelected = [];
    if (selectedIndex === -1) {
      //-1이면 찾는 문자열이 배열에 없다는 뜻
      newSelected = newSelected.concat(selectStar, li.documentNo); //newSelected라는 빈 배열에 이미 선택된 값을 담은 selected 배열과 documentNo를 합쳐 담기
    } else if (selectedIndex === 0) {
      //이미 선택한 row 인덱스가 제일 처음부터 배열에 존재한다면? => 선택된 값이 담겨있는 selected 배열에서 다음 값(slice 함수 사용)을 합쳐 newSelected 배열에 담아야 함
      newSelected = newSelected.concat(selectStar.slice(1));
    } else if (selectedIndex === selectStar.length - 1) {
      newSelected = newSelected.concat(selectStar.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectStar.slice(0, selectedIndex),
        selectStar.slice(selectedIndex + 1)
      );
    }

    li.important
      ? removeImportantFile(li.documentNo.documentNo)
      : importantFile(li.documentNo.documentNo);

    setSelectStar(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (documentNo) => selected.indexOf(documentNo) !== -1;
  const isStarClicked = (documentNo) => selectStar.indexOf(documentNo) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "98%", mb: 2, margin: "0 auto" }}>
        <MyContext.Provider value={{ check, setCheckHandler }}>
          <DmTableToolbar
            numSelected={selected.length}
            newSelected={selected}
            setSelected={setSelected}
          />
        </MyContext.Provider>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <DmTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={list.length}
            />

            <TableBody>
              {stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((li, index) => {
                  const isItemSelected = isSelected(li.documentNo.documentNo);
                  const isStarSelected = isStarClicked(li.documentNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1} //탭 순서 임의로 컨트롤
                      key={li.documentNo.documentNo}
                      selected={isItemSelected}
                      // onClick={(event) =>
                      //   handleClick(event, li.documentNo.documentNo)
                      // }
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                          onClick={(event) => handleClick(event, li)}
                        />
                      </TableCell>
                      <TableCell>
                        {li.important ? (
                          <Checkbox
                            icon={<StarOutlined sx={{ color: "#F4E029" }} />}
                            checked={isStarSelected}
                            checkedIcon={<StarBorderOutlined />}
                            onClick={(event) => handleStarClick(event, li)}
                          />
                        ) : (
                          <Checkbox
                            icon={<StarBorderOutlined />}
                            checked={isStarSelected}
                            checkedIcon={
                              <StarOutlined sx={{ color: "#F4E029" }} />
                            }
                            onClick={(event) => handleStarClick(event, li)}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="center"
                        onClick={() => {
                          openInfoModal(
                            setInfoModalOpen,
                            li.documentNo.documentNo
                          );
                          setDocument(li);
                          console.log(li);
                        }}
                      >
                        {li.documentNo.originalName}
                      </TableCell>
                      {/* {(() => {
                        switch (window.location.href.split("/main")[1]) {
                          case "":
                            return (
                              <TableCell align="center">
                                {li.documentNo.content}
                              </TableCell>
                            );
                          default:
                            return ( */}
                      <TableCell align="center">
                        {li.documentNo.user.name}
                      </TableCell>
                      {/* );
                        }
                      })()} */}

                      <TableCell align="center">
                        {li.documentNo.registerDate
                          .replace("T", " ")
                          .slice(0, 16)}
                      </TableCell>
                      <TableCell align="center">
                        {li.documentNo.modifyDate
                          .replace("T", " ")
                          .slice(0, 16)}
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
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <MyContext.Provider value={{ check, setCheckHandler }}>
        <Modal
          open={infoModalOpen}
          document={document}
          infoModalOpen={setInfoModalOpen}
        />
      </MyContext.Provider>
    </Box>
  );
}
