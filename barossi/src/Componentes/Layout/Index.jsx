import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "@/Complementos/Imagens/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHouse, faMoneyBill, faRightFromBracket, faTag, faUsers } from "@fortawesome/free-solid-svg-icons";
import { NotificationIcon } from "../FundoPadrao/Notificacoes/Index";

export function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const role = localStorage.getItem("role"); // Pegando o tipo de usuário
  const emailAutenticado = localStorage.getItem("emailAutenticado"); // Pegando o e-mail autenticado

  // Lista de e-mails com roles específicas
  const usuarioRestrito = [
    "karate@barossi.com",
    "pilates@barossi.com",
    "taekwondo@barossi.com",
    "ginastica@barossi.com",
    "jiujitsu@barossi.com",
    "boxechines@barossi.com"
  ];

  // Função para alternar a visibilidade do menu de notificações
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (menuAberto) {
      setMenuAberto(false); // Fecha o menu se ele estiver aberto
    }
  };

  // Função para fechar o menu quando um item for clicado
  const handleLinkClick = () => {
    setMenuAberto(!menuAberto);
    if (isOpen) {
      setIsOpen(false); // Fecha as notificações se já estiverem abertas
    }
  };

  const handleLogOut = () => {
    // Limpar os dados do localStorage (email, role, ou outros dados de autenticação)
    localStorage.clear();

    // Redirecionar para a página de login
    window.location.href = "/"; // Ou use o react-router para redirecionar, se necessário
  };

  return (
    <div className={`layout ${menuAberto ? "menu-aberto" : ""}`}>
      <header className="cabecalho">
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img src={logo} alt="" />
        <div className="cabecalho__notification">
          <div onClick={toggleNotifications} className="cabecalho__notification--icon">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </div>
        </div>
        {isOpen && <NotificationIcon />}
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuAberto ? "open" : ""}`}>
        <nav>
          <ul>
            {/* Menu completo para o guilherme@barossi.com */}
            {emailAutenticado === "guilherme@barossi.com" ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faHouse} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/alunos" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faUsers} />
                    Alunos
                  </Link>
                </li>
                <li>
                  <Link to="/tabela-virtual" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faTag} />
                    Tabela Virtual
                  </Link>
                </li>
                <li>
                  <Link to="/financeiro" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faMoneyBill} />
                    Financeiro
                  </Link>
                </li>
              </>
            ) : (
              // Menu restrito para outros usuários
              <>
                {usuarioRestrito.includes(emailAutenticado) && (
                  <>
                    <li>
                      <Link to="/dashboard" onClick={handleLinkClick}>
                        <FontAwesomeIcon icon={faHouse} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/alunos" onClick={handleLinkClick}>
                        <FontAwesomeIcon icon={faUsers} />
                        Alunos
                      </Link>
                    </li>
                    <li>
                      <Link to="/financeiro" onClick={handleLinkClick}>
                        <FontAwesomeIcon icon={faTag} />
                        Relatórios
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Link Sair separado */}
        <div className="sidebar__logout">
          <Link onClick={handleLogOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="conteudo">
        <Outlet /> {/* Isso vai renderizar os componentes filhos aqui */}
      </main>
    </div>
  );
}
