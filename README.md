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
      - 都可以被扩展（下一节单独讲）
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
      - type 可以使用交叉类型、联合类型
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
      - 最后，type 和 interface 的问题，是 ts 的设计问题，不是咱的问题


5. 关于 type 和 interface 如何扩展属性
    - interface 可以合并声明（type 不可以）
       ```ts
       interface User { name: string }
       interface User { age: number }
       // 相当于：
       interface User {
         name: string
         age: number
       }
       ```
    - interface 可以扩展（extends，或者叫继承也行）interface 和 type
    - type 也可以扩展 interface 和 type（使用交叉类型符号 `&` 连接）


6. 泛型的运用
   - 什么是泛型：可自定义的通用类型，在 ts 中出现的尖括号的就是泛型 `<>`
   - 以下示例：
      ```ts
      // 1. 函数中定义泛型，可以在使用的时候传入类型
      function fn<Type>(arg: Type): Type {
        return arg
      }
      const res = fn<string>('xxx')
      const res2 = fn<number>(100)
      
      // 2. 函数中定义多个泛型
      function fn2<T, U>(a: T, b: U) {
        return a + b
      }
      const res3 = fn2<string, number>('xxx', 100)
      
      // 3. class 中定义泛型
      class User<T> {
        name: T
        constructor(name: T) {
          this.name = name
        }
        getName(): T {
          return this.name
        }
      }
      const user = new User<string>('xiaoming')
      
      // 4. 定义在 type
      const myFn: <T>(arg: T) => T = fn
      
      // 5. 定义在 interface
      // 这里要理解一下，interface 明明是个对象，为啥就赋值成函数了？
      // 其实是因为，函数本身也是个对象结构，包括 name 属性
      interface Fn<T> {
        (arg: T): T
        name: string
      }
      const myFn2: Fn<string> = fn
      
      // 6. 泛型，可以当作任何类型使用
      function fn3<T>(arg: Array<T>) {
        console.log(arg)
      }
      fn3<number>([1, 2, 3])
      
      // 7. 泛型的扩展（给泛型 T 扩展上 length 属性）
      // 但是扩展后，泛型 T 就不能传递任何类型了，例如：number 类型，ts 会提示报错，number 类型没有 length 属性
      interface S {
        length: number
      }
      function fn4<T extends S>(arg: T) {
        console.log(arg.length)
      }
      ```


7. 关于交叉类型和联合类型
   - 交叉类型
     - 多个类型合并为一个类型，连接符号：`&`，例如：`T1 & T2 & T3`
     - 如果属性类型冲突了，则属性类型变为 `never`
     - 基础类型不能交叉，也会变为 `never`（和上面一条同理）
        ```ts
        interface U1 {
          name: string
          age: number
        }
        interface U2 {
          name: string
          city: string
        }
        // 合并 name、age、city 属性，如果 name 属性类型冲突，则类型变为 never（这个转变有利于开发时排错，然后自行修改）
        type T1 = U1 & U2
        // 基础类型交叉也会转变成 never（不可能同时是两个类型）
        type T2 = string & number
        ```
   - 联合类型
     - 是一种 “或” 的关系，连接符号：`|`，例如：`T1 | T2 | T3`
     - 不存在冲突的问题


8. 在 ts 中的一些特殊符号
   - `?`：可选，表示某些参数或属性你可以不传
   - `?.`：可选链，没有的话返回 undefined
   - `??`：空值合并运算符，只有左侧是 null 或 undefined 时，才会返回右侧
   - `!`：非空断言操作符，表示你确定某个变量是有值的
   - `_`：数字分隔符，例如 `const num = 1_000_000`，只是为了易读，数字的本质并没变
   - `#`：私有属性修饰符（强私有）
   - `&`：交叉类型连接符
   - `|`：联合类型连接符


9. 关于 ts 中常见的工具类型
   - `Partial<T>`：让所有属性可选，相当于所有属性都加上可选符号 `?`
   - `Required<T>`：与上面的 Partial 正好相反，让所有属性必选
   - `Pick<T, K>`：选取几个属性，且必选，其它属性不可选
   - `Omit<T, K>`：剔除掉几个属性，剩下的属性保持原来的选择状态
   - `ReadOnly<T>`：设置为只读，属性值不能被修改
     ```ts
     interface User {
       name: string
       age: number
       city?: string
     }
     
     // 所有属性可选
     const u1: Partial<User> = { name: 'xiaoming' }
     
     // 所有属性必选
     const u2: Required<User> = { name: 'xiaoming', age: 20, city: 'xxx' }
     
     // 选取几个属性成为新的 type，这些属性必选，其它属性不可选
     type User2 = Pick<User, 'name' | 'city'>
     const u3: User2 = { name: 'xiaoming', city: 'xxx' }
     
     // 剔除掉几个属性，剩下的属性保持原有选择状态
     type User3 = Omit<User, 'name'>
     const u4: User3 = { age: 20 }
     
     // 属性不能被修改
     const u5: Readonly<User> = { name: 'xiaoming', age: 20 }
     // u5.age = 30 // 不可被修改
     ```


10. 关于 ts 中扩展 window 属性
    - 可以创建一个 `xxx.d.ts` 文件，在里面做 Window 的声明，如下：
      ```ts
      // 我们前面说过，interface 是可以合并的，ts 自身已经定义过 Window 这个 interface
      // 我们这里的 interface 会和 ts 自身定义的 interface 合并，所以不用担心其它属性
      // 另外，declare 是全局生效的，所以这个声明可以放到外面的一个声明文件
      // 注意，这个声明文件所在的位置，要能被 ts 编译得到，可以检查 tsconfig.json 内的 include 属性
      declare interface Window {
        test: number
      }
      window.test = 123
      ```


11. 关于在 ts 中定义第三方模块的类型
    - 现在的大部分模块一般都自带 ts 声明文件了
    - 对于老的模块，会采用 `@types/xxx` 的方式声明类型，例如：`@types/react`
    - 有的模块就是纯 js 写的怎么办？可以自己定义，如下：
      ```ts
      // 可以在声明文件内定义，注意 module 名称要和第三方包名相同
      declare module 'someModule' {
        function fn (a: number): void {}
        export { fn }
      }
      ```
