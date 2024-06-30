import React, { useState, useEffect, useCallback } from 'react';
import * as math from 'mathjs';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRadians, setIsRadians] = useState<boolean>(true);

  const handleButtonClick = (value: string) => {
    setInput((prevInput) => prevInput + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      let expression = input;
      if (!isRadians) {
        expression = expression.replace(/sin|cos|tan/g, (match) => `${match}Deg`);
      }
      const calculatedResult = math.evaluate(expression);
      setResult(calculatedResult.toString());
      setHistory((prevHistory) => [...prevHistory, `${input} = ${calculatedResult}`]);
    } catch (error) {
      setResult('Error');
    }
  };

  const handleMemoryOperation = (operation: string) => {
    switch (operation) {
      case 'M+':
        setMemory((prevMemory) => prevMemory + parseFloat(result || '0'));
        break;
      case 'M-':
        setMemory((prevMemory) => prevMemory - parseFloat(result || '0'));
        break;
      case 'MR':
        setInput((prevInput) => prevInput + memory.toString());
        break;
      case 'MC':
        setMemory(0);
        break;
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    if (/[0-9+\-*/.()]/.test(key)) {
      handleButtonClick(key);
    } else if (key === 'Enter') {
      handleCalculate();
    } else if (key === 'Backspace') {
      setInput((prevInput) => prevInput.slice(0, -1));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const checkBrackets = (expr: string): boolean => {
    const stack: string[] = [];
    for (const char of expr) {
      if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        if (stack.length === 0) return false;
        stack.pop();
      }
    }
    return stack.length === 0;
  };

  const buttons = [
    '7', '8', '9', '/', 'sin', 'asin',
    '4', '5', '6', '*', 'cos', 'acos',
    '1', '2', '3', '-', 'tan', 'atan',
    '0', '.', '+', '=', 'exp', 'ln',
    '(', ')', '^', 'sqrt', 'abs', 'log',
    'π', 'e', '!', 'M+', 'M-', 'MR',
  ];

  return (
    <div className="calculator">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter expression"
      />
      <div className="result">{result}</div>
      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') {
                if (!checkBrackets(input)) {
                  setResult('Error: Unbalanced brackets');
                } else {
                  handleCalculate();
                }
              } else if (['M+', 'M-', 'MR'].includes(btn)) {
                handleMemoryOperation(btn);
              } else {
                handleButtonClick(btn);
              }
            }}
          >
            {btn}
          </button>
        ))}
        <button onClick={handleClear}>C</button>
        <button onClick={() => handleMemoryOperation('MC')}>MC</button>
        <button onClick={() => setIsRadians(!isRadians)}>
          {isRadians ? 'Rad' : 'Deg'}
        </button>
      </div>
      <div className="history">
        <h3>History</h3>
        <ul>
          {history.slice(-5).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;