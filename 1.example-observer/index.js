/**@author erickwendel */


class NotImplementedException extends Error {
    constructor(message) {
        this.message = message || "Error, this method has to be implemented"
    }
}

class IObserver {
    update() {
        throw new NotImplementedException()
    }
}

class Customer extends IObserver {
    constructor(name) {
        super()
        this.observerName = name
    }

    update(newValue, oldValue) {
        console.log(`${this.observerName}, the inventary with ${oldValue} products was changed to ${newValue}`)
    }

}

class ISubject {
    subscribe(observer) {
        throw new NotImplementedException()
    }
    unsubscribe(observer) {
        throw new NotImplementedException()
    }
    notify() {
        throw new NotImplementedException()
    }
}
class OnlineStore extends ISubject {
    constructor() {
        super()
        this.observers = []
        const inventory = {
            set: (target, propertyKey, newValue) => {
                this.notify(newValue, target[propertyKey])
                target[propertyKey] = newValue
                return true
            }
        }
        this._item = new Proxy({
            count: 0,
        }, inventory)
    }

    notify(newValue, oldValue) {
        this.observers.forEach(observer =>
            observer.update(newValue, oldValue)
        )
    }

    unsubscribe(observer) {
        const index = this.observers.indexOf(observer)
        console.log(`[${this.observers[index].observerName}] will not notified anymore`)
        this.observers.splice(index, 1)
    }

    subscribe(observable) {
        this.observers.push(observable)
    }

    next(value) {
        this._item.count += value;
    }
}

// behavioral pattern
/**
 * We can say that observer is 
 * something (objects in case of OOPS) which is looking upon (observing) 
 * other object(s). Observer pattern is popularly known to be based on 
 * "The Hollywood Principle" which says- "Don’t call us, we will call you." 
 * Pub-Sub (Publisher-Subscriber) is yet another popular nickname given to 
 * Observer pattern.

 The online electronic store is going to be the subject.
  Whenever the subject would have any addition in its inventory, 
  the observers (customers/users) who have subscribed to store notifications
   would be notified through email
   reference:  http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html

 */
(async function main() {
    const subject = new OnlineStore()

    const erick = new Customer("Erick")
    subject.subscribe(erick)

    const camilla = new Customer("Camilla")
    subject.subscribe(camilla)

    subject.next(1);
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log()
    subject.unsubscribe(erick)
    console.log()

    await new Promise(resolve => setTimeout(resolve, 1000))

    subject.subscribe(new Customer("Amanda"))
    subject.next(3);

})()