import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "12px",
      }}
    >
      <h3>
        <FontAwesomeIcon icon={faTriangleExclamation} />
        Em Desenvolvimento.
        teste
      </h3>
    </div>
  );
}
