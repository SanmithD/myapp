import { Delete } from "lucide-react";

function Keypad({
  onNumber,
  onOperator,
  onFunction,
  onEquals,
  onClear,
  onBackspace,
  onPlusMinus,
  showScientific,
}) {
  // Scientific buttons
  const scientificButtons = [
    { label: "sin", action: () => onFunction("sin") },
    { label: "cos", action: () => onFunction("cos") },
    { label: "tan", action: () => onFunction("tan") },
    { label: "log", action: () => onFunction("log") },
    { label: "ln", action: () => onFunction("ln") },
    { label: "√", action: () => onFunction("√") },
    { label: "π", action: () => onFunction("π") },
    { label: "e", action: () => onFunction("e") },
    { label: "x²", action: () => onFunction("x²") },
    { label: "^", action: () => onOperator("^") },
    { label: "(", action: () => onFunction("(") },
    { label: ")", action: () => onFunction(")") },
  ];

  // Main buttons layout
  const mainButtons = [
    { label: "C", action: onClear, type: "function" },
    { label: "±", action: onPlusMinus, type: "function" },
    { label: "%", action: () => onOperator("%"), type: "function" },
    { label: "÷", action: () => onOperator("÷"), type: "operator" },

    { label: "7", action: () => onNumber("7"), type: "number" },
    { label: "8", action: () => onNumber("8"), type: "number" },
    { label: "9", action: () => onNumber("9"), type: "number" },
    { label: "×", action: () => onOperator("×"), type: "operator" },

    { label: "4", action: () => onNumber("4"), type: "number" },
    { label: "5", action: () => onNumber("5"), type: "number" },
    { label: "6", action: () => onNumber("6"), type: "number" },
    { label: "-", action: () => onOperator("-"), type: "operator" },

    { label: "1", action: () => onNumber("1"), type: "number" },
    { label: "2", action: () => onNumber("2"), type: "number" },
    { label: "3", action: () => onNumber("3"), type: "number" },
    { label: "+", action: () => onOperator("+"), type: "operator" },

    { label: "0", action: () => onNumber("0"), type: "number", wide: true },
    { label: ".", action: () => onNumber("."), type: "number" },
    { label: "=", action: onEquals, type: "operator" },
  ];

  const getButtonClass = (type) => {
    switch (type) {
      case "number":
        return "calc-btn calc-btn-number";
      case "operator":
        return "calc-btn calc-btn-operator";
      case "function":
        return "calc-btn calc-btn-function";
      case "scientific":
        return "calc-btn calc-btn-scientific";
      default:
        return "calc-btn calc-btn-number";
    }
  };

  return (
    <div className="space-y-3">
      {/* Scientific Buttons */}
      {showScientific && (
        <div className="grid grid-cols-6 gap-2 mb-3 animate-in slide-in-from-top duration-200">
          {scientificButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`${getButtonClass("scientific")} h-12`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Backspace Button */}
      <button
        onClick={onBackspace}
        className="w-full h-12 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-xl transition-colors"
      >
        <Delete size={20} />
        Backspace
      </button>
      {/* Main Keypad */}
      <div className="grid grid-cols-4 gap-3">
        {mainButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`${getButtonClass(
              btn.type
            )} h-16 sm:h-20 text-xl sm:text-2xl ${
              btn.wide ? "col-span-2" : ""
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Keypad;
