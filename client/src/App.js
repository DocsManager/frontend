import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./page/login/SignUp";
import Login from "./page/login/Login";
import Main from "./page/Main";
import NotFound from "./page/notfound/NotFound";
import WorkspaceList from "./page/workspace/WorkspaceList";
import Workspace from "./page/workspace/Workspace";
import TrashCan from "./page/main/TrashCan";
import MyBox from "./page/main/MyBox";
import ShareBox from "./page/main/ShareBox";
import Important from "./page/main/Important";
import Mypage from "./page/login/MyPage";
import FindIdAndPw from "./page/login/FindIdAndPw";
import SuccessSignup from "./page/login/SuccessSignup";
import PrivateRoute from "./page/login/PrivateRoute";
import PublicRoute from "./page/login/PublicRoute";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./Config";

// import TodoApp from "./page/main/TodoApp";

function App() {
  const [isLogged, SetIsLogged] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/findidpw" element={<FindIdAndPw />} />
            <Route path="/successsignup" element={<SuccessSignup />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/main" element={<Main />}>
              <Route index element={<MyBox />} />
              <Route path="share" element={<ShareBox />} />
              <Route path="important" element={<Important />} />
              <Route path="workspace" element={<WorkspaceList />} />
              <Route path="trashcan" element={<TrashCan />} />
              <Route path="mypage" element={<Mypage />} />
            </Route>
          </Route>
          <Route path="document" element={<Workspace />} />
          {/* workspace에 사이드바 안 보이게 하려고 뺏는데 알림 토스트 메시지가 안 오는 부작용.. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
