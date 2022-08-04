import React from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";

import "./Sidebar.css";

function Sidebar() {
  return (
    <div>
      {/* <Nav>
        <NavIcon to="#">
          <FaIcons.FaFolder />
        </NavIcon>
      </Nav> */}
      <div className="sidebar-nav">
        <div className="sidebar-nav-child">
          <Link to="/workspace/new">
            <button className="sidebar-btn">워크스페이스 생성</button>
          </Link>
        </div>

        <div className="sidebar-wrap">
          {SidebarData.map((item, i) => {
            return <SubMenu item={item} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
