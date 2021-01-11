// let array = [6, 1323,3, 8, 1,112, 11, 85]
// const empty = []

// while (array.length > 0) {
//     let smallest = array[0]
//     for (let n in array) {
//         if(array[n] < smallest) smallest = array[n]
//     }
//     empty.push(smallest)
//     array.splice(array.indexOf(smallest), 1)

// }


// console.log(empty)

// let strig = "accccga"
// console.log(strig.split('').reverse().join('') === strig)


// function summa(x,y){
//     if(y === undefined) return (y)=> x + y
//     else return x+ y 
// }

// console.log(summa(2)(3))
// let d = {}
// let a =  ['zebra', 'horse' ]
// a.forEach(function(k) {
// 	d[k] = undefined;
// });
// console.log(d)




// const phrase = 'Welcome to this Javascript Guide!'

// const parray = (phrase.split(' '))
// let reversedP = ''
// parray.forEach(element =>reversedP += element.split('').reverse().join('') + ' '    );


// function createBase (x) {
//     return function(n){
//         return x + n
//     }
// }

// var addSix = createBase(6);
// console.log(addSix);
// console.log(addSix(10));
// addSix(21);



// for( let i = 0 ; i <= 100; i++){
//     let f = i % 3 == 0
//     let b = i%5 == 0
//     console.log(f ? (b ? 'fizzbuzz' : 'fizz') : b ? 'buzz' : i)
// }


// const first = 'Mary'
// const second = 'Army'

// function checkanagram(f, s) {
//     const fS = f.toLowerCase().split('').sort().join('')
//     const sS = s.toLowerCase().split('').sort().join('')
//     return fS === sS
// }
// console.log(checkanagram(first, second))

// function counter() {
//     var _counter = 0

//     return {
//         add: function (incrementer) { _counter = _counter + incrementer },
//         getCounter: function () { return _counter }
//     }

// }
// const c = counter()
// c.add(12)
// console.log(c.getCounter())

// (function() {
//     var a = b = 5;
//   })();
  
//   console.log(b);

// function multiply(x, y){
//     console.log(arguments.length)
//     if(y === undefined) return (y) => x * y
//     else return x * y
   
// }
// console.log(multiply(2))


// const array = [1,6,5,3,2,733,3,1]
// array.splice(5,1)
// array.sort()
// array.reverse()
// array.forEach(element => {
//     // console.log(element)
// });
// let newArray = array.map(e=>{
//     if(e <5) return e
// })
// //Filter cibduzuibu
// newArray = newArray.filter(e=>e!=undefined)
// console.log(newArray.some(e=>e > 14))
// console.log(newArray.every(e=>e < 14))
// console.log(newArray.find(e=>e>2))
// console.log(newArray.findIndex(e=>e< 2))
// console.log(newArray.reduce((prev,curr)=>prev+curr))
// console.log(newArray.shift())
// console.log(newArray.unshift(2))
// console.log(newArray)


const reverseString= string =>{
    // let empty = []
    // let stringArray = string.split('')

    // stringArray.forEach(e=>empty.unshift(e))
    // return empty.join('')
    let emptyString = ''
    for( let i = string.length - 1 ; i >= 0; i--){
        emptyString += string[i]
    }
    console.log(emptyString)
}


console.log(reverseString('GEEKSFORKEEK'))
