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

export function deleteItemOfArray (arr, item, attribute) {
    const newArray = []
    for(let elem of arr) {
        if(item[attribute]!==elem[attribute]) {
            newArray.push(elem)
        }
    }
    return newArray
}
export function modifyItemOfArray (arr, item, attribute) {
    const newArray = []
    for(let elem of arr) {
        if(item[attribute]!==elem[attribute]) {
            newArray.push(elem)
        } else {
            newArray.push(item)
        }
    }
    return newArray
}