<svelte:head>
	<title>Lista de Deseos</title>
	<meta name="description" content="Lista de Deseos Arco Trailers" />
</svelte:head>

<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    
    import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  // your config here
  apiKey: "AIzaSyBzM5OnMUdBrGWBcZotDxlRh0qEnwLvtNk",
    authDomain: "arco-trailers.firebaseapp.com",
    projectId: "arco-trailers",
    storageBucket: "arco-trailers.appspot.com",
    messagingSenderId: "557877308737",
    appId: "1:557877308737:web:1aaaed23f6537f4ca585c0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

    
  
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

    let loading = true;
  
    // Fetch todos on mount
    onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        goto('/login');
      } else {
        loading = true; // Set loading to true before fetching
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
          loading = false; // Set loading to false after fetching
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
        <h1 class="text-2xl mb-4 text-center text-blue-700">Lista de Deseos Estufas El Arco</h1>
        <div class="mb-4">
          <input
            type="text"
            class="p-2 w-full rounded border border-gray-300 {editingIndex !== null ? 'border-blue-500' : ''} focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Agregar nuevo Deseo"
            bind:value={newTodo}
            on:keydown={(e) => e.key === 'Enter' && addTodo()}
          />
          <input
            type="number"
            class="p-2 w-full mt-2 rounded border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Cantidad"
            bind:value={qty}
          />
          <input
            type="text"
            class="p-2 w-full mt-2 rounded border border-gray-300 {editingIndex !== null ? 'border-blue-500' : ''} focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Asignar a..."
            bind:value={assignee}
          />
          <button
            class="p-2 w-full mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all ease-in-out duration-300"
            on:click={addTodo}
          >
            {editingIndex !== null ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
        {#if loading} <!-- Show loading indicator when loading -->
        <div class="text-center py-4">
          <div class="loader"></div>
          <div class="flex justify-center items-center">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A9.004 9.004 0 014 12H0c0 5.52 4.477 10 10 10v-4a6 6 0 01-4-1.709z"></path>
            </svg>
          </div>
          
        </div>
      {:else}
        <!-- Existing form and list code here -->
        
        <ul>
            {#each todos as todo, index (todo.task)}
            <li
  in:fly={{ y: 10, duration: 300 }}
  out:scale={{ duration: 300 }}
  class="flex items-center mb-4 p-6 bg-gray-100 rounded-lg shadow transition-all ease-in-out duration-300 hover:bg-gray-200"

>
    <!-- Quantity or Checkmark Circle -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                    <button class="text-blue-500 hover:text-blue-700 mr-2" on:click={() => editTodo(index)}>Editar</button>
                    <button class="text-red-500 hover:text-red-700" on:click={() => removeTodo(index)}>Borrar</button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
      
    

      {/if}
      
      </div>
    </div>
  </div>
  
  <style>
    .loader {
    border-color: #f3f3f3;
    border-top-color: currentColor;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
    .qty-circle {
      cursor: pointer; /* Change cursor to pointer on hover */
      transition: background-color 0.3s ease-in-out; /* Add transition for smooth color change */
    }
  
    .qty-circle:hover {
      background-color: #3355FF; /* Darker blue color on hover */
    }
  </style>