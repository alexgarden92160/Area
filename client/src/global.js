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
    static userActions = [];
    static username = "";
    static isLoggedIn = false;
    static id = -1;

    static setServiceState(serviceName, activeState) {
        for (var s in this.services) {
            if (this.services[s].name === serviceName) {
                this.services[s].isActive = activeState;
                break;
            }
        }
    }

    static switchServiceState(serviceName) {
        for (var s in this.services) {
            if (this.services[s].name === serviceName) {
                this.services[s].isActive = !this.services[s].isActive;
                break;
            }
        }
    }

    static getServiceState(serviceName) {
        console.log("kk " + serviceName)
        this.services.map((s) => {
            if (s.name === serviceName) {
                console.log("coucou " + s.isActive)
                return (s.isActive === "true")
            }
        });
        console.log("-")
        return false
    }

    static setUsername(s) {
        this.username = s;
    }

    static setIsLoggedIn() {
        this.isLoggedIn = true;
    }

    static setUserId(i) {
        this.id = i;
    }

    static loadUserData() {
        axios.post("http://onearea.online:3000/service/active/getall", { id: this.id }
        ).then((value) => {
            var serv = value.data;

            this.setServiceState("weather", serv["weather"]["is_active"]);
            this.setServiceState("intra", serv["intra"]["is_active"]);
            this.setServiceState("youtube", serv["youtube"]["is_active"]);
            this.setServiceState("area", serv["area"]["is_active"]);
            this.setServiceState("crypto", serv["crypto"]["is_active"]);
            this.setServiceState("covid", serv["covid"]["is_active"]);
        });
    }

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