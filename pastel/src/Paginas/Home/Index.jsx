import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/Complementos/Imagens/logo.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async () => {
    const { email, senha } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // Sempre salvar o email e a senha no localStorage
      localStorage.setItem("emailAutenticado", email);
      localStorage.setItem("senhaAutenticada", senha);

      // Redireciona sempre para o dashboard, sem checar tipo de usuário
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img className="login__container--logo" src={Logo} alt="" />

        <div className="login__formulario">
          <div className="login__formulario__input">
            <label id="required"> Email </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="login__formulario__input">
            <label id="required"> Senha </label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  senha: e.target.value,
                }))
              }
            />
          </div>
          <br />

          <button onClick={handleLogin}>LOGAR</button>
        </div>
      </div>
    </div>
  );
}
