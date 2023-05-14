import React from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = React.useState([]);
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    fetch("https://61498bf2035b3600175ba32f.mockapi.io/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = (title, description) => {
    if (!title || !description) {
      alert("Заповніть всі поля");
      return;
    }
    const newTodo = { title, description, completed: false };
    fetch("https://61498bf2035b3600175ba32f.mockapi.io/todo", {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setTodos([...todos, data]));
    document.querySelector('input[placeholder="Todo title"]').value = "";
    document.querySelector('input[placeholder="Description"]').value = "";
  };

  const deleteTodo = (id, index) => {
    fetch(`https://61498bf2035b3600175ba32f.mockapi.io/todo/${id}`, {
      method: "DELETE",
    }).then(() => {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    });
  };

  const editTodo = (id) => {
    const newTitle = prompt("Enter new title");
    const newDescription = prompt("Enter new description");
    if (newTitle && newDescription) {
      const newTodo = { title: newTitle, description: newDescription };
      fetch(`https://61498bf2035b3600175ba32f.mockapi.io/todo/${id}`, {
        method: "PUT",
        body: JSON.stringify(newTodo),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          const newTodos = [...todos];
          const index = newTodos.findIndex((todo) => todo.id === id);
          newTodos[index] = data;
          setTodos(newTodos);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input placeholder="Todo title" type="text" />
        <input placeholder="Description" type="text" />
        <button
          className="todoBtn"
          type="submit"
          onClick={() =>
            addTodo(
              document.querySelector('input[placeholder="Todo title"]').value,
              document.querySelector('input[placeholder="Description"]').value
            )
          }
        >
          Create Todo
        </button>
      </header>

      <main>
        <div className="actions">
          <button
            style={{ backgroundColor: "blue" }}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            style={{ backgroundColor: "green" }}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Check</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos
              .filter((todo) => {
                if (filter === "pending") {
                  return !todo.completed;
                } else if (filter === "completed") {
                  return todo.completed;
                } else {
                  return true;
                }
              })
              .map((todo, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        const newTodos = [...todos];
                        newTodos[index].completed = !newTodos[index].completed;
                        setTodos(newTodos);
                      }}
                    />
                  </td>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: todo.completed ? "green" : "red",
                      }}
                      onClick={() => {
                        const newTodos = [...todos];
                        newTodos[index].completed = !newTodos[index].completed;
                        setTodos(newTodos);
                      }}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ backgroundColor: "blue" }}
                      onClick={() => editTodo(todo.id, index)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ backgroundColor: "red" }}
                      onClick={() => deleteTodo(todo.id, index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
