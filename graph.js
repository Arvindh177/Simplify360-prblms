const readline = require('readline');

class FriendshipGraph {
    constructor() {
        this.graph = {};
    }
    addFriendship(person, friend) {
        if (!this.graph[person]){
            this.graph[person] = [];
        }
        if(!this.graph[friend]){
            this.graph[friend] = [];
        }
        this.graph[person].push(friend);
        this.graph[friend].push(person);
    }

    findFriends(person) {
        return this.graph[person] || [];
    }

    findCommonFriends(person1, person2) {
        const friends1 = new Set(this.findFriends(person1));
        const friends2 = new Set(this.findFriends(person2));
        const commonFriends = [...friends1].filter(friend => friends2.has(friend));
        return commonFriends;
    }

    findNthConnection(start, target){
        if(start === target) return 0;
        let queue = [[start,0]];
        let visited = new Set();
        visited.add(start);

        while(queue.length > 0){
            const [current, distance] = queue.shift();
            const friends = this.findFriends(current);

            for(let friend of friends) {
                if(friend == target) {
                    return distance+1;
                }
                if(!visited.has(friend)) {
                    visited.add(friend);
                    queue.push([friend,distance +1]);
                }
            }
        }
        return -1;
    }
}



const graph = new FriendshipGraph();

graph.addFriendship('Alice', 'Bob');
graph.addFriendship('Bob', 'Janice');
graph.addFriendship('Bob', 'Mani');
graph.addFriendship('Mani', 'Kumar');


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    r1.question('Enter command: ', (command)=> {
        const[action, ...args] = command.split(' ');

        switch(action) {
            case 'addFriendship':
                if(args.length === 2){
                    graph.addFriendship(args[0],args[1]);
                    console.log(`Added friendship between ${args[0]} and ${args[1]}`);
                } else {
                    console.log("Usage: addFriendship <person1> <person2>")
                }
                break;
            case 'findFriends':
                if(args.length === 1){
                    console.log(`Friends of ${args[0]}`,graph.findFriends(args[0]));
                } else {
                    console.log('Usage: findFriends <person>')
                }
                break;
            case 'findCommonFriends':
                if(args.length === 2) {
                    console.log(`Common friends of ${args[0]} and ${args[1]}:`
                        , graph.findCommonFriends(args[0], args[1]));
                } else {
                    console.log('Usage: findCommonFriends <person1> <person2>');
                }
                break;
            case 'findNthConnection':
                if(args.length === 2){
                    const distance = graph.findNthConnection(args[0],args[1]);
                    console.log(`Connection betweeen ${args[0]} and ${args[1]}`, distance);
                } else {
                    console.log('Usage: findNthConnection <start> <target>')
                }
                break;
            case 'exit':
                r1.close();
                return;
            default:
                console.log('Unknown command');
        }
        promptUser();
    });
}

console.log('Friendship Graph Console Application');
console.log('Commands:');
console.log('addFriendship <person1> <person2>');
console.log('findFriends <person>');
console.log('findCommonFriends <person1> <person2>');
console.log('findNthConnection <start> <target>');
console.log('exit');
promptUser();