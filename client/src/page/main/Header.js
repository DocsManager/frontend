import React, { useState, useEffect, useContext } from "react";
import { FormGroup, Navbar, NavbarBrand } from "reactstrap";
import "./Header.css";
import { getNoticeList, wsDocsSubscribe } from "../../api/noticeApi";
import { NoticePopover } from "./NoticePopover";
import { createContext } from "react";
import { notify } from "../Toast";
import "react-toastify/dist/ReactToastify.css";
import "../Toast.css";
import {
  Avatar,
  Popover,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { AccountBox, Logout } from "@mui/icons-material";
import { MyContext } from "../Main";
import { logout } from "../../api/userApi";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export const NoticeContext = createContext({
  isRead: "",
  setIsReadHandler: (isRead) => {},
});

const PopoverBtn = styled(Button)({
  backgroundColor: "#3791f8",
  color: "white",
  fontSize: "1em",
  "&:hover": {
    fontWeight: "bold",
  },
});

export default function Header() {
  const [noticeList, setNoticeList] = useState([]);
  const [isRead, setIsRead] = useState(false);
  const [newNotice, setNewNotice] = useState();
  const [headerCheck, setHeaderCheck] = useState(false);
  const {
    check,
    setCheckHandler,
    userInfo,
    toast,
    setToastHandler,
    noticeCheck,
    setNoticeCheckHandler,
  } = useContext(MyContext);
  const setIsReadHandler = (isRead) => setIsRead(isRead);
  useEffect(() => {
    getNoticeList(setNoticeList, userInfo);
  }, [isRead, newNotice, headerCheck]);
  useEffect(() => {
    wsDocsSubscribe(
      setNewNotice,
      setNoticeList,
      noticeList,
      setCheckHandler,
      check,
      0,
      userInfo,
      noticeCheck,
      setNoticeCheckHandler
    );
  }, []);

  //Toast message 띄워주는 함수
  const showNotice = (newNotice) => {
    if (toast) {
      notify(newNotice);
    }
    //newNotice 초기화 해주자..
    setNewNotice();
  };

  //프로필 사진 변경, 로그아웃 popover를 위한 코드
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [, , removeCookie] = useCookies(["accessToken"]);
  const deleteCookie = () => {
    removeCookie(["accessToken"]);
  };

  return (
    <div>
      <Navbar className="header-box">
        <NavbarBrand href="/main" style={{ padding: "0" }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="banner"
            className="header-logo"
          />
        </NavbarBrand>
        <div className="header-user">
          <div className="header-user-icon">
            <Avatar
              onClick={handleClick}
              sx={{ bgcolor: "#3791F8", cursor: "pointer" }}
              src={userInfo.profile}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{ width: "400px !important" }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Link to="/main/mypage">
                  <PopoverBtn
                    variant="contained"
                    endIcon={<AccountBox />}
                    onClick={handleClose}
                  >
                    마이페이지
                  </PopoverBtn>
                </Link>
                <PopoverBtn
                  variant="contained"
                  endIcon={<Logout />}
                  onClick={() => {
                    logout();
                    deleteCookie();
                  }}
                >
                  로그아웃
                </PopoverBtn>
              </Box>
            </Popover>
          </div>
          <p className="header-user-text">
            <span>{userInfo.name}</span>님 환영합니다
          </p>
          {newNotice && showNotice(newNotice)}
          <div className="header-alert">
            <NoticeContext.Provider value={{ isRead, setIsReadHandler }}>
              <NoticePopover
                noticeList={noticeList}
                setNoticeList={setNoticeList}
                newNotice={newNotice}
                setCheck={setHeaderCheck}
                check={headerCheck}
              />
            </NoticeContext.Provider>
            <div className="header-profile" />
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={toast}
                  onChange={() => {
                    setToastHandler(!toast);
                  }}
                />
              }
              label="알림 ON/OFF"
            />
          </FormGroup>
        </div>
      </Navbar>
    </div>
  );
}
