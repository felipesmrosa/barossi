import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Componentes/Layout/Index";
import { Dashboard } from "./Paginas/Dashboard/Index";
import { Login } from "./Paginas/Home/Index";
import { PaginaDeErro } from "./Componentes/PaginaDeErro/Index";
import { Alunos } from "./Paginas/Alunos/Index";
import { ToastContainer } from "react-toastify";
import { AlunoForm } from "./Paginas/Alunos/CadastrarAluno/Index";

export function App() {
  return (
    <>
      <ToastContainer
        autoClose={500} // Tempo em milissegundos
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="*" element={<PaginaDeErro />} />
        <Route path="/" element={<Login />}></Route>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/aluno/cadastrar" element={<AlunoForm />} />
          <Route path="/aluno/editar/:id" element={<AlunoForm />} />
        </Route>
      </Routes>
    </>
  );
}
