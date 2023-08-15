<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { db } from '../../firebase';
  
    interface Todo {
      id?: string;
      task: string;
      assignee?: string;
      qty: number;
      done?: boolean;
    }
  
    let newTodo: string = '';
    let assignee: string = '';
    let qty: number = 0;
    let todos: Todo[] = [];
    let editingIndex: number | null = null;
  
    // Fetch todos on mount
    onMount(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          goto('/login');
        } else {
          const todosCollection = collection(db, 'todos');
          const q = query(todosCollection);
          getDocs(q).then((querySnapshot) => {
            todos = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              task: doc.data().task,
              assignee: doc.data().assignee,
              qty: doc.data().qty,
              done: doc.data().done,
            }));
          });
        }
      });
    });
  
    async function addTodo() {
      if (newTodo.trim() !== '') {
        const todoData = { task: newTodo.trim(), assignee: assignee.trim(), qty: qty, done: false };
        let todo: Todo;
        if (editingIndex !== null) {
          const docId = todos[editingIndex].id;
          if (docId) {
            await updateDoc(doc(db, 'todos', docId), todoData);
            todo = { id: docId, ...todoData };
            todos[editingIndex] = todo;
          }
        } else {
          const docRef = await addDoc(collection(db, 'todos'), todoData);
          todo = { id: docRef.id, ...todoData };
          todos = [...todos, todo];
        }
        newTodo = '';
        assignee = '';
        qty = 0;
        editingIndex = null;
      }
    }
  
    async function removeTodo(index: number) {
      const docId = todos[index].id;
      if (typeof docId === 'string') {
        await deleteDoc(doc(db, 'todos', docId));
        todos = [...todos.slice(0, index), ...todos.slice(index + 1)];
      }
    }
  
    function editTodo(index: number) {
      editingIndex = index;
      newTodo = todos[index].task;
      assignee = todos[index].assignee || '';
      qty = todos[index].qty;
    }
  
    async function toggleDone(index: number) {
      const todo = todos[index];
      if (todo.id) {
        await updateDoc(doc(db, 'todos', todo.id), { done: !todo.done });
        todo.done = !todo.done;
        todos = [...todos];
      }
    }
  </script>
  
  <div class="container mx-auto p-6">
    <!-- Input Form -->
    <div class="flex justify-center">
      <div class="bg-white p-8 rounded shadow-lg w-full md:w-1/2">
        <h1 class="text-2xl mb-4 text-center text-blue-700">To-Do List Arco</h1>
        <div class="mb-4">
          <input
            type="text"
            class="p-2 w-full rounded border border-gray-300 {editingIndex !== null ? 'border-blue-500' : ''} focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Add a new task..."
            bind:value={newTodo}
            on:keydown={(e) => e.key === 'Enter' && addTodo()}
          />
          <input
            type="number"
            class="p-2 w-full mt-2 rounded border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Quantity..."
            bind:value={qty}
          />
          <input
            type="text"
            class="p-2 w-full mt-2 rounded border border-gray-300 {editingIndex !== null ? 'border-blue-500' : ''} focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Assign to..."
            bind:value={assignee}
          />
          <button
            class="p-2 w-full mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all ease-in-out duration-300"
            on:click={addTodo}
          >
            {editingIndex !== null ? 'Update Task' : 'Add Task'}
          </button>
        </div>
        <ul>
            {#each todos as todo, index (todo.task)}
            <li
  in:fly={{ y: 10, duration: 300 }}
  out:scale={{ duration: 300 }}
  class="flex items-center mb-4 p-6 bg-gray-100 rounded-lg shadow transition-all ease-in-out duration-300 hover:bg-gray-200"

>
    <!-- Quantity or Checkmark Circle -->
    <div class="qty-circle bg-blue-500 text-white rounded-full w-11 h-10 flex items-center justify-center" on:click={() => toggleDone(index)}>
        {#if todo.done}
            <span class="text-2xl transition-all ease-in-out duration-300">✓</span>
        {:else}
            {todo.qty}
        {/if}
      </div>
      
      <div class="flex flex-col w-full ml-4 justify-between">
        <div class="flex flex-row w-full justify-between">
                    <span>{todo.task}</span>
                    <div class="flex items-center">
                      <span class="mr-2">👤</span> <!-- Person icon -->
                      <span>{todo.assignee || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <button class="text-blue-500 hover:text-blue-700 mr-2" on:click={() => editTodo(index)}>Edit</button>
                    <button class="text-red-500 hover:text-red-700" on:click={() => removeTodo(index)}>Remove</button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
      </div>
    </div>
  </div>
  
  <style>
    .qty-circle {
      cursor: pointer; /* Change cursor to pointer on hover */
      transition: background-color 0.3s ease-in-out; /* Add transition for smooth color change */
    }
  
    .qty-circle:hover {
      background-color: #3355FF; /* Darker blue color on hover */
    }
  </style>