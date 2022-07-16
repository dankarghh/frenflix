USEFUL ARRAY METHODS

FILTER:

items.filter((item => {
    return item.price > 1
}))

^ returns new array only of items that meet condition

MAP:

items.map((item) => {
    return item.name
})

^ maps over items returning a new array

FIND:

items.find((item) => {
    return item.name === book
})

^ returns first item in array where statement is true


FOR EACH:


SOME:

items.some((item) => {
    return item.price > 2
})

^ returns true or false if any item meets condition

EVERY: 

items.every((item) => {
    return item.price > 2
})

^ returns true or false if EVERY item meets condition

REDUCE:

const total = items.reduce((currentTotal, item) => {
    return item.price + currentTotal
}, 0)

^ takes in 2 other parameters, currentTotal which is defined in function and 0 at end to set initial value of first parameter
