export function goToHome(user) {
    localStorage.setItem("ACCESS_TOKEN", JSON.stringify(user));
    if(user.role === "ADMIN") {
        window.location.href = `/admin/sys-data`;
    } else {
        window.location.href = `/profile/${user.role.toLowerCase()}/${user.id}`;
    }
}

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

export function getDateByNumber(de) {
    console.log(de)
    const d = new Date(de)
    const arr = d.toLocaleDateString().split('/')

    return `${cifNum(Number(arr[0]))}/${cifNum(Number(arr[1]))}/${cifNum(Number(arr[2]))}`
}
function cifNum(num) {
    if(num<10) return `0${num}`;
    return `${num}`
}