## TS

1. 关于数组、元组、枚举，以下举例说明：
    - 数组：`number[]`
    - 元组：`[string, number]`，每个索引处的元素类型是固定的
    - 枚举：`enum Color { red, blue, green }`
      - 如果不赋值，默认值为 0,1,2,.. 和数组下标一样
      - 如果赋值了，但是没有全部赋值，那么没赋值的是 `undefined`
      - 另外，何为枚举？
        - 可枚举就是固定的几个可选值，就这么几个情况
        - 不固定的情况为不可枚举


2. 关于 any、void、never、unknown 的区别
   - `any`：任意类型，不进行类型检查，和写纯 js 一样
   - `void`：没有类型，无返回值，一般配合函数使用
   - `never`：永远不存在的类型，例如：
     ```js
     // 函数一直循环出不去
     function f1 (): never {
       while (true) {}
     }
     // 抛出错误，中断执行
     function f2 (): never {
       throw new Error('message')
     }
     ```
   - `unknown`：未知类型，类似 any，但是比 any 更安全，需要自行类型断言后使用
     ```ts
     const a: unknown = 100
     // 断言，告诉 TS 编译器：我知道 a 的类型，安全问题我自己负责
     ;(a as string).length
     ```


3. 关于私有属性修饰符 `#` 和 `private` 的区别
    - 都是定义私有属性，`private` 可以强制访问，`#` 强制访问会报错，所以 `#` 适合定义那些一定不能被外部访问的属性
       ```ts
       class Person {
         private name: string
         #age: number
         constructor(name, age) {
           this.name = name
           this.#age = age
         }
       }
       
       const p = new Person('xiaoming', 123)
       console.log(p.name) // 强制访问，仍然能获取到值
       console.log(p.#age) // 程序报错，无法执行
       ```


4. 关于 type 和 interface 的区别
    - 共同点：
      - 都可以描述一个对象结构
      - 都可以被实现
      - 都可以被扩展
        ```ts
        // 都可以描述一个对象结构
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
        // 都可以被实现
        class UserClass implements User {}
        class UserTypeClass implements UserType {}
        ```
    - 不同点：
      - type 可以声明基础类型
        - `type T1 = number; type T2 = string`
      - type 可以使用联合类型、交叉类型
        - `type T3 = T1 & T2; type T4 = T1 | T2`
      - type 可以通过 typeof 赋值
        - `const num = 100; type T5 = typeof num`
        - ```ts
          type T6 = { name: string; age: number }
          type T7 = keyof T6 // 这一句就相当于：type T7 = 'name' | 'age'
          ```
    - type 和 interface 如何选择？
      - 初衷：type 定义类型关系，interface 定义数据结构
      - 但是使用起来，很多时候会模糊不清，没有明确的界限
      - 使用原则：能用 interface 就用 interface，否则使用 type
        - 当然这也不是官方提出的原则，只是这个原则让使用更加简单明了


5. 关于 type 和 interface 如何扩展属性
