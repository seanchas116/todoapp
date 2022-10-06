import { observer } from "mobx-react-lite";
import { appState } from "./AppState";

const App = observer(function App() {
  return (
    <div className="">
      <header className="p-4 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-bold">Todo App</h1>
        {appState.isAuthenticated ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            onClick={() => appState.logout()}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            onClick={() => appState.login()}
          >
            Sign In
          </button>
        )}
      </header>
      <main className="p-8">
        <div className="w-80 m-auto">
          <div className="flex gap-1 mb-4">
            <input className="flex-1 h-8 border border-gray-300 rounded" />
            <button className="h-8 bg-blue-500 rounded text-white px-3 py-1">
              Add
            </button>
          </div>
          <ul>
            <li className="text-xl flex items-center gap-2 text-gray-900">
              <input type="checkbox" />
              Todo 1
            </li>
            <li className="text-xl flex items-center gap-2 text-gray-900">
              <input type="checkbox" />
              Todo 2
            </li>
            <li className="text-xl flex items-center gap-2 line-through text-gray-300">
              <input type="checkbox" checked />
              Todo 3
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
});

export default App;
