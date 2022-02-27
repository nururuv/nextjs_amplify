import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { withAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createTodo, updateTodo } from "src/graphql/mutations";
import { listTodos } from "src/graphql/queries";
import {
  Todo,
  ListTodosQuery,
  UpdateTodoInput,
  ListTodosQueryVariables,
  ModelTodoFilterInput,
} from "src/API";

import awsconfig from "src/aws-exports";
Amplify.configure(awsconfig);

function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mail, setMail] = useState("");

  const initialState = {
    name: "",
    description: "",
    isDone: false,
    user: "",
  };

  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key: string, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  console.log(mail);

  async function getMail() {
    try {
      const userInfo = Auth.currentUserInfo().then((user) =>
        setMail(user.attributes.email)
      );
    } catch (err) {
      console.log("error getUserInfo", err);
    }
  }

  async function fetchTodos() {
    try {
      getMail();
      const listTodosQueryVariables: ModelTodoFilterInput = {
        user: { eq: mail },
      };
      const todoData = await API.graphql(
        graphqlOperation(listTodos, { filter: listTodosQueryVariables })
      );
      if ("data" in todoData && todoData.data) {
        const todos = todoData.data as ListTodosQuery;
        if (todos.listTodos) {
          setTodos(todos.listTodos.items as Todo[]);
        }
      }
    } catch (err) {
      console.log("error fetching todos", err);
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      getMail();
      todo.user = mail;
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      fetchTodos();
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  async function changeTodo(id: string, checked: boolean) {
    try {
      const newTodo: UpdateTodoInput = {
        id: id,
        isDone: checked,
      };

      await API.graphql(graphqlOperation(updateTodo, { input: newTodo }));
      fetchTodos();
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  return (
    <Layout title="TODOメモ">
      <h2 className="text-3xl mt-2">Amplify Todos</h2>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-2 mt-2"
        type="text"
        onChange={(event) => setInput("name", event.target.value)}
        value={formState.name}
        placeholder="TODO Title"
      />
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/3 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-2 mt-2"
        onChange={(event) => setInput("description", event.target.value)}
        value={formState.description}
        placeholder="Description"
      />
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={addTodo}
      >
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div
          key={todo.id ? todo.id : index}
          className={
            todo.isDone ? "line-through text-gray-400 mt-2 my-2" : "mt-2 my-2"
          }
        >
          <label className="text-2xl cursor-pointer flex align-middle  items-center">
            <input
              className="mx-2"
              type="checkbox"
              checked={todo.isDone}
              value={todo.id}
              onChange={(event) =>
                changeTodo(event.target.value, event.target.checked)
              }
              id="todo_isDone"
            />
            <p className="mx-2 w-1/4">{todo.name}</p>
            <p className="text-2xl mx-2 w-1/2">{todo.description}</p>
          </label>
        </div>
      ))}
    </Layout>
  );
}

export default withAuthenticator(Home);
