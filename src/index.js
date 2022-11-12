import {fromEvent, interval, timer,of, from } from 'rxjs';
import {map ,pluck,filter,reduce,take,scan,tap,mergeMap,switchMap,concatMap,exhaustMap} from 'rxjs/operators';
import { ajax } from "rxjs/ajax";

//MORE RxJs observables with diagrams at https://rxmarbles.com/

//fromEvent - works as event listener
// const observable = fromEvent(document, 'click');

//interval() - calls observable on interval of time
// const observable = interval(1000);

//timer() - sets timer 1 argument) - timeInterval or date before the interval of repetitions starts
//2 argument) - time between the repetitions
// const observable = timer(1000,1000);

//"of" will iterate over the values we add as he create observer and synchronously call observer push the value and complete it
//before start pushing next value if we add array it reads it as 1 elemnt
//const observable = of(1,2,3,4,5);

//"from" is very POWERFUL operator work same way as "of" but works with arrays,promises, AsyncIterable and iterable streams 
//const observable = from([1,2,3,4,5])
//it can also fetch() data from server
//const observable = from(fetch('https://jsonplaceholder.typicode.com/todos/1'))
 
//map() - can manipulate any passed value via so called pipe-function
// const observable = of(1,2,3,4,5).pipe(
//     //add $ in front of every number
//     map((x) => `$${x}`)
// )


//pluck('propertyName') - pluck() gives us the value from  given property name in object
// const observable = fromEvent(document, 'keydown').pipe(
//     pluck('code')
// )
// same as:
// const observable = fromEvent(document, 'keydown').pipe(
//     map(event => event.code)
// )


//filter() - filters by given criterias
// const observable = fromEvent(document, 'keydown'
// ).pipe(
//          pluck('code'),
//          filter(code => code === 'Space')
//     )

//reduce() - adds values to accumulator , second argument is the starting value of accumulator in this case is '0'
//reduce waits until observer adds all the values and then returns value
// const observable = of(1,2,3,4,5).pipe(
//     reduce((acc, value) => acc + value ,0)
// )

//take(5) - takes the first 5 elements given to observeble
// const observable = interval(500
//     ).pipe(
//         take(5),
//         reduce((acc, value) => acc + value ,0)
//     )

//scan() works same as reduce() but doesn't wait for observerble to complete and returns everu accumulated value.
//it helps to check every accumulated value!!!
// const observable = interval(500
//     ).pipe(
//         take(5),
//         scan((acc, value) => acc + value ,0)
//     )

//tap() - everything what happens in pipeline can be observed with this operator as it ignores all changes
// it make's it perfect for debuging.
// const observable = interval(500
//     ).pipe(
//         take(5),
//         tap(console.log),
//         reduce((acc, value) => acc + value ,0)
//     )
    //tap() can accept objects too(same result as above):
    // const observable = interval(500
    //     ).pipe(
    //         take(5),
    //         tap({
    //             next(val){console.log(val)}
    //         }),
    //         reduce((acc, value) => acc + value ,0)
    //     )

//mergeMap() -
//example 1) works as map() but gets/handles also the result from the server (while map() just makes request in this case)
const button = document.querySelector('#btn')
// const observable = fromEvent(
//     button, 'click' 
// ).pipe(
//     mergeMap(() => {
//         return ajax.getJSON('https://jsonplaceholder.typicode.com/todos/1')
//     })
// )
//example 2) mergeMap() will always subscribe to any inner observable which can lead to memory leaks
// const observable = fromEvent(
//     button, 'click' 
// ).pipe(
//     mergeMap(() => {
//         return interval(1000).pipe(
//              tap(console.log),
//                 take(5)
//                 )
//     })
// )
//as we see once started will never stop it will return value and continue to subscribe on every click
//thats why we have to use something like take() after it to make it stop in some conditions

//switchMap() - works as mergeMap() but understants when inner observeble is completed
// is perfect to manage one observebla at a time 
//very useful for managing server reguests because if user click twice on a button insted to make 2 requests switchMap() will cancel the first request
// const observable = fromEvent(
//     button, 'click' 
// ).pipe(
//     switchMap(() => {
//         return ajax.getJSON('https://jsonplaceholder.typicode.com/todos/1').pipe(
//             take(5),
//              tap({ 
//                 complete() {console.log('inner observable completed')}
//              }),
//                 )
//     })
// )

//concatMap() - works similary as switchMap() but instead canceling the second observable, puts it on a queue and when the first is ready starts the second one
//like that we can manage multiply observables without canceling any of them
//for example if we wanna send many requests one after another to the server

// const observable = fromEvent(
//     button, 'click' 
// ).pipe(
//     concatMap(() => {
//         return ajax.getJSON('https://jsonplaceholder.typicode.com/todos/1').pipe(
//             take(5),
//              tap({ 
//                 complete() {console.log('inner observable completed')}
//              }),
//                 )
//     })
// )

//exhaustMap() - ignores second observable useful to prevent multiply form submisions via double click

const observable = fromEvent(
    button, 'click' 
).pipe(
    exhaustMap(() => {
        return ajax.getJSON('https://jsonplaceholder.typicode.com/todos/1').pipe(
            take(5),
             tap({ 
                complete() {console.log('inner observable completed')}
             }),
                )
    })
)
const subscription = observable.subscribe(console.log)

//Conclusion(recap flattening operators) 
//Let's say you are chef and you are woking on a order but in that time 
//more orders comming if you use:
//switchMap() - you should stop working on the curent order and start the new one 
//this way only tha latest order will ever be finished

//concstMap() - the order gets added to a queue. finishing the current will start next one

//mergeMap() - You will work on all orders at the same time as soon as you get them.

//exhaustMap() - You ignore new orders and finish the current order. Once you finished you are free to accept new one.
