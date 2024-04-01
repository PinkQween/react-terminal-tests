import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import KeyPress from './utils/keyPress.jsx';
import Context from './utils/globalsContext.js';
import globals from './utils/globals.js';

// Function to save data to localStorage
const saveDataToLocalStorage = (data) => {
  const dataWithoutHistory = { ...data };
  dataWithoutHistory.displayHistory = [];
  dataWithoutHistory.input = "";
  dataWithoutHistory.cursorPosition = 0;
  dataWithoutHistory.verticalCursorPosition = -1;
  localStorage.setItem("data", JSON.stringify(dataWithoutHistory));
};

// Function to load data from localStorage
const loadDataFromLocalStorage = () => {
  const data = localStorage.getItem("data");
  if (data) {
    const parsedData = JSON.parse(data);
    // Ensure displayHistory is initialized as an empty array
    parsedData.displayHistory = parsedData.displayHistory || [];
    parsedData.input = ""
    parsedData.files = globals.files 
    parsedData.cursorPosition = 0
    parsedData.verticalCursorPosition = -1
    return parsedData;
  }
  return null;
};

const Root = () => {
  const [global, setGlobal] = useState(loadDataFromLocalStorage() || globals);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveDataToLocalStorage(global);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [global]);

  return (
    <Context.Provider value={{ global, setGlobal }}>
      <KeyPress>
        <App />
      </KeyPress>
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
