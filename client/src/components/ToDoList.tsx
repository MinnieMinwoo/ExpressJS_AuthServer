import React, { useEffect, useState } from "react";
import { Token } from "../Token";

interface ToDo {
  content: string;
  id: string;
}

function ToDoList({ accessToken }: { accessToken: Token }) {
  const [list, setList] = useState<ToDo[]>([]);
  useEffect(() => {
    if (accessToken.get()) getTodoList();
    // accessToken이 있을때 데이터 페칭 시도
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

  return (
    <ul>
      {list.map((todo) => {
        return <li key={todo.id}>{todo.content}</li>;
      })}
    </ul>
  );
}

export default ToDoList;
