export default class Subject {
    #observers;

    constructor() {
        //assoziativer array
        this.#observers = [];
    }

    subscribe(event, subscriber,callbackFct){
        if(this.#observers[event] == undefined){
            this.#observers[event]=[];
        }
        this.#observers[event].push({
            obj: subscriber,
            fct: callbackFct
        });
    }

    unsubscribe(event, subscriber){
        let observersForEvent = this.#observers[event];
        if (observersForEvent){
            for (let i=0; i < observersForEvent.length; i++){
                if (observersForEvent[i].obj === subscriber){
                    console.info("Removing observer");
                    observersForEvent.splice(i, 1);
                    return;
                }
            }
        } else {
            throw "Error: Could not find any observers for desired event " + event;
        }
    }

    notify(event, paramObj){
        let observersForEvent = this.#observers[event];
        if (observersForEvent){
            for(let observer of observersForEvent){
                observer.fct.call(observer.obj, paramObj);
            }
        } else {
            throw "Error: Could not find any observers for desired event " + event;
        }
    }
}