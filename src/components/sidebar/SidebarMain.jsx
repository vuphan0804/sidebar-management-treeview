import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import {
  FiHome,
  FiBell,
  FiGlobe,
  FiPhoneCall,
  FiMenu,
  FiStar,
  FiLogOut,
  FiChevronsRight,
} from "react-icons/fi";
import "./SidebarMain.scss";
import Marquee from "react-fast-marquee";

const SidebarMain = ({ data, fetchSidebars }) => {
  const { collapseSidebar } = useProSidebar();
  const [treeData, setTreeData] = useState([]);
  const [resize, setResize] = useState(0);
  const [start, setStart] = useState(false);

  const handleStartMarquee = () => {
    setStart(true);
    console.log("hello");
  };
  const handleStopMarquee = () => {
    setStart(false);
  };
  useEffect(() => {
    setTreeData(data);
  }, [data]);

  const renderSidebar = (treeData) => {
    return treeData?.map((parent, index) => {
      if (parent.children && parent.children?.length > 0) {
        return (
          <SubMenu icon={<FiChevronsRight />} label={parent.title} key={index}>
            {renderSidebar(parent.children)}
          </SubMenu>
        );
      }
      return (
        <MenuItem
          icon={<FiStar />}
          routerLink={<Link to={`/${parent.title}`} />}
          key={index}
        >
          {parent.title}
        </MenuItem>
      );
    });
  };

  return (
    <div className="fixed flex mt-15 h-full">
      <Sidebar width="300px" collapsedWidth="80px">
        <div className="text-xl font-medium text-center mt-20">Sidebar</div>
        <div className="mx-8  left-10 z-10">
          <button onClick={() => collapseSidebar()}>
            <FiMenu />
          </button>
        </div>

        <Menu className="transition-primary">
          <MenuItem
            className="visited:bg-red-400"
            routerLink={<Link to="/" />}
            icon={<FiHome />}
          >
            Trang chủ
          </MenuItem>
          {renderSidebar(treeData)}
        </Menu>
      </Sidebar>
      {/* <Menu className="absolute bottom-0 w-full bg-zinc-200 z-10">
        <SubMenu
          className=""
          label={
            <div
              onMouseEnter={handleStartMarquee}
              onMouseLeave={handleStopMarquee}
            >
              <Marquee
                // play={true}
                play={start}
              >
                Thông báo
              </Marquee>
            </div>
          }
          icon={<FiBell />}
        >
          <MenuItem> Lịch nghỉ</MenuItem>
          <MenuItem> Nâng cấp </MenuItem>
        </SubMenu>
        <MenuItem icon={<FiGlobe />}>Dịch vụ</MenuItem>
        <MenuItem icon={<FiPhoneCall />}> Liên hệ </MenuItem>

        <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
      </Menu> */}
    </div>
  );
};

export default SidebarMain;
