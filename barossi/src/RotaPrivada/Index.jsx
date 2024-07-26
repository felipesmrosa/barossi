import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const email = localStorage.getItem("emailAutenticado"); // Verifique se o email está no localStorage

  return email ? <Component /> : <Navigate to="/" />; // Redireciona se não estiver autenticado
};

export default PrivateRoute;
