<svelte:head>
  <title>Lista de Deseos</title>
  <meta name="description" content="Lista de Deseos Arco Trailers" />
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, scale } from 'svelte/transition';
  import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const storage = getStorage(app);

  interface Todo {
    id?: string;
    task: string;
    assignee?: string;
    qty: number;
    done?: boolean;
    imageUrl?: string;
  }

  let newTodo: string = '';
  let assignee: string = '';
  let qty: number = 0;
  let todos: Todo[] = [];
  let editingIndex: number | null = null;
  let selectedFile: File | null = null;
  let loading = true;
  let isPopupVisible = false;
  let selectedImageUrl = '';

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        goto('/login');
      } else {
        loading = true;
        const todosCollection = collection(db, 'todos');
        const q = query(todosCollection);
        getDocs(q).then((querySnapshot) => {
          todos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            task: doc.data().task,
            assignee: doc.data().assignee,
            qty: doc.data().qty,
            done: doc.data().done,
            imageUrl: doc.data().imageUrl,
          }));
          loading = false;
        });
      }
    });
  });

  async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, 'images/' + file.name);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  if (file) {
    selectedFile = file;
  }
}



  async function addTodo() {
    let imageUrl = '';
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
      selectedFile = null;
    }

    const todoData = { task: newTodo.trim(), assignee: assignee.trim(), qty: qty, done: false, imageUrl };
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
    const     todo = todos[index];
    if (todo.id) {
      await updateDoc(doc(db, 'todos', todo.id), { done: !todo.done });
      todo.done = !todo.done;
      todos = [...todos];
    }
  }

  function showPopup(todo: Todo) {
  if (todo.imageUrl) {
    selectedImageUrl = todo.imageUrl;
    isPopupVisible = true;
  }
}


  function closePopup() {
    isPopupVisible = false;
  }
</script>

<div class="container mx-auto p-6">
  <div class="flex justify-center">
    <div class="bg-white p-8 rounded shadow-lg w-full md:w-1/2">
      <h1 class="text-2xl mb-4 text-center text-blue-700">Lista de Deseos Estufas El Arco</h1>
      <div class="mb-4">
        <!-- Input fields for new todo -->
        <input
          type="text"
          class="p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
          class="p-2 w-full mt-2 rounded border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Asignar a..."
          bind:value={assignee}
        />
        <input type="file" accept="image/*" on:change="{handleFileChange}" class="p-2 w-full mt-2" />
        <button
          class="p-2 w-full mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all ease-in-out duration-300"
          on:click={addTodo}
        >
          {editingIndex !== null ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
      {#if loading}
        <!-- Loader here -->
        <div class="flex justify-center items-center py-4">
          <div class="loader"></div>
        </div>
      {:else}
        <!-- Todo list -->
        <ul>
          {#each todos as todo, index (todo.id)}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    in:fly={{ y: 10, duration: 300 }}
    out:scale={{ duration: 300 }}
    class="flex items-center mb-4 p-6 bg-gray-100 rounded-lg shadow transition-all ease-in-out duration-300 hover:bg-gray-200"
    on:click={() => showPopup(todo)}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="qty-circle bg-blue-500 text-white rounded-full w-11 h-10 flex items-center justify-center" on:click={(event) => { toggleDone(index); event.stopPropagation(); }}>
      {#if todo.done}
        <span class="text-2xl">✓</span>
      {:else}
        {todo.qty}
      {/if}
    </div>
    <div class="flex flex-col w-full ml-4 justify-between">
      <div class="flex flex-row w-full justify-between">
        <span>{todo.task}</span>
        <div class="flex items-center">
          <span class="mr-2">👤</span>
          <span>{todo.assignee || 'Unassigned'}</span>
        </div>
      </div>
      <div>
        <button class="text-blue-500 hover:text-blue-700 mr-2" on:click={(event) => { editTodo(index); event.stopPropagation(); }}>Editar</button>
<button class="text-red-500 hover:text-red-700" on:click={(event) => { removeTodo(index); event.stopPropagation(); }}>Borrar</button>
      </div>
    </div>
  </li>
{/each}

        </ul>
      {/if}
    </div>
  </div>

  {#if isPopupVisible}
  <div class="popup">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={selectedImageUrl} alt="Todo Image" class="w-full h-auto" />
    <button on:click={closePopup}>Close</button>
  </div>
{/if}

</div>

<style>
  .loader {
    border: 4px solid #f3f3f3; /* Light gray border */
    border-top: 4px solid currentColor; /* Top border in the current color for the loading part */
    border-radius: 50%; /* Makes it a perfect circle */
    width: 40px; /* Width of the loader */
    height: 40px; /* Height of the loader */
    animation: spin 1s linear infinite; /* Keeps the spinning animation */
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
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  .qty-circle:hover {
    background-color: #3355FF;
  }

  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .popup img {
    max-width: 90%;
    max-height: 80vh;
    margin-bottom: 20px;
  }

  li {
  cursor: pointer;
}

</style>


