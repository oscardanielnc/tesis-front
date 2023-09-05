export function generateRange(a, b, step) {
    const arr = [];
    for (let index = a; index < b; index+=step) {
        arr.push(index)
    }
    return arr;
}

export function addingInitArr(arr) {
    const finalArr = [{
        value: '',
        name: 'Elegir...'
    }]
    for (let elem of arr) {
        finalArr.push(elem)
    }
    return finalArr;
}