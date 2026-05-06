import React from "react";
import { NavLink } from "react-router-dom";

const rolRozetleri = {
  yonetici: "pill pill--warning",
  garson: "pill pill--neutral",
  kasiyer: "pill pill--accent",
  mutfak: "pill pill--success",
};

const Navbar = ({ navigationItems, onLogout }) => {
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">RYS</div>
        <div>
          <p className="brand-kicker">Restoran Yonetim Sistemi</p>
          <h2 className="brand-title">Operasyon Merkezi</h2>
          {user ? (
            <div className="topbar-user">
              <span>{user.kullaniciAdi}</span>
              <span className={rolRozetleri[user.rol] || "pill pill--neutral"}>{user.rol}</span>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="topnav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              isActive ? "topnav-link topnav-link--active" : "topnav-link"
            }
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
        <button className="ghost-button topbar-button" type="button" onClick={handleLogout}>
          Cikis
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
