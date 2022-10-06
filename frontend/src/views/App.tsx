import { observer } from "mobx-react-lite";
import { appState } from "../state/AppState";
import { TodoList } from "./TodoList";

const App = observer(function App() {
  return (
    <div className="">
      <header className="p-4 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-bold">Todo App</h1>
        {appState.currentUserStore.isAuthenticated ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            onClick={() => appState.currentUserStore.logout()}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            onClick={() => appState.currentUserStore.login()}
          >
            Sign In
          </button>
        )}
      </header>
      <TodoList />
    </div>
  );
});

export default App;
