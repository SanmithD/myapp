/* eslint-disable no-fallthrough */
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  History as HistoryIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useLocalStorage from "../../hooks/useLocalStorage";
import { calculateExpression, tryCalculate } from "../../utils/calculator";
import Display from "./Display";
import History from "./History";
import Keypad from "./Keypad";
import UnitConverter from "./UnitConverter";

const OPERATORS = ["+", "-", "×", "÷", "^", "%"];

function CalculatorApp() {
  // Core state
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [justCalculated, setJustCalculated] = useState(false);

  // History & favorites
  const [history, setHistory] = useLocalStorage("myapp-calc-history", []);
  const [favorites, setFavorites] = useLocalStorage("myapp-calc-favorites", []);

  // Memory
  const [memory, setMemory] = useLocalStorage("myapp-calc-memory", 0);

  // Settings
  const [angleMode, setAngleMode] = useLocalStorage("myapp-calc-angle", "deg");

  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [copied, setCopied] = useState(false);

  // Last answer for ANS function
  const [lastAnswer, setLastAnswer] = useState("0");

  // Real-time preview calculation
  const preview = useMemo(() => {
    if (!expression || justCalculated) return null;
    const result = tryCalculate(expression, angleMode);
    if (result && result !== display && result !== "Error") {
      return result;
    }
    return null;
  }, [expression, angleMode, display, justCalculated]);

  // Haptic feedback helper
  const vibrate = useCallback((duration = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }, []);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      vibrate(20);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
      console.log(err);
    }
  }, [display, vibrate]);

  // Handle number/decimal input
  // Uses `expression`'s trailing character (not `display`) to decide whether
  // we're starting a fresh number segment — `display` is never mutated with
  // operator symbols, so it always safely reflects the number being typed.
  const handleNumber = useCallback(
    (num) => {
      vibrate();

      if (justCalculated) {
        const start = num === "." ? "0." : num;
        setDisplay(start);
        setExpression(start);
        setJustCalculated(false);
        return;
      }

      const lastChar = expression.slice(-1);
      const startingNewSegment = expression === "" || OPERATORS.includes(lastChar) || lastChar === "(";

      if (num === ".") {
        // Find the number segment currently being typed at the end of the expression
        const match = expression.match(/(\d*\.?\d*)$/);
        const segment = match ? match[0] : "";
        if (segment.includes(".")) return; // this number already has a decimal point

        if (startingNewSegment) {
          setDisplay("0.");
          setExpression((prev) => prev + "0.");
        } else {
          setDisplay((prev) => (prev === "0" ? "0." : prev + "."));
          setExpression((prev) => prev + ".");
        }
        return;
      }

      if (startingNewSegment) {
        setDisplay(num);
        setExpression((prev) => prev + num);
      } else {
        setDisplay((prev) => (prev === "0" ? num : prev + num));
        setExpression((prev) => prev + num);
      }
    },
    [expression, justCalculated, vibrate]
  );

  // Handle operator input
  // Note: `display` is intentionally left untouched here — it keeps showing
  // the last number typed, rather than being overwritten with the operator
  // symbol (which previously caused things like "+3" to render as the result).
  const handleOperator = useCallback(
    (op) => {
      vibrate();
      setJustCalculated(false);

      setExpression((prev) => {
        if (prev === "") {
          // Allow a leading "-" for negative numbers; ignore other leading operators
          return op === "-" ? op : prev;
        }
        const lastChar = prev.slice(-1);
        if (OPERATORS.includes(lastChar)) {
          return prev.slice(0, -1) + op;
        }
        return prev + op;
      });
    },
    [vibrate]
  );

  // Handle function input (sin, cos, etc.)
  const handleFunction = useCallback(
    (func) => {
      vibrate();
      setJustCalculated(false);

      switch (func) {
        // Basic trig
        case "sin":
        case "cos":
        case "tan":
        // Inverse trig
        case "asin":
        case "acos":
        case "atan":
        // Hyperbolic
        case "sinh":
        case "cosh":
        case "tanh":
        // Logarithms
        case "log":
        case "log10":
        case "ln":
        // Other functions
        case "abs":
        case "ceil":
        case "floor":
        case "round":
          setExpression((prev) => prev + `${func}(`);
          setDisplay(`${func}(`);
          break;
        case "√":
          setExpression((prev) => prev + "sqrt(");
          setDisplay("√(");
          break;
        case "∛":
          setExpression((prev) => prev + "cbrt(");
          setDisplay("∛(");
          break;
        case "π":
          setExpression((prev) => prev + "pi");
          setDisplay("π");
          break;
        case "e":
          setExpression((prev) => prev + "e");
          setDisplay("e");
          break;
        case "φ":
          setExpression((prev) => prev + "phi");
          setDisplay("φ");
          break;
        case "x²":
          setExpression((prev) => prev + "^2");
          setDisplay("²");
          break;
        case "x³":
          setExpression((prev) => prev + "^3");
          setDisplay("³");
          break;
        case "xⁿ":
          setExpression((prev) => prev + "^");
          setDisplay("^");
          break;
        case "10ˣ":
          setExpression((prev) => prev + "10^");
          setDisplay("10^");
          break;
        case "eˣ":
          setExpression((prev) => prev + "e^");
          setDisplay("e^");
          break;
        case "2ˣ":
          setExpression((prev) => prev + "2^");
          setDisplay("2^");
          break;
        case "1/x":
          setExpression((prev) => `1/(${prev})`);
          setDisplay("1/x");
          break;
        case "n!":
          setExpression((prev) => prev + "!");
          setDisplay("!");
          break;
        case "(":
        case ")":
          setExpression((prev) => prev + func);
          setDisplay(func);
          break;
        case "ANS":
          setExpression((prev) => prev + lastAnswer);
          setDisplay(lastAnswer);
          break;
        case "rand":
          {
            const randomNum = Math.random().toFixed(6);
            setExpression((prev) => prev + randomNum);
            setDisplay(randomNum);
            break;
          }
        default:
          break;
      }
    },
    [vibrate, lastAnswer]
  );

  // Memory functions
  const handleMemory = useCallback(
    (action) => {
      vibrate();
      const currentValue = parseFloat(display) || 0;

      switch (action) {
        case "MC":
          setMemory(0);
          toast.success("Memory cleared");
          break;
        case "MR":
          if (memory !== 0) {
            setDisplay(memory.toString());
            setExpression(memory.toString());
            setJustCalculated(true);
          } else {
            toast.error("Memory is empty");
          }
          break;
        case "M+":
          setMemory((prev) => prev + currentValue);
          toast.success(`Added ${currentValue} to memory`);
          break;
        case "M-":
          setMemory((prev) => prev - currentValue);
          toast.success(`Subtracted ${currentValue} from memory`);
          break;
        case "MS":
          setMemory(currentValue);
          toast.success(`Stored ${currentValue} in memory`);
          break;
        default:
          break;
      }
    },
    [display, memory, setMemory, vibrate]
  );

  // Calculate result
  const handleEquals = useCallback(() => {
    vibrate(20);
    if (!expression) return;

    try {
      const result = calculateExpression(expression, angleMode);

      // Add to history
      const historyItem = {
        id: Date.now(),
        expression,
        result,
        timestamp: new Date().toISOString(),
        isFavorite: false,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 99)]); // Keep last 100

      setLastAnswer(result);
      setDisplay(result);
      setExpression(result);
      setJustCalculated(true);
    } catch (error) {
      console.log(error);
      toast.error("Invalid expression");
      setDisplay("Error");
      setTimeout(() => {
        setDisplay((prev) => (prev === "Error" ? "0" : prev));
        setExpression((prev) => (prev === expression ? "" : prev));
      }, 1500);
    }
  }, [expression, setHistory, angleMode, vibrate]);

  // Clear display
  const handleClear = useCallback(() => {
    vibrate();
    setDisplay("0");
    setExpression("");
    setJustCalculated(false);
  }, [vibrate]);

  // Clear everything including memory
  const handleAllClear = useCallback(() => {
    vibrate(30);
    setDisplay("0");
    setExpression("");
    setJustCalculated(false);
    setLastAnswer("0");
    toast.success("All cleared");
  }, [vibrate]);

  // Delete last character
  // Rebuilds `display` from the trailing number segment of the *new*
  // expression, instead of blindly slicing the old display string — this
  // keeps display accurate now that it no longer mirrors operator presses.
  const handleBackspace = useCallback(() => {
    vibrate();
    if (justCalculated) {
      handleClear();
      return;
    }
    if (!expression) return;

    const funcMatch = expression.match(
      /(sin|cos|tan|log10|log|ln|sqrt|cbrt|abs|ceil|floor|round|asin|acos|atan|sinh|cosh|tanh)\($/
    );

    const newExpression = funcMatch
      ? expression.slice(0, -funcMatch[0].length)
      : expression.slice(0, -1);

    setExpression(newExpression);

    if (!newExpression) {
      setDisplay("0");
      return;
    }

    const segMatch = newExpression.match(/(\d*\.?\d*)$/);
    const seg = segMatch ? segMatch[0] : "";
    setDisplay(seg || newExpression.slice(-1));
  }, [expression, justCalculated, handleClear, vibrate]);

  // Toggle positive/negative
  const handlePlusMinus = useCallback(() => {
    vibrate();
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
  }, [display, vibrate]);

  // Percentage
  const handlePercent = useCallback(() => {
    vibrate();
    if (display !== "0" && display !== "Error") {
      const value = parseFloat(display) / 100;
      setDisplay(value.toString());
      setExpression((prev) => {
        const match = prev.match(/[\d.]+$/);
        if (match) {
          return prev.slice(0, -match[0].length) + value.toString();
        }
        return prev;
      });
    }
  }, [display, vibrate]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    (item) => {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h
        )
      );

      setFavorites((prev) => {
        const exists = prev.find((f) => f.id === item.id);
        if (exists) {
          return prev.filter((f) => f.id !== item.id);
        } else {
          return [{ ...item, isFavorite: true }, ...prev];
        }
      });
    },
    [setHistory, setFavorites]
  );

  // Use history item
  const handleHistorySelect = useCallback((item) => {
    setExpression(item.result);
    setDisplay(item.result);
    setShowHistory(false);
    setJustCalculated(true);
  }, []);

  // Use history expression (recalculate)
  const handleHistoryUseExpression = useCallback((item) => {
    setExpression(item.expression);
    setDisplay(item.expression);
    setShowHistory(false);
    setJustCalculated(false);
  }, []);

  // Clear history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setFavorites([]);
    toast.success("History cleared");
  }, [setHistory, setFavorites]);

  // Export history
  const handleExportHistory = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      history: history,
      favorites: favorites,
    };
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calculator-history-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("History exported");
  }, [history, favorites]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (
        /^[0-9+\-*/.=()%^!]$/.test(e.key) ||
        ["Enter", "Backspace", "Escape", "Delete"].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (/^[0-9.]$/.test(e.key)) {
        handleNumber(e.key);
      } else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("-");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") handleOperator("÷");
      else if (e.key === "%") handlePercent();
      else if (e.key === "^") handleOperator("^");
      else if (e.key === "(") handleFunction("(");
      else if (e.key === ")") handleFunction(")");
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") handleClear();
      else if (e.key === "Backspace" || e.key === "Delete") handleBackspace();
      else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleCopy();
      } else if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        setShowScientific((prev) => !prev);
      } else if (e.key === "h" && !e.ctrlKey && !e.metaKey) {
        setShowHistory((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleNumber,
    handleOperator,
    handleFunction,
    handleEquals,
    handleClear,
    handleBackspace,
    handleCopy,
    handlePercent,
  ]);

  return (
    // 100dvh (not 100vh) avoids content being hidden behind mobile browser
    // toolbars that shrink/grow the viewport. Outer flex centers the app on
    // wide screens (tablet/desktop) instead of letting it stretch full-width.
    <div className="h-[100dvh] w-full bg-dark-900 flex justify-center overflow-hidden">
      <div className="relative w-full max-w-lg h-full flex flex-col overflow-y-auto">
        {/* Display - natural flow, not `fixed`, so it never overflows the
            centered max-w-lg column on large screens */}
        <div className="shrink-0 flex flex-col gap-2 px-3 sm:px-4 pt-3 bg-dark-900/95 backdrop-blur-sm">
          <Display
            expression={expression}
            result={display}
            preview={preview}
            angleMode={angleMode}
            memory={memory}
          />

          {/* Action buttons row */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex-1 flex items-center justify-center h-10 gap-2 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors border border-dark-700"
            >
              <HistoryIcon size={18} />
              <span className="text-sm">History ({history.length})</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={display === "0" || display === "Error"}
              className="flex items-center justify-center h-10 w-10 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors border border-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy result (Ctrl+C)"
            >
              {copied ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Copy size={18} />
              )}
            </button>

            <button
              onClick={() => setShowConverter(true)}
              className="flex items-center justify-center h-10 px-3 gap-2 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors border border-dark-700"
              title="Unit converter"
            >
              <ArrowLeftRight size={18} />
              <span className="text-sm hidden sm:inline">Convert</span>
            </button>
          </div>

          {/* Angle mode toggle */}
          <div className="flex gap-2 items-center pb-2">
            <span className="text-xs text-dark-500">Angle:</span>
            <div className="flex rounded-lg overflow-hidden border border-dark-700">
              <button
                onClick={() => setAngleMode("deg")}
                className={`px-3 py-1 text-xs transition-colors ${
                  angleMode === "deg"
                    ? "bg-primary-600 text-white"
                    : "bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white"
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setAngleMode("rad")}
                className={`px-3 py-1 text-xs transition-colors ${
                  angleMode === "rad"
                    ? "bg-primary-600 text-white"
                    : "bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white"
                }`}
              >
                RAD
              </button>
            </div>

            {memory !== 0 && (
              <button
                onClick={() => handleMemory("MR")}
                className="ml-auto px-2 py-1 text-xs bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors"
                title="Click to recall memory"
              >
                M: {memory}
              </button>
            )}

            <span className="ml-auto text-xs text-dark-600 hidden md:inline">
              ⌨️ Keyboard enabled
            </span>
          </div>
        </div>

        {/* Flexible gap — collapses naturally on short screens instead of
            causing header/keypad to overlap, which `fixed` positioning risked */}
        <div className="flex-1 min-h-2" />

        {/* Keypad section - natural flow, shrink-0 keeps its own height,
            overflow-y-auto is a safety net if scientific mode + a short
            viewport ever combine to need more room than available */}
        <div className="shrink-0 space-y-2 bg-dark-900/95 backdrop-blur-sm px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
          <button
            onClick={() => setShowScientific(!showScientific)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-dark-400 hover:text-white transition-colors"
          >
            {showScientific ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showScientific ? "Hide" : "Show"} Scientific (S)
          </button>

          <Keypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onEquals={handleEquals}
            onClear={handleClear}
            onAllClear={handleAllClear}
            onBackspace={handleBackspace}
            onPlusMinus={handlePlusMinus}
            onPercent={handlePercent}
            onMemory={handleMemory}
            showScientific={showScientific}
            memory={memory}
          />
        </div>
      </div>

      {/* Modals stay full-viewport `fixed` overlays — that's correct as-is */}
      {showHistory && (
        <History
          history={history}
          favorites={favorites}
          onSelect={handleHistorySelect}
          onUseExpression={handleHistoryUseExpression}
          onClear={handleClearHistory}
          onClose={() => setShowHistory(false)}
          onToggleFavorite={handleToggleFavorite}
          onExport={handleExportHistory}
        />
      )}

      {showConverter && (
        <UnitConverter
          initialValue={display !== "Error" ? display : "0"}
          onClose={() => setShowConverter(false)}
        />
      )}
    </div>
  );
}

export default CalculatorApp;