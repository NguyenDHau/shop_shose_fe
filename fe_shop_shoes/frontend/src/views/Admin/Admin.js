import React from 'react';
import Sidebar from './components/SideBar/SideBar';
import Header from './components/Header/Header';
import { Outlet } from 'react-router-dom';

function Admin() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
        <div style={{ padding: '20px', marginTop: '0px' }}>
          <Outlet /> {/* Hiển thị nội dung của các route con */}
        </div>
      </div>
    </div>
  );
}

export default Admin;
