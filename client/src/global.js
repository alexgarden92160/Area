import axios from 'axios';

class Service {
    constructor(name) {
        this.name = name;
        this.actionsNames = [];
        this.reactionsNames = [];

        this.isActive = false;
    };

    addAction(a) {
        this.actionsNames.push(a);
    }

    addReaction(r) {
        this.reactionsNames.push(r);
    }

    setActive(state) {
        this.isActive = state;
    }
}

class Reaction {
    constructor(name) {
        this.name = name;
        this.parameters = [];
    }


    addParameter(p) {
        this.parameters.push(p);
    }
}

class Action {
    constructor(name) {
        this.name = name;
        this.parameters = [];
        this.reactionsNames = [];
    }

    addParameter(p) {
        this.parameters.push(p);
    }

    addReaction(r) {
        this.reactionsNames.push(r);
    }
}

class Parameter {
    constructor(name, type, values = []) {
        this.name = name;
        this.type = type;
        this.values = values;
    }
}

class Global {
    static services = [];
    static actions = [];
    static reactions = [];

    static loadData() {
        this.services = []
        axios.get("http://onearea.online:3000/about.json").then((value) => {
            for (var s in value.data["services"]) {
                var newService = new Service(value.data["services"][s]["name"]);
                for (var a in value.data["services"][s]["actions"]) {
                    var newAction = new Action(value.data["services"][s]["actions"][a]["name"]);
                    for (var p in value.data["services"][s]["actions"][a]["parameters"]) {
                        newAction.addParameter(new Parameter(value.data["services"][s]["actions"][a]["parameters"][p]["name"],
                            value.data["services"][s]["actions"][a]["parameters"][p]["type"]));
                    }
                    for (var r in value.data["services"][s]["actions"][a]["reactions"]) {
                        newAction.addReaction(value.data["services"][s]["actions"][a]["reactions"][r]["name"]);
                    }
                    this.actions.push(newAction);
                    newService.addAction(newAction.name);
                }
                for (var r in value.data["services"][s]["reactions"]) {
                    var newReaction = new Reaction(value.data["services"][s]["reactions"][r]["name"]);
                    for (var p in value.data["services"][s]["reactions"][r]["parameters"]) {
                        newReaction.addParameter(new Parameter(value.data["services"][s]["reactions"][r]["parameters"][p]["name"],
                            value.data["services"][s]["reactions"][r]["parameters"][p]["type"]));
                    }
                    this.reactions.push(newReaction);
                    newService.addReaction(newReaction.name);
                }
                this.services.push(newService);
            }
        });
    }
}


export default Global;