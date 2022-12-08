$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)

let btnAddTask = $('.btn-submit')
let btnAddChildTask = $('.btn-add-child-task')
let btnUpdateChildTask = $('.btn-update-child-task')
let btnCancelUpdate = $('.btn-cancel-update')
let formInput = $('.form-input')
let listTask = $('.list-tasks')

renderTasks(getTasksFromLocalStorage())

// Lắng nghe các sự kiện
btnAddTask.onclick = () => {
  if(!formInput.value) {
    alert('Vui lòng nhập thông tin task')
    return false
  }

  let tasks = getTasksFromLocalStorage()
  let taskId = btnAddTask.getAttribute('id')

  if (taskId === 0 || taskId) {
    tasks[taskId].content = formInput.value
    btnAddTask.removeAttribute('id')
  } else {
    tasks.push({content: formInput.value, childTasks: []})
  }

  resetUI()
  localStorage.setItem('tasks', JSON.stringify(tasks))
  renderTasks(tasks)
}

btnCancelUpdate.onclick = () => {
  resetUI()
}

btnUpdateChildTask.onclick = () => {
  if(!formInput.value) {
    alert('Vui lòng nhập thông tin task')
    return false
  }
  let tasks = getTasksFromLocalStorage()
  let id = btnUpdateChildTask.getAttribute('id')
  arrayId = id.split(':')
  tasks[arrayId[0]].childTasks[arrayId[1]] = ({childContent: formInput.value})
  btnUpdateChildTask.removeAttribute('id')

  resetUI()

  localStorage.setItem('tasks', JSON.stringify(tasks))
  renderTasks(tasks)
}

btnAddChildTask.onclick = () => {
  let tasks = getTasksFromLocalStorage()
  let taskId = btnAddChildTask.getAttribute('id')
  let task = tasks[taskId]
  task.childTasks.push({childContent: formInput.value})
  resetUI()
  localStorage.setItem('tasks', JSON.stringify(tasks))
  renderTasks(tasks)
}

// Handle xử lý
function editTask(id) {
  resetUI()
  let tasks = getTasksFromLocalStorage()
  formInput.value = tasks[id].content
  btnAddTask.innerHTML = 'Sửa task'
  btnAddTask.classList.add('update')
  btnAddTask.setAttribute('id', id)
  btnCancelUpdate.classList.remove('disabled')
}

function deleteTask(id) {
  if(confirm('Bạn có muốn xóa không?')) {
    let tasks = getTasksFromLocalStorage()
    tasks.splice(id, 1)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    renderTasks(tasks)
  }
}

function addChildTask(id) {
  resetUI()
  btnAddTask.classList.add('disabled')
  btnAddChildTask.classList.remove('disabled')
  btnCancelUpdate.classList.remove('disabled')
  btnAddChildTask.setAttribute('id', id)
}

function editChildTask(id) {
  resetUI()
  let arrayId = id.split(':')
  let tasks = getTasksFromLocalStorage()
  formInput.value = tasks[arrayId[0]].childTasks[arrayId[1]].childContent
  btnUpdateChildTask.setAttribute('id', id)
  btnAddTask.classList.add('disabled')
  btnUpdateChildTask.classList.remove('disabled')
  btnCancelUpdate.classList.remove('disabled')
}

function deleteChildTask(id) {
  if(confirm('Bạn có muốn xóa chứ?')) {
    let tasks = getTasksFromLocalStorage()
    let arrayId = id.split(':')
    tasks[arrayId[0]].childTasks.splice(arrayId[1], 1)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    renderTasks(tasks)
  }

}

function resetUI() {
  formInput.value = ''
  btnAddTask.innerHTML = 'Thêm task'
  btnAddTask.classList.remove('update')
  btnAddTask.classList.remove('disabled')
  btnCancelUpdate.classList.add('disabled')
  btnAddChildTask.classList.add('disabled')
  btnUpdateChildTask.classList.add('disabled')
}

function renderTasks(tasks = []) {
  let htmls = ''
  tasks.forEach((task, index) => {
    htmls += `
      <li class="task-item">
        <div class="task-item__content">${task.content}</div>
        <div class="task-item--control">
          <a href="#" class="btn task-item--update-child" onclick="addChildTask(${index})">Thêm task phụ</a>
          <a href="#" class="btn task-item--update" onclick="editTask(${index})">Sửa</a>
          <a href="#" class="btn task-item--delete" onclick="deleteTask(${index})">Xóa</a>
        </div>
      </li>`
    if (task.childTasks.length != 0) {
      task.childTasks.forEach((childTask, childIndex) => {
        htmls += `
        <ul class="list-child-task">
          <li class="task-item">
            <div class="task-item__content">${childTask.childContent}</div>
            <div class="task-item--control">
              <a href="#" class="btn task-item--update" onclick="editChildTask(\'${index}:${childIndex}\')">Sửa</a>
              <a href="#" class="btn task-item--delete" onclick="deleteChildTask(\'${index}:${childIndex}\')">Xóa</a>
            </div>
          </li>
        </ul>`
      })
    }
  })
  listTask.innerHTML = htmls
}

function getTasksFromLocalStorage() {
  return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []
}

