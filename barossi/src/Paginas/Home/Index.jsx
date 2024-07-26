import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/Complementos/Imagens/logo.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Checkbox, FormControlLabel } from "@mui/material";

export function Login() {
  const [lembrarConta, setLembrarConta] = useState(() => {
    const savedValue = localStorage.getItem("lembrarme");
    return savedValue === "true";
  });
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    localStorage.setItem("lembrarme", lembrarConta);
  }, [lembrarConta]);

  useEffect(() => {
    // Recuperar email e senha do localStorage
    const savedEmail = localStorage.getItem("emailAutenticado");
    const savedSenha = localStorage.getItem("senhaAutenticada");

    // Definir o estado do formulário com os valores recuperados
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
    }
    if (savedSenha) {
      setFormData((prevData) => ({ ...prevData, senha: savedSenha }));
    }
  }, []);

  const handleLogin = async () => {
    const { email, senha } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // Sempre salvar o email e a senha no localStorage
      localStorage.setItem("emailAutenticado", email);
      localStorage.setItem("senhaAutenticada", senha);

      if (lembrarConta === true) {
        localStorage.setItem("lembrarme", true);
      }

      if (lembrarConta === false) {
        localStorage.removeItem("lembrarme");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img className="login__container--logo" src={Logo} alt="" />
      </div>
      <div className="login__formulario">
        <div className="login__formulario__input">
          <label id="required"> Usuário </label>
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
        <FormControlLabel
          className="login__formulario__container"
          control={
            <Checkbox
              className="login__formulario__container__lembrarme"
              id="lembrarSenha"
              checked={lembrarConta}
              onChange={(e) => {
                const newValue = e.target.checked;
                setLembrarConta(newValue);
                localStorage.setItem("lembrarme", newValue);
              }}
              sx={{
                color: "#ffffff",
                "&.Mui-checked": {
                  color: "#ffffff",
                },
                "& .MuiSvgIcon-root": {
                  color: "#ffffff",
                  fontSize: 20,
                },
              }}
            />
          }
          label="Lembrar-me"
          sx={{
            color: "#ffffff",
          }}
        />

        <button onClick={handleLogin}>LOGAR</button>
      </div>
    </div>
  );
}
