import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem('todolist'));
    const savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));

    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todolist', JSON.stringify(allTodos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [allTodos, completedTodos]);

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      completed: false,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');

    setTimeout(() => {
      const items = document.querySelectorAll('.todo-list-item');
      if (items.length) {
        items[items.length - 1].classList.add('add-animation');
      }
    }, 100);
  };

  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    const item = reducedTodo[index];
    document.querySelectorAll('.todo-list-item')[index].classList.add('delete-animation');

    setTimeout(() => {
      reducedTodo.splice(index, 1);
      setTodos(reducedTodo);
    }, 500);
  };

  const handleComplete = index => {
    let now = new Date();
    let completedOn = now.toLocaleString();

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
      completed: true,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);

    const item = document.querySelectorAll('.todo-list-item')[index];
    item.classList.add('complete-animation');

    setTimeout(() => {
      handleDeleteTodo(index);
    }, 500);
  };

  const handleDeleteCompletedTodo = index => {
    let reducedCompletedTodo = [...completedTodos];
    reducedCompletedTodo.splice(index, 1);
    setCompletedTodos(reducedCompletedTodo);
  };

  const handleClearCompleted = () => {
    setCompletedTodos([]);
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = newTitle => {
    setCurrentEditedItem({ ...currentEditedItem, title: newTitle });
  };

  const handleUpdateDescription = newDescription => {
    setCurrentEditedItem({ ...currentEditedItem, description: newDescription });
  };

  const handleUpdatePriority = newPriority => {
    setCurrentEditedItem({ ...currentEditedItem, priority: newPriority });
  };

  const handleUpdateToDo = () => {
    const updatedTodos = allTodos.map((item, index) => {
      if (index === currentEdit) {
        return currentEditedItem;
      }
      return item;
    });
    setTodos(updatedTodos);
    setCurrentEdit(null);
    setCurrentEditedItem(null);
  };

  return (
    <div className="App">
<h1 className="todo-title">My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <label>Priority</label>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={e => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={e => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <select value={currentEditedItem.priority} onChange={e => handleUpdatePriority(e.target.value)}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button type="button" onClick={handleUpdateToDo} className="primaryBtn">
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className={`todo-list-item ${item.priority}`} key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p className="priority-label">{item.priority}</p>
                    </div>

                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
          {isCompleteScreen && completedTodos.length > 0 && (
            <button className="clearBtn" onClick={handleClearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
