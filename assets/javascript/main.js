$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

let btnAddTask = $(".btn-submit");
let btnAddChildTask = $(".btn-add-child-task");
let btnUpdateChildTask = $(".btn-update-child-task");
let btnCancelUpdate = $(".btn-cancel-update");
let formInput = $(".form-input");
let listTask = $(".list-tasks");

renderTasks(getTasksFromLocalStorage());

// Lắng nghe các sự kiện
btnAddTask.onclick = () => {
  if (!formInput.value) {
    alert("Vui lòng nhập thông tin task");
    return false;
  }

  let tasks = getTasksFromLocalStorage();
  let parentId = btnAddTask.getAttribute("id");
  let newTasks = []

  if (parentId !== null) {
    newTasks = [
      ...tasks.slice(0, parentId),
      {...tasks[parentId],
        content: formInput.value
      },
      ...tasks.slice(+parentId + 1)
    ]


    // Đoạn này tôi k hiểu tại sao lại như vậy??????
    // newTasks = [
    //   ...tasks,
    //   {...tasks[parentId],
    //     content: formInput.value
    //   }
    // ]

    btnAddTask.removeAttribute("id");
  } else {
    // tasks.push({ content: formInput.value, childTasks: [] })
    newTasks = tasks.concat({ content: formInput.value,completed: false, childTasks: [] })
  }
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  renderTasks(newTasks);
  resetUI();
};

btnCancelUpdate.onclick = () => {
  resetUI();
};

btnUpdateChildTask.onclick = () => {
  if (!formInput.value) {
    alert("Vui lòng nhập thông tin task");
    return false;
  }
  let tasks = getTasksFromLocalStorage();
  let id = btnUpdateChildTask.getAttribute("id");
  let [parentId, childId] = id.split(":");
  let newChildTasks =[
    ...tasks[parentId].childTasks.slice(0, childId),
    {...tasks[parentId].childTasks[childId],
    childContent: formInput.value},
    ...tasks[parentId].childTasks.slice(+childId + 1)
  ]
  let newTasks = [
    ...tasks.slice(0, parentId),
    {...tasks[parentId],
    childTasks: newChildTasks},
    ...tasks.slice(+parentId + 1)
  ]
  // tasks[arrayId[0]].childTasks[arrayId[1]] = { childContent: formInput.value };
  btnUpdateChildTask.removeAttribute("id");

  resetUI();
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  renderTasks(newTasks);
};

btnAddChildTask.onclick = () => {
  let tasks = getTasksFromLocalStorage();
  let parentId = btnAddChildTask.getAttribute("id");
  let newChildTasks = [
    ...tasks[parentId].childTasks.concat({ childContent: formInput.value, completed: false })
  ]
  let newTasks = [
    ...tasks.slice(0, parentId),
    {...tasks[parentId],
    childTasks: newChildTasks
    },
    ...tasks.slice(+parentId + 1),
  ]
  resetUI();
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  renderTasks(newTasks);
};

// Handle xử lý
function editTask(id) {
  resetUI();
  let tasks = getTasksFromLocalStorage();
  formInput.value = tasks[id].content;
  btnAddTask.innerHTML = "Sửa task";
  btnAddTask.classList.add("update");
  btnAddTask.setAttribute("id", id);
  btnCancelUpdate.classList.remove("disabled");
}

function deleteTask(taskId) {
  if (confirm("Bạn có muốn xóa không?")) {
    let tasks = getTasksFromLocalStorage();
    const newTask = tasks.filter(
      (_, index) => index !== taskId
    );
    console.log(newTask);
    localStorage.setItem("tasks", JSON.stringify(newTask));
    renderTasks(newTask);
  }
}

function addChildTask(id) {
  resetUI();
  btnAddTask.classList.add("disabled");
  btnAddChildTask.classList.remove("disabled");
  btnCancelUpdate.classList.remove("disabled");
  btnAddChildTask.setAttribute("id", id);
}

function editChildTask(id) {
  resetUI();
  let arrayId = id.split(":");
  let tasks = getTasksFromLocalStorage();
  formInput.value = tasks[arrayId[0]].childTasks[arrayId[1]].childContent;
  btnUpdateChildTask.setAttribute("id", id);
  btnAddTask.classList.add("disabled");
  btnUpdateChildTask.classList.remove("disabled");
  btnCancelUpdate.classList.remove("disabled");
}

function deleteChildTask(id) {
  if (confirm("Bạn có muốn xóa chứ?")) {
    let tasks = getTasksFromLocalStorage();
    // tasks[arrayId[0]].childTasks.splice(arrayId[1], 1);
    const [parentId, childId] = id.split(":");

    const newChildTasks = [
      ...tasks[parentId].childTasks.filter((_, index) => index !== +childId),
    ];
    console.log(tasks)
    const newTasks = [
      ...tasks.slice(0, parentId),
      { ...tasks[parentId], childTasks: newChildTasks },
      ...tasks.slice(+parentId + 1),
    ];
    console.log(newTasks)
    //deep clone object shallow clone array vs object

    localStorage.setItem("tasks", JSON.stringify(newTasks));
    renderTasks(newTasks);
  }
}

// function toggleTasks(parentId) {
//   let tasks = getTasksFromLocalStorage();
//   let newTasks = []

//   newTasks = [
//     ...tasks.slice(0, parentId),
//     {...tasks[parentId],
//       completed: !tasks[parentId].completed
//     },
//     ...tasks.slice(+parentId + 1)
//   ]
//   localStorage.setItem("tasks", JSON.stringify(newTasks));
//   renderTasks(newTasks)
// }

function toggleAllChildTasks(parentId) {
  let tasks = getTasksFromLocalStorage();
  let newTasks = []
  console.log(tasks[parentId].childTasks)
  // Đoạn này t k hiểu lắm tại sao k dùng đc arror function trong hàm map ông nhỉ
  let newChildTasks = [
    ...tasks[parentId].childTasks.map(function(childTask) {
       return {
        ...childTask,
        completed: !tasks[parentId].completed
       }
      })
  ]

  newTasks = [
    ...tasks.slice(0, parentId),
    {...tasks[parentId],
    childTasks: newChildTasks,
    completed: !tasks[parentId].completed
    },
    ...tasks.slice(parentId + 1)
  ]

  localStorage.setItem("tasks", JSON.stringify(newTasks));
  renderTasks(newTasks)
}

function toggleChildTasks(id) {
  let tasks = getTasksFromLocalStorage();
  let [parentId, childId] = id.split(':')
  let newChildTasks =[
    ...tasks[parentId].childTasks.slice(0, childId),
    {...tasks[parentId].childTasks[childId],
    completed: !tasks[parentId].childTasks[childId].completed},
    ...tasks[parentId].childTasks.slice(+childId + 1)
  ]
  let newTasks = [
    ...tasks.slice(0, parentId),
    {...tasks[parentId],
    childTasks: newChildTasks},
    ...tasks.slice(+parentId + 1)
  ]
  localStorage.setItem("tasks", JSON.stringify(newTasks));
  renderTasks(newTasks);
}

function resetUI() {
  formInput.value = "";
  btnAddTask.innerHTML = "Thêm task";
  btnAddTask.classList.remove("update");
  btnAddTask.classList.remove("disabled");
  btnCancelUpdate.classList.add("disabled");
  btnAddChildTask.classList.add("disabled");
  btnUpdateChildTask.classList.add("disabled");
}

function fixHtml([first,...strings], ...values) {
  return values.reduce(
    (acc, cur)  => acc.concat(cur, strings.shift()),
    [first]
  )
  .filter(x => x &&  x !== true || x === 0)
  .join('')

}

function renderTasks(tasks = []) {
  let htmls = "";
  tasks.forEach((task, index) => {
    htmls += fixHtml`
      <li class="task-item">
				<input 
          class="task-item__toggle" 
          type="checkbox" 
          ${task.completed && 'checked'}
          onchange="toggleAllChildTasks(${index})"
        >
        <div class="task-item__content ${task.completed && 'completed'}">${task.content}</div>
        <div class="task-item--control">
          <a href="#" class="btn task-item--update-child" onclick="addChildTask(${index})">Thêm task phụ</a>
          <a href="#" class="btn task-item--update" onclick="editTask(${index})">Sửa</a>
          <a href="#" class="btn task-item--delete" onclick="deleteTask(${index})">Xóa</a>
        </div>
      </li>`;
    if (task.childTasks.length != 0) {
      task.childTasks.forEach((childTask, childIndex) => {
        htmls += fixHtml`
        <ul class="list-child-task">
          <li class="task-item">
            <input 
              class="task-item__toggle" 
              type="checkbox" 
              ${childTask.completed && 'checked'}
              onchange="toggleChildTasks(\'${index}:${childIndex}\')"
            >
            <div class="task-item__content ${childTask.completed && 'completed'}">${childTask.childContent}</div>
            <div class="task-item--control">
              <a href="#" class="btn task-item--update" onclick="editChildTask(\'${index}:${childIndex}\')">Sửa</a>
              <a href="#" class="btn task-item--delete" onclick="deleteChildTask(\'${index}:${childIndex}\')">Xóa</a>
            </div>
          </li>
        </ul>`;
      });
    }
  });
  listTask.innerHTML = htmls;
}

function getTasksFromLocalStorage() {
  return localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
}