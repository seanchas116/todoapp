import { observer } from "mobx-react-lite";
import { appState } from "./AppState";

const App = observer(function App() {
  return (
    <div className="m-4">
      <h1 className="pb-4 text-xl font-bold">Todo App</h1>
      {appState.isAuthenticated ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => appState.logout()}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => appState.login()}
        >
          Sign In
        </button>
      )}
    </div>
  );
});

export default App;
