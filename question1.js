const readline = require('readline');

class Task {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        this.dependencies = [];
        this.dependents = [];
        this.EST = 0;
        this.EFT = 0;
        this.LST = Infinity;
        this.LFT = Infinity;
    }

    addDependency(task) {
        this.dependencies.push(task);
        task.dependents.push(this);
    }
}

class Workflow {
    constructor() {
        this.tasks = {};
    }

    addTask(name, duration) {
        if (!this.tasks[name]) {
            this.tasks[name] = new Task(name, duration);
        }
    }

    addDependency(task, dependency) {
        if (this.tasks[task] && this.tasks[dependency]) {
            this.tasks[task].addDependency(this.tasks[dependency]);
        }
    }

    topologicalSort() {
        const sorted = [];
        const visited = new Set();

        const visit = (task) => {
            if (visited.has(task)) return;
            visited.add(task);
            task.dependencies.forEach(visit);
            sorted.push(task);
        };

        Object.values(this.tasks).forEach(visit);
        return sorted.reverse();
    }

    calculateTimes() {
        const sortedTasks = this.topologicalSort();
        this.calculateESTandEFT(sortedTasks);
        this.calculateLSTandLFT(sortedTasks);
    }

    calculateESTandEFT(sortedTasks) {
        sortedTasks.forEach(task => {
            task.EFT = task.EST + task.duration;
            task.dependents.forEach(dependent => {
                dependent.EST = Math.max(dependent.EST, task.EFT);
            });
        });
    }

    calculateLSTandLFT(sortedTasks) {
        const maxEFT = Math.max(...Object.values(this.tasks).map(task => task.EFT));
        sortedTasks.forEach(task => {
            if (task.dependents.length === 0) {
                task.LFT = maxEFT;
            }
        });
        sortedTasks.reverse().forEach(task => {
            task.LST = task.LFT - task.duration;
            task.dependencies.forEach(dependency => {
                dependency.LFT = Math.min(dependency.LFT, task.LST);
            });
        });
    }

    getEarliestCompletionTime() {
        return Math.max(...Object.values(this.tasks).map(task => task.EFT));
    }

    getLatestCompletionTime() {
        return Math.max(...Object.values(this.tasks).map(task => task.LFT));
    }
}

const workflow = new Workflow();

// Add preempted entries
workflow.addTask('T_START', 0);  // Starting task
workflow.addTask('Task1', 5);    // Task with duration 5 days
workflow.addTask('Task2', 3);    // Task with duration 3 days
workflow.addTask('Task3', 2);    // Task with duration 2 days
workflow.addTask('Task4', 4);    // Task with duration 4 days
workflow.addTask('Task5', 6);    // Task with duration 6 days

// Define dependencies
workflow.addDependency('Task1', 'T_START');
workflow.addDependency('Task2', 'T_START');
workflow.addDependency('Task3', 'Task1');
workflow.addDependency('Task4', 'Task1');
workflow.addDependency('Task5', 'Task2');
workflow.addDependency('Task5', 'Task3');

// Calculate times and print initial results
workflow.calculateTimes();

console.log('Preempted Entries Added');
console.log('Earliest completion time:', workflow.getEarliestCompletionTime());
console.log('Latest completion time:', workflow.getLatestCompletionTime());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question('Enter command: ', (command) => {
        const [action, ...args] = command.split(' ');

        switch (action) {
            case 'addTask':
                if (args.length === 2) {
                    workflow.addTask(args[0], parseInt(args[1]));
                    console.log(`Added task ${args[0]} with duration ${args[1]}`);
                } else {
                    console.log('Usage: addTask <task_name> <duration>');
                }
                break;
            case 'addDependency':
                if (args.length === 2) {
                    workflow.addDependency(args[0], args[1]);
                    console.log(`Added dependency from ${args[1]} to ${args[0]}`);
                } else {
                    console.log('Usage: addDependency <task_name> <dependency_name>');
                }
                break;
            case 'calculate':
                workflow.calculateTimes();
                console.log('Calculated times for all tasks.');
                break;
            case 'earliestCompletionTime':
                console.log(`Earliest completion time: ${workflow.getEarliestCompletionTime()}`);
                break;
            case 'latestCompletionTime':
                console.log(`Latest completion time: ${workflow.getLatestCompletionTime()}`);
                break;
            case 'exit':
                rl.close();
                return;
            default:
                console.log('Unknown command');
        }
        promptUser();
    });
}

console.log('Workflow Scheduling Console Application');
console.log('Commands:');
console.log('addTask <task_name> <duration>');
console.log('addDependency <task_name> <dependency_name>');
console.log('calculate');
console.log('earliestCompletionTime');
console.log('latestCompletionTime');
console.log('exit');
promptUser();
