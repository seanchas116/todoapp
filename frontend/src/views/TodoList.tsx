import { observer } from "mobx-react-lite";
import { clsx } from "clsx";
import { appState } from "../state/AppState";
import { useState } from "react";

export const TodoList = observer(function TodoList() {
  const [newTitle, setNewTitle] = useState("");

  return (
    <main className="p-8">
      <div className="max-w-[640px] m-auto">
        <div className="flex gap-1 mb-4">
          <input
            className="flex-1 h-8 border border-gray-300 hover:border-gray-400 rounded px-1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            className="h-8 bg-blue-500 hover:bg-blue-700 rounded text-white px-3 py-1"
            onClick={() => {
              appState.todoStore.create(newTitle);
            }}
          >
            Add
          </button>
          <button
            className="h-8 bg-gray-500 hover:bg-gray-700 rounded text-white px-3 py-1"
            onClick={() => {
              appState.todoStore.clearCompleted();
            }}
          >
            Clear Completed
          </button>
        </div>

        <ul className="px-0.5">
          {appState.todoStore.todos.map((todo) => (
            <li
              className={clsx("text-xl flex items-center gap-2", {
                "line-through text-gray-400": todo.status === "done",
                "text-gray-900": todo.status === "pending",
              })}
            >
              <input
                type="checkbox"
                checked={todo.status === "done"}
                onClick={() => {
                  appState.todoStore.update({
                    ...todo,
                    status: todo.status === "done" ? "pending" : "done",
                  });
                }}
              />
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
});
