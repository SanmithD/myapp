import { ChevronDown, ChevronUp, History as HistoryIcon } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import useLocalStorage from "../../hooks/useLocalStorage";
import { calculateExpression } from "../../utils/calculator";
import Display from "./Display";
import History from "./History";
import Keypad from "./Keypad";

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useLocalStorage("myapp-calc-history", []);
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  // Handle number input
  const handleNumber = useCallback(
    (num) => {
      if (justCalculated) {
        setDisplay(num);
        setExpression(num);
        setJustCalculated(false);
      } else {
        if (display === "0" && num !== ".") {
          setDisplay(num);
          setExpression((prev) =>
            prev === "" || prev === "0" ? num : prev + num
          );
        } else {
          setDisplay((prev) => prev + num);
          setExpression((prev) => prev + num);
        }
      }
    },
    [display, justCalculated]
  );

  // Handle operator input
  const handleOperator = useCallback(
    (op) => {
      setJustCalculated(false);

      // Replace last operator if there is one
      const lastChar = expression.slice(-1);
      const operators = ["+", "-", "×", "÷", "^"];

      if (operators.includes(lastChar)) {
        setExpression((prev) => prev.slice(0, -1) + op);
      } else {
        setExpression((prev) => prev + op);
      }
      setDisplay(op);
    },
    [expression]
  );

  // Handle function input (sin, cos, etc.)
  const handleFunction = useCallback((func) => {
    setJustCalculated(false);

    switch (func) {
      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
        setExpression((prev) => prev + `${func}(`);
        setDisplay(`${func}(`);
        break;
      case "√":
        setExpression((prev) => prev + "sqrt(");
        setDisplay("√(");
        break;
      case "π":
        setExpression((prev) => prev + "pi");
        setDisplay("π");
        break;
      case "e":
        setExpression((prev) => prev + "e");
        setDisplay("e");
        break;
      case "x²":
        setExpression((prev) => prev + "^2");
        setDisplay("²");
        break;
      case "(":
      case ")":
        setExpression((prev) => prev + func);
        setDisplay(func);
        break;
      default:
        break;
    }
  }, []);

  // Calculate result
  const handleEquals = useCallback(() => {
    if (!expression) return;

    try {
      const result = calculateExpression(expression);

      // Add to history
      const historyItem = {
        id: Date.now(),
        expression,
        result,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [historyItem, ...prev]);

      setDisplay(result);
      setExpression(result);
      setJustCalculated(true);
    } catch (error) {
      console.log(error);
      toast.error("Invalid expression");
      setDisplay("Error");
    }
  }, [expression, setHistory]);

  // Clear display
  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setJustCalculated(false);
  }, []);

  // Delete last character
  const handleBackspace = useCallback(() => {
    if (justCalculated) {
      handleClear();
      return;
    }

    if (expression.length > 1) {
      setExpression((prev) => prev.slice(0, -1));
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else {
      handleClear();
    }
  }, [expression, justCalculated, handleClear]);

  // Toggle positive/negative
  const handlePlusMinus = useCallback(() => {
    if (display !== "0" && display !== "Error") {
      if (display.startsWith("-")) {
        setDisplay((prev) => prev.slice(1));
        setExpression((prev) => prev.replace(/-([^+\-×÷]*)$/, "$1"));
      } else {
        setDisplay((prev) => "-" + prev);
        setExpression((prev) => {
          const match = prev.match(/([^+\-×÷]*)$/);
          if (match) {
            return prev.slice(0, -match[0].length) + "(-" + match[0] + ")";
          }
          return prev;
        });
      }
    }
  }, [display]);

  // Use history item
  const handleHistorySelect = useCallback((item) => {
    setExpression(item.result);
    setDisplay(item.result);
    setShowHistory(false);
    setJustCalculated(true);
  }, []);

  // Clear history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    toast.success("History cleared");
  }, [setHistory]);

  return (
    <div className="h-screen flex flex-col pt-14 pb-6">
      {/* Display - Fixed at top */}
      <div className="fixed w-full flex flex-col gap-2">
        <Display expression={expression} result={display} />
        {/* History Toggle */}
        <button
          onClick={() => setShowHistory(true)}
          className="w-30 flex items-center justify-center h-10 gap-2 py-3 bg-dark-800 text-dark-300 rounded hover:bg-dark-700 hover:text-white transition-colors border border-dark-700"
        >
          <HistoryIcon size={18} />
          History ({history.length})
        </button>
      </div>

      {/* Spacer to push keypad down */}
      <div className="flex-1 min-h-4" />

      {/* Bottom Section - Keypad and controls */}
      <div className="space-y-3 fixed w-full bottom-0">
        {/* Scientific Toggle */}
        <button
          onClick={() => setShowScientific(!showScientific)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-dark-400 hover:text-white transition-colors"
        >
          {showScientific ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showScientific ? "Hide" : "Show"} Scientific
        </button>

        {/* Keypad */}
        <Keypad
          onNumber={handleNumber}
          onOperator={handleOperator}
          onFunction={handleFunction}
          onEquals={handleEquals}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onPlusMinus={handlePlusMinus}
          showScientific={showScientific}
        />
      </div>

      {/* History Panel */}
      {showHistory && (
        <History
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default CalculatorApp;
