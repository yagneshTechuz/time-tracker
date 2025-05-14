let tasks = [];
let activeTaskId = null;
let timerInterval = null;

document.getElementById("createTask").addEventListener("click", () => {
  const name = document.getElementById("taskName").value;
  if (!name) return;

  const task = { id: Date.now(), name, time: 0 };
  tasks.push(task);
  renderTasks();
});

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.name} - ${formatTime(task.time)}
      <button onclick="startTimer(${task.id})">Start</button>
      <button onclick="stopTimer(${task.id})">Stop</button>
    `;
    list.appendChild(li);
  });
}

function renderScreenshots(screenshots) {
  const list = document.getElementById("shotsList");
  list.innerHTML = "";
  screenshots.forEach((shot) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img 
        src="${shot}" 
        alt="Screenshot" 
        style="width: 100px; height: auto; cursor: pointer;" 
        onclick="window.electronAPI.openImageViewer('${shot}')"
      >
    `;
    list.appendChild(li);
  });
}

window.electronAPI.getScreenshots().then((files) => {
  renderScreenshots(files);
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function startTimer(taskId) {
  // Stop any previous timer
  stopTimer();

  activeTaskId = taskId;

  timerInterval = setInterval(() => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.time += 1;
      renderTasks();
      window.electronAPI.getScreenshots().then((files) => {
        renderScreenshots(files);
      });
    }
  }, 1000);

  // Tell main process to start taking screenshots
  window.electronAPI.startScreenshots(taskId);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  if (activeTaskId !== null) {
    window.electronAPI.stopScreenshots();
    activeTaskId = null;
  }
}
