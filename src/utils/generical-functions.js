export function generateRange(a, b, step) {
    const arr = [];
    for (let index = a; index < b; index+=step) {
        arr.push(index)
    }
    return arr;
}