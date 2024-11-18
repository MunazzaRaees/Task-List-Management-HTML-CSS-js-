document.addEventListener("DOMContentLoaded", function() {
    const stickyNotesContainer = document.getElementById("stickyNotes");
    const addTaskModalBtn = document.getElementById("addTaskModalBtn");
    const taskModal = document.getElementById("taskModal");
    const closeModal = document.getElementById("closeModal");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescriptionInput = document.getElementById("taskDescription");
    const taskDeadlineInput = document.getElementById("taskDeadline");
    const celebrationMessage = document.getElementById("celebrationMessage");
    const overdueMessage = document.getElementById("overdueMessage");
    const upcomingTab = document.getElementById('upcoming');
    const todayTab = document.getElementById('today');
    const calendarTab = document.getElementById('calendar');
    const stickyWallTab = document.getElementById('stickyWall');
    
    const stickyWallContent = document.getElementById('stickyWallContent');
    const calendarContent = document.getElementById('calendarContent');

    // Hide all content sections by default
    function hideAllContent() {
        stickyWallContent.style.display = 'none';
        calendarContent.style.display = 'none';
    }

    // Add event listeners for menu items
    upcomingTab.addEventListener('click', function() {
        hideAllContent();
        // Show content for 'Upcoming' (if you have a section for it)
        console.log("Upcoming tasks clicked");
    });

    todayTab.addEventListener('click', function() {
        hideAllContent();
        // Show content for 'Today' (if you have a section for it)
        console.log("Today tasks clicked");
    });

    calendarTab.addEventListener('click', function() {
        hideAllContent();
        calendarContent.style.display = 'block';  // Show the calendar content
        console.log("Calendar clicked");
    });

    stickyWallTab.addEventListener('click', function() {
        hideAllContent();
        stickyWallContent.style.display = 'block';  // Show the sticky wall content
        console.log("Sticky Wall clicked");
    });

    let tasks = [];

    // Open task modal
    addTaskModalBtn.addEventListener("click", () => {
        taskModal.style.display = "flex";
        // Set minimum deadline to current date and time to prevent past time selection
        const now = new Date();
        taskDeadlineInput.min = now.toISOString().slice(0, 16);
    });

    // Close task modal
    closeModal.addEventListener("click", () => {
        taskModal.style.display = "none";
    });

    // Add task
   // Add task
   addTaskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();  // Trim to remove whitespace
    const description = taskDescriptionInput.value.trim();
    const deadline = taskDeadlineInput.value;

    const messageBox = document.getElementById("messageBox");

    if (!title || !deadline) {
        messageBox.textContent = "Please enter a task title and deadline!";
        messageBox.className = "error";
        messageBox.style.display = "block";
        return;
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (deadlineDate < now) {
        messageBox.textContent = "Please select a deadline in the future.";
        messageBox.className = "error";
        messageBox.style.display = "block";
        return;
    }

    addTask(title, description, deadlineDate);

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDeadlineInput.value = "";
    taskModal.style.display = "none";
    messageBox.style.display = "none"; // Hide the message box if the task is valid
});



    // Function to add a task
    function addTask(title, description, deadline) {
        const task = {
            title1,
            description,
            deadline,
            completed: false
        };
        tasks.push(task);
        displayTask(task);
    }

    // Function to display a task
    function displayTask(task) {
        const note = document.createElement("div");
        note.classList.add("note");

        note.innerHTML = `
            <input type="checkbox" onclick="completeTask('${task.title}')" />
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Deadline: ${task.deadline.toLocaleString()}</p>
            <button onclick="removeTask('${task.title}')">X</button>
        `;

        stickyNotesContainer.appendChild(note);
    }

    // Function to mark a task as completed
    window.completeTask = function(title) {
        const task = tasks.find(task => task.title === title);
        if (task) {
            task.completed = true;
            showCelebrationMessage();
        }
    };

    // Celebration message
    function showCelebrationMessage() {
        celebrationMessage.style.display = "block";
        setTimeout(() => {
            celebrationMessage.style.display = "none";
        }, 3000);
    }

    // Remove task
    window.removeTask = function(title) {
        tasks = tasks.filter(task => task.title !== title);
        renderTasks();
    };

    // Render all tasks
    function renderTasks() {
        stickyNotesContainer.innerHTML = "";
        tasks.forEach(task => {
            displayTask(task);
        });
    }

    // Check for overdue tasks and exact deadline matches every minute
    let overdueShown = false;  // Track if the overdue message has already been shown
    setInterval(() => {
        const now = new Date();
        tasks.forEach(task => {
            if (!task.completed && task.deadline <= now && !overdueShown) {
                overdueMessage.textContent = `⏰ Time is up! You haven't completed "${task.title}" yet.`;
                overdueMessage.style.display = "block";
                setTimeout(() => {
                    overdueMessage.style.display = "none";
                }, 3000);
                overdueShown = true;  // Mark it as shown
            }
        });
    }, 60000);
    

    let selectedTask = null;

// Open modal for updating a task
window.editTask = function (title) {
    selectedTask = tasks.find(task => task.title === title);

    if (selectedTask) {
        taskModal.style.display = "flex";
        document.getElementById("modalTitle").textContent = "Update Task";
        taskTitleInput.value = selectedTask.title;
        taskDescriptionInput.value = selectedTask.description;
        taskDeadlineInput.value = new Date(selectedTask.deadline).toISOString().slice(0, 16);
        addTaskBtn.style.display = "none";
        updateTaskBtn.style.display = "inline-block";
    }
};

// Update task details
updateTaskBtn.addEventListener("click", () => {
    const messageBox = document.getElementById("messageBox");

    if (selectedTask) {
        const updatedTitle = taskTitleInput.value;
        const updatedDescription = taskDescriptionInput.value;
        const updatedDeadline = taskDeadlineInput.value;

        if (updatedTitle && updatedDeadline) {
            const deadlineDate = new Date(updatedDeadline);
            const now = new Date();

            if (deadlineDate < now) {
                messageBox.textContent = "Please select a deadline in the future.";
                messageBox.className = "error";
                messageBox.style.display = "block";
                return;
            }

            selectedTask.title = updatedTitle;
            selectedTask.description = updatedDescription;
            selectedTask.deadline = deadlineDate;

            renderTasks();

            messageBox.textContent = "Task updated successfully!";
            messageBox.className = "success";
            messageBox.style.display = "block";

            resetModal();
        } else {
            messageBox.textContent = "Please enter a task title and deadline!";
            messageBox.className = "error";
            messageBox.style.display = "block";
        }
    }
});


// Show success message
function showUpdateSuccessMessage() {
    const updateSuccessMessage = document.getElementById("updateSuccessMessage");
    updateSuccessMessage.style.display = "block";
    setTimeout(() => {
        updateSuccessMessage.style.display = "none";
    }, 3000);
}

// Reset modal after updating
function resetModal() {
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDeadlineInput.value = "";
    taskModal.style.display = "none";
    document.getElementById("modalTitle").textContent = "New Task";
    addTaskBtn.style.display = "inline-block";
    updateTaskBtn.style.display = "none";
}

// Function to display a task with different colors
function displayTask(task) {
    const note = document.createElement("div");

    // Add the common 'pastel' class for shared styling
    note.classList.add("pastel");

    // Add a random pastel color class
    const colorClass = getRandomColorClass();  // This will get a random color class
    note.classList.add(colorClass);

    note.innerHTML = `
        <button onclick="removeTask('${task.title}')">X</button>
        <input type="checkbox" onclick="completeTask('${task.title}')" />
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Deadline: ${task.deadline.toLocaleString()}</p>
    `;

    stickyNotesContainer.appendChild(note);
}

// Function to pick a random color class from predefined pastel classes
function getRandomColorClass() {
    const colorClasses = [
        'pastel1', 'pastel2', 'pastel3', 'pastel4', 'pastel5', 'pastel6', 'pastel7'
    ];
    // Pick a random index from the colorClasses array
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}
});
