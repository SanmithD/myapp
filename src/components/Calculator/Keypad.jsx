import { Delete } from "lucide-react";

function Keypad({
  onNumber,
  onOperator,
  onFunction,
  onEquals,
  onClear,
  onBackspace,
  onPlusMinus,
  onMemory,
  showScientific,
  memory,
}) {
  const memoryButtons = [
    { label: "MC", action: () => onMemory("MC"), disabled: memory === 0 },
    { label: "MR", action: () => onMemory("MR"), disabled: memory === 0 },
    { label: "M+", action: () => onMemory("M+") },
    { label: "M-", action: () => onMemory("M-") },
    { label: "MS", action: () => onMemory("MS") },
  ];

  const scientificButtons = [
    { label: "sin", action: () => onFunction("sin") },
    { label: "cos", action: () => onFunction("cos") },
    { label: "tan", action: () => onFunction("tan") },
    { label: "log", action: () => onFunction("log") },
    { label: "ln", action: () => onFunction("ln") },
    { label: "ANS", action: () => onFunction("ANS") },
    { label: "sin⁻¹", action: () => onFunction("asin") },
    { label: "cos⁻¹", action: () => onFunction("acos") },
    { label: "tan⁻¹", action: () => onFunction("atan") },
    { label: "√", action: () => onFunction("√") },
    { label: "∛", action: () => onFunction("∛") },
    { label: "n!", action: () => onFunction("n!") },
    { label: "x²", action: () => onFunction("x²") },
    { label: "x³", action: () => onFunction("x³") },
    { label: "xⁿ", action: () => onFunction("xⁿ") },
    { label: "10ˣ", action: () => onFunction("10ˣ") },
    { label: "eˣ", action: () => onFunction("eˣ") },
    { label: "1/x", action: () => onFunction("1/x") },
    { label: "π", action: () => onFunction("π") },
    { label: "e", action: () => onFunction("e") },
    { label: "φ", action: () => onFunction("φ") },
    { label: "^", action: () => onOperator("^") },
    { label: "(", action: () => onFunction("(") },
    { label: ")", action: () => onFunction(")") },
    { label: "abs", action: () => onFunction("abs") },
    { label: "ceil", action: () => onFunction("ceil") },
    { label: "floor", action: () => onFunction("floor") },
    { label: "round", action: () => onFunction("round") },
    { label: "sinh", action: () => onFunction("sinh") },
    { label: "cosh", action: () => onFunction("cosh") },
  ];

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
    { label: "=", action: onEquals, type: "equals" },
  ];

  const getButtonClass = (type) => {
    switch (type) {
      case "number":
        return "calc-btn calc-btn-number";
      case "operator":
        return "calc-btn calc-btn-operator";
      case "equals":
        return "calc-btn bg-primary-600 hover:bg-primary-500 text-white";
      case "function":
        return "calc-btn calc-btn-function";
      case "scientific":
        return "calc-btn calc-btn-scientific";
      case "memory":
        return "calc-btn bg-dark-600 hover:bg-dark-500 text-dark-200 text-xs";
      default:
        return "calc-btn calc-btn-number";
    }
  };

  return (
    <div className="space-y-2">
      {/* Scientific Buttons */}
      {showScientific && (
        <div className="space-y-2 animate-in slide-in-from-top duration-200">
          {/* Memory Buttons */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {memoryButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                disabled={btn.disabled}
                className={`${getButtonClass("memory")} h-9 sm:h-10 ${
                  btn.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Scientific Functions — 5 columns on very narrow phones (<380px)
              so button labels stay legible, 6 columns from `sm:` up */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-1.5">
            {scientificButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`${getButtonClass("scientific")} h-9 sm:h-10 text-[11px] sm:text-xs`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backspace Button */}
      <button
        onClick={onBackspace}
        className="w-full h-9 sm:h-10 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-xl transition-colors"
      >
        <Delete size={18} />
        <span className="text-sm">Backspace</span>
      </button>

      {/* Main Keypad */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {mainButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`${getButtonClass(btn.type)} h-14 sm:h-14 md:h-12 text-lg sm:text-xl ${
              btn.wide ? "col-span-2" : ""
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-dark-500 mt-2 hidden sm:block">
        💡 You can use your keyboard to type calculations
      </p>
    </div>
  );
}

export default Keypad;