import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Componentes/Layout/Index";
import { Dashboard } from "./Paginas/Dashboard/Index";
import { Login } from "./Paginas/Home/Index";
import { PaginaDeErro } from "./Componentes/PaginaDeErro/Index";
import { Alunos } from "./Paginas/Alunos/Index";
import { ToastContainer } from "react-toastify";
import { AlunoForm } from "./Paginas/Alunos/AlunoForm/Index";
import PrivateRoute from "./RotaPrivada/Index";
import AuthListener from "./utils/Autenticador";
import { TabelaVirtual } from "./Paginas/TabelaVirtual/Index";
import { TabelaForm } from "./Paginas/TabelaVirtual/TabelaForm/Index";
import { Financeiro } from "./Paginas/Financeiro/Index";
import { FinanceiroForm } from "./Paginas/Financeiro/FinanceiroForm/Index";

export function App() {
  return (
    <>
      <AuthListener />
      <ToastContainer autoClose={500} />
      <Routes>
        <Route path="*" element={<PaginaDeErro />} />
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route path="/alunos" element={<PrivateRoute element={Alunos} />} />
          <Route
            path="/aluno/cadastrar"
            element={<PrivateRoute element={AlunoForm} />}
          />
          <Route
            path="/aluno/editar/:id"
            element={<PrivateRoute element={AlunoForm} />}
          />
          <Route
            path="/financeiro"
            element={<PrivateRoute element={Financeiro} />}
          />
          <Route
            path="/financeiro/controlar"
            element={<PrivateRoute element={FinanceiroForm} />}
          />
          <Route
            path="/tabela-virtual"
            element={<PrivateRoute element={TabelaVirtual} />}
          />
          <Route
            path="/tabela-virtual/adicionar"
            element={<PrivateRoute element={TabelaForm} />}
          />
          <Route
            path="/tabela-virtual/editar/:id"
            element={<PrivateRoute element={TabelaForm} />}
          />
        </Route>
      </Routes>
    </>
  );
}
