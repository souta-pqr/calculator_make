import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>高機能関数電卓</h1>
      <Calculator />
    </div>
  );
};

export default App;