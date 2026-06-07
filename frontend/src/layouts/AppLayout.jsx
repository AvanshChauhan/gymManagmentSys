import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const MOBILE_BREAKPOINT = 1100;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = useCallback(() => setCollapsed((v) => !v), []);
  const closeSidebar = useCallback(() => setCollapsed(false), []);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onClose={closeSidebar} />
      {isMobile && collapsed && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <div className="app-shell__main">
        <Navbar onSidebarToggle={toggleSidebar} />
        <main className="page-frame">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
