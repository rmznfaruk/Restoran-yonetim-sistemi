import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const rolRozetleri = {
  yonetici: "pill pill--warning",
  garson: "pill pill--neutral",
  kasiyer: "pill pill--accent",
  mutfak: "pill pill--success",
};

const Navbar = ({ navigationItems, onLogout }) => {
  const location = useLocation();
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsMenuOpen(false);
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

      <button
        className={`menu-toggle${isMenuOpen ? " menu-toggle--open" : ""}`}
        type="button"
        onClick={() => setIsMenuOpen((current) => !current)}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        aria-label={isMenuOpen ? "Menuyu kapat" : "Menuyu ac"}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="primary-navigation"
        className={`topnav${isMenuOpen ? " topnav--open" : ""}`}
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              isActive ? "topnav-link topnav-link--active" : "topnav-link"
            }
            to={item.to}
            onClick={() => setIsMenuOpen(false)}
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
