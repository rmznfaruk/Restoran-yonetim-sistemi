import React from "react";
import { Navigate } from "react-router-dom";

const KorunanRota = ({ izinliRoller = [], children }) => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (izinliRoller.length > 0 && (!user || !izinliRoller.includes(user.rol))) {
    return <Navigate to="/yetkisiz" replace />;
  }

  return children;
};

export default KorunanRota;
