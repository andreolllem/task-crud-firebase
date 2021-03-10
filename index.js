const db = firebase.firestore();

const taskForm = document.querySelector("#task-form");
const taskContainer = document.getElementById("task-container");

let editStatus = false;
let id = "";

const saveTask = (title, description) =>
  db.collection("tasks").doc().set({
    title,
    description,
  });

const getTastks = () => db.collection("tasks").get();

const getTask = (id) => db.collection("tasks").doc(id).get();

const onGetTasks = (Callback) => db.collection("tasks").onSnapshot(Callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const updateTask = (id, updateTask) =>
  db.collection("tasks").doc(id).update(updateTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;

      taskContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
        <h5>${task.title}</h5>
        <p>${task.description}<p/>
        <div>
        <button class="btn btn-primary border-primary btn-edit" data-id="${task.id}">Editar</button>
        <button class="btn btn-danger border-primary btn-delete" data-id="${task.id}">Delete</button>   
        </div> 
        </div>
        `;
    });

    const btnsDelete = taskContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      });
    });

    const btnsEdit = document.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const doc = await getTask(e.target.dataset.id);
        const task = doc.data();

        editStatus = true;
        id = doc.id;

        taskForm["task-title"].value = task.title;
        taskForm["task-description"].value = task.description;
        taskForm["btn-task-form"].innerText = "Atualizar";
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];

  if (!editStatus) {
    await saveTask(title.value, description.value);
  } else {
    await updateTask(id, {
      title: title.value,
      description: description.value,
    });

    editStatus = status;
    id = "";
    taskForm["btn-task-form"].innerText = "Salvar";
  }

  taskForm.reset();
  title.focus();
});
