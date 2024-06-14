
const a: [string, number] = ['qwer', 123]

console.log(a)

enum Color {
  red,
  blue,
  yellow,
}

const c: Color = Color.blue

console.log(c)

class Person {
  private name: string
  #age: number
  constructor(name, age) {
    this.name = name
    this.#age = age
  }
}

const p = new Person('xiaoming', 123)
console.log(p.name)
// console.log(p.#age); // 会报错

interface User {
  name: string
  age: number
  eat: () => void
}

type UserType = {
  name: string
  age: number
  eat: () => void
}

class UserClass implements User {}
class UserTypeClass implements UserType {}
new UserClass()
new UserTypeClass()

const aaa = 1000
type T5 = typeof aaa

const bbb: T5 = 100
console.log(bbb)

type T6 = { name: string; age: number; qwer: string; }

type T7 = keyof T6

const ccc: T7 = "name"
console.log(ccc)
