(function () {
    var tasks, newTaskField, taskListForm, taskListEl, warningEl, warn, clearWarning, addForm, removeTask, setPriority,
        toggleComplete, addTask, renderTaskList, sortByNameAnchor, sortByLowHighAnchor, sortByHighLowAnchor, columnNames,
        HIGHPRIORITY, NORMALPRIORITY, LOWPRIORITY;

    // DOM elements
    sortByLowHighAnchor = document.getElementById("sortByLowHigh");
    sortByHighLowAnchor = document.getElementById("sortByHighLow");
    sortByNameAnchor = document.getElementById("sortByName");
    taskListForm = document.getElementById("tasks");
    taskListEl = taskListForm.getElementsByTagName("ul")[0];
    warningEl = document.getElementById("warning");
    newTaskField = document.getElementById("newTask");
    addForm = document.getElementById("add");
    columnNames =  [ "To Do", "Done" ];
    HIGHPRIORITY = '1';
    NORMALPRIORITY = '2';
    LOWPRIORITY = '3';
    tasks = [];
    
    renderTaskList = function () {
        var i, task, taskEl;

        clearList();
        for (i = 0; i < tasks.length; i += 1) {
            task = tasks[i];
            taskEl = newRow(i, task);
            taskListEl.appendChild(taskEl);
        }

        renderChart(tasks);
    };

    warn = function (msg) {
        warningEl.innerHTML = msg;
    };

    clearWarning = function () {
        warningEl.innerHTML = "";
    };

    addTask = function (task) {
        tasks.push({
            text: task,
            complete: false,
            priority: NORMALPRIORITY
        });
        renderTaskList();
        return task;
    };

    removeTask = function (idx) {
        tasks.splice(idx, 1);
        renderTaskList();
    };

    setPriority = function(idx, value) {
        tasks[idx].priority = value;
        renderTaskList();
    };


    toggleComplete = function (idx) {
        var val = tasks[idx].complete;
        tasks[idx].complete = !val;
        renderTaskList();
    };

    // Event handlers
    addForm.onsubmit = function (e) {
        var val;

        preventDefault(e);

        val = newTaskField.value;

        if (val === "") {
            warn("Please enter a task");
        } else {
            newTaskField.value = "";
            clearWarning();
            addTask(val);
        }
    };

    var sortByLowHigh = function(tasks) {
        return tasks.sort(function(task1, task2) { return task2.priority - task1.priority; });
        
    }

    var sortByHighLow = function(tasks) {
        return tasks.sort(function(task1, task2) { return task1.priority - task2.priority; });
        
    }

    var sortByName = function(tasks) {
        return tasks.sort(function(task1, task2) { return task1.text > task2.text; });
        
    }
    sortByLowHighAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByLowHigh(tasks);
        renderTaskList();
    };

    sortByHighLowAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByHighLow(tasks);
        renderTaskList();
    };

    // Sort tasks by name
    sortByNameAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByName(tasks);
        renderTaskList();
    };


    taskListForm.onclick = function (e) {
        var target, idx, targetClass;
        preventDefault(e);
        target = getTarget(e);
        idx = getIndex(target);

        if (idx) {
            idx = Number(idx);
            targetClass = target.getAttribute('class');
            if (targetClass === 'highpriority' || targetClass === 'lowpriority' || targetClass === 'normalpriority') {
                setPriority(idx, target.getAttribute("value"));
            }  else if (target.className.match("delete-task")) {
                removeTask(idx);
            } else if (target.type === "checkbox") {
                toggleComplete(idx);
            }
        }
    };

    // Utility functions
    /**
     * Clones the template row from the HTML
     * @return {Node}
     */
    function newRow(index, task) {
        var template, newRow, textEl;
        template = document.getElementsByClassName("template-item")[0];
        newRow = template.cloneNode(true);
        newRow.setAttribute("data-idx", index.toString());

        // get task text el
        textEl = newRow.getElementsByClassName("task-text")[0];

        // set task priority
        if (task.priority == HIGHPRIORITY) {
            textEl.className += " label-important";
        } else if (task.priority == LOWPRIORITY) {
            textEl.className += " label-success";
        }

        // set task text
        textEl.appendChild(document.createTextNode(task.text));

        // mark complete
        if (task.complete) {
            newRow.getElementsByTagName("input")[0].setAttribute("checked", "checked");
            newRow.getElementsByTagName("span")[0].className += " complete";
        }
        newRow.className = "task";

        return newRow;
    }

    function getIndex(el) {
        while (!el.getAttribute("data-idx")) {
            el = el.parentNode;
        }
        return el.getAttribute("data-idx");
    }

    function clearList() {
        while (taskListEl.hasChildNodes()) {
            taskListEl.removeChild(taskListEl.lastChild);
        }
    }

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    function getTarget(e) {
        return e.srcElement || e.target;
    }

    function countComplete(tasks) {
        return tasks.filter(function(task) {return task.complete}).length;
    }

    function renderChart(tasks) {
        var done = countComplete(tasks);
        var todo = tasks.length - done;
        
        document.getElementById("numToDo").innerHTML = todo;
        document.getElementById("numDone").innerHTML = done;    
    }

}());
