import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10 text-gray-800 font-sans">
      <div className="flex items-center gap-6 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} alt="Vite logo" className="w-16 h-16 hover:scale-110 transition-transform" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} alt="React logo" className="w-16 h-16 hover:scale-110 transition-transform" />
        </a>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-2">🚀 LaunchPad Scaffold</h1>
      <h2 className="text-xl text-gray-600 mb-8">Vite + React + Tailwind</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-700">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500 italic">Click the logos to learn more about the tools</p>
    </main>
  );
}

export default App;
