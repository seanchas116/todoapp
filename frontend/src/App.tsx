import { useAuth0 } from "@auth0/auth0-react";
function App() {
  const { loginWithPopup, isAuthenticated, logout } = useAuth0();

  return (
    <div className="m-4">
      <h1 className="pb-4 text-xl font-bold">Todo App</h1>
      {isAuthenticated ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => logout()}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => loginWithPopup()}
        >
          Sign In
        </button>
      )}
    </div>
  );
}

export default App;
