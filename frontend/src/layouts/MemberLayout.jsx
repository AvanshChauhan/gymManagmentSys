import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import MemberSidebar from "../components/layout/MemberSidebar.jsx";

const MemberLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell member-shell">
      <MemberSidebar
        collapsed={collapsed}
      />
      <div className="app-shell__main">
        <Navbar onSidebarToggle={() => setCollapsed((value) => !value)} />
        <main className="page-frame">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
