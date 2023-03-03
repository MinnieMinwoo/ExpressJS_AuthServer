import React, { useEffect } from "react";
import { Token } from "../Token";
import "./ToDoList.css";

interface ToDo {
  content: string;
  id: string;
}

interface Props {
  accessToken: Token;
  list: ToDo[];
  setList: React.Dispatch<React.SetStateAction<ToDo[]>>;
}

function ToDoList({ accessToken, list, setList }: Props) {
  useEffect(() => {
    if (accessToken.get()) getTodoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const getTodoList = async () => {
    const url = "./api/todo";
    const request = new Request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.get()}`,
      },
    });
    try {
      const { todoList } = await (await fetch(request)).json();
      const filteredList = todoList as ToDo[];
      setList(filteredList);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    const url = "./api/todo";
    const request = new Request(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.get()}`,
      },
      body: JSON.stringify({
        todoID: id,
      }),
    });
    try {
      await (await fetch(request)).json();
      const filteredList = list.filter((element) => {
        return element.id !== id;
      });
      setList(filteredList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul className="ToDoList">
      {list.map((todo) => {
        return (
          <div key={todo.id}>
            <li>{todo.content}</li>
            <button onClick={() => onDelete(todo.id)}>X</button>
          </div>
        );
      })}
    </ul>
  );
}

export default ToDoList;
