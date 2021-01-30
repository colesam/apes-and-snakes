import React from "react";
import logo from "./logo.svg";
import styled from "styled-components";

function App() {
  const AppHeader = styled.header`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  `;

  return (
    <div className="App">
      <AppHeader>Hello!</AppHeader>
    </div>
  );
}

export default App;
