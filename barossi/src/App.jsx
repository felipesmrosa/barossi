import React from 'react'
import { Route, Routes } from "react-router-dom"
import { Layout } from "./Componentes/Layout/Index"
import { Dashboard } from "./Paginas/Dashboard/Index"

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}