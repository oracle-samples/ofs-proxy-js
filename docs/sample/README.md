Typescript is known for its better performance as compared to javascript and add-ons. It is a syntactical superset of javascript. It is a programming language that has been on-trend in recent years. Developed by Microsoft, TypeScript is famous in Web Development and Dev tools industry. As TypeScript has its benefit, using the best practices has its own best practices. Here is a list of the best practices you should follow while using TypeScript.

Require should not be used except in imports
The use of var foo = require("foo") are considered not a good practice in typescript. This is because these statements are environment-specific and more difficult to statically analyze while we can overcome the issue using ES6 imports or import foo = require('foo') imports.

Here is an example of incorrect code:

var foo = require("foo");
const foo = require("foo");
let foo = require("foo");
Here is the example of correct code:

import foo = require("foo");
require("foo");
import foo from "foo";
Function overloads should be consecutive
Typescript provides function overloading capability, which means you can have multiple functions with a similar name but different parameter and return types. You should arrange all the function overloads to be consecutive because it increases the readability of the code.

As you can see, the incorrect example given below is complicated to read and understand as most of the components are scattered.

declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function bar(): void;
  export function foo(sn: string | number): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void {}
  foo(sn: string | number): void {}
}

export function foo(s: string): void;
export function foo(n: number): void;
export function bar(): void;
export function foo(sn: string | number): void;
Here is the example of correct code with segregated function overloading.

declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function foo(sn: string | number): void;
  export function bar(): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void {}
  bar(): void {}
}

export function bar(): void;
export function foo(s: string): void;
export function foo(n: number): void;
export function foo(sn: string | number): void;
Use === instead of ==
There are two operators to detect the equality: == and ===. === does a type conversion before checking the equality. It is considered best practice to always use the former set when comparing or checking equality between two operators.

This will help you not to coerce the values of the operator. Let us have a look at an example.

"Codiga" == new String("Codiga") // true

In the above example, you can see the == operator gives out the result as accurate, which should not be the case as they do not have the same type. == will only give you the comparison between the values & not based on the data types.

Instead, you should use === in avoid the issue.

Avoid the use of any types
You can eliminate the use of any type in your code. Any data type in TypeScript is used when we don’t know the exact kind of variable that should be used in the case. Although any type was never a bad thing, just that the user should know the type they are working on.

This improves code simplicity and complexity of the code. Instead, one should use unknown when you do not know the type. It is similar to any but has one difference: it can only interact after seeing the type (through something like a type guard or inference).

Here is an example:

const foo: any = "foo";
const bar: unknown = "bar";

foo.length; // Works, type checking is effectively turned off for this
bar.length; // Errors, bar is unknown

if (typeof bar === "string") {
  bar.length; // Works, we now know that bar is a string
}
Use access modifiers for classes
Similar to Java, TypeScript comes with access modifiers for classes. These access modifiers have different properties. We have public, protected, or private access modifiers.

private: only accessible inside the class
protected: only accessible inside the class and through subclasses
public: accessible anywhere
This helps preserve the class members' security; it includes properties and attributes and prevents unauthorized access and use. This will help classes not to pop up abruptly anywhere within the script.

Example:


class Student{
  protected name: string;
  private marks: number;

  constructor(name: string, marks: number) {
    this.name = name;
    this.marks = marks
  }

  public getMarks(){
    return salary
  }

Here, you cannot access Marks unless you use the getMarks method.

class Child extends Student {
  viewDetails() {
    console.log(this.marks); // error: property 'marks’' is private
    console.log(this.getMarks()); // success
  }
}
But you can access the name using a sub-class.


class class Child  extends Student{
  viewDetails(){
    console.log(this.name);
  }
}


Use Automated Code Reviews
Code reviews are an essential element of software development. There are a lot of rules and best practices you need to follow while writing code. It is difficult to remember and follow all the rules. Using best practices helps you write better code with less complexity. With Codiga’s Automated Code Reviews, you can verify that your code is high-quality, accurate, and does not contain any mistakes.

Automated code reviews can be set up to keep up with all the code rules and best practices. There are a couple of tools that provide automatic code reviews. One such tool is Codiga; with Codiga, you can get automated code reviews directly on your pull/merge requests.

Automated Code Review on GitHub

While other tools require manual configuration, we have done everything for you. You will just need to install Codiga into your code collaboration platform, and you are good to go.

With Automated code reviews, you can manage everything from our Dashboard or directly from your pull/merge requests. We provide code review support from 12+ languages, and the rules are updated every day by our dedicated team of engineers. The best part of our code reviews is that they happen in seconds.

Wrapping up
We had a turnaround with many essential best practices for TypeScript, such as:

Require should not be used except in imports
Function overloads should be consecutive
Use === instead of ==
Avoid the use of any types
Organize and remove unused imports
Use access modifiers for classes
There are many best practices you should use; you can find them here.

We also discussed the importance of Automated Code Reviews and how Codiga can help boost your productivity. Once you have installed the app and given Codiga access, you can create a pull request to review code within existing repositories or create a new project directly on the Codiga platform.
Typescript is known for its better performance as compared to javascript and add-ons. It is a syntactical superset of javascript. It is a programming language that has been on-trend in recent years. Developed by Microsoft, TypeScript is famous in Web Development and Dev tools industry. As TypeScript has its benefit, using the best practices has its own best practices. Here is a list of the best practices you should follow while using TypeScript.

Require should not be used except in imports
The use of var foo = require("foo") are considered not a good practice in typescript. This is because these statements are environment-specific and more difficult to statically analyze while we can overcome the issue using ES6 imports or import foo = require('foo') imports.

Here is an example of incorrect code:

var foo = require("foo");
const foo = require("foo");
let foo = require("foo");
Here is the example of correct code:

import foo = require("foo");
require("foo");
import foo from "foo";
Function overloads should be consecutive
Typescript provides function overloading capability, which means you can have multiple functions with a similar name but different parameter and return types. You should arrange all the function overloads to be consecutive because it increases the readability of the code.

As you can see, the incorrect example given below is complicated to read and understand as most of the components are scattered.

declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function bar(): void;
  export function foo(sn: string | number): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void {}
  foo(sn: string | number): void {}
}

export function foo(s: string): void;
export function foo(n: number): void;
export function bar(): void;
export function foo(sn: string | number): void;
Here is the example of correct code with segregated function overloading.

declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function foo(sn: string | number): void;
  export function bar(): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void {}
  bar(): void {}
}

export function bar(): void;
export function foo(s: string): void;
export function foo(n: number): void;
export function foo(sn: string | number): void;
Use === instead of ==
There are two operators to detect the equality: == and ===. === does a type conversion before checking the equality. It is considered best practice to always use the former set when comparing or checking equality between two operators.

This will help you not to coerce the values of the operator. Let us have a look at an example.

"Codiga" == new String("Codiga") // true

In the above example, you can see the == operator gives out the result as accurate, which should not be the case as they do not have the same type. == will only give you the comparison between the values & not based on the data types.

Instead, you should use === in avoid the issue.

Avoid the use of any types
You can eliminate the use of any type in your code. Any data type in TypeScript is used when we don’t know the exact kind of variable that should be used in the case. Although any type was never a bad thing, just that the user should know the type they are working on.

This improves code simplicity and complexity of the code. Instead, one should use unknown when you do not know the type. It is similar to any but has one difference: it can only interact after seeing the type (through something like a type guard or inference).

Here is an example:

const foo: any = "foo";
const bar: unknown = "bar";

foo.length; // Works, type checking is effectively turned off for this
bar.length; // Errors, bar is unknown

if (typeof bar === "string") {
  bar.length; // Works, we now know that bar is a string
}
Use access modifiers for classes
Similar to Java, TypeScript comes with access modifiers for classes. These access modifiers have different properties. We have public, protected, or private access modifiers.

private: only accessible inside the class
protected: only accessible inside the class and through subclasses
public: accessible anywhere
This helps preserve the class members' security; it includes properties and attributes and prevents unauthorized access and use. This will help classes not to pop up abruptly anywhere within the script.

Example:


class Student{
  protected name: string;
  private marks: number;

  constructor(name: string, marks: number) {
    this.name = name;
    this.marks = marks
  }

  public getMarks(){
    return salary
  }

Here, you cannot access Marks unless you use the getMarks method.

class Child extends Student {
  viewDetails() {
    console.log(this.marks); // error: property 'marks’' is private
    console.log(this.getMarks()); // success
  }
}
But you can access the name using a sub-class.


class class Child  extends Student{
  viewDetails(){
    console.log(this.name);
  }
}


Use Automated Code Reviews
Code reviews are an essential element of software development. There are a lot of rules and best practices you need to follow while writing code. It is difficult to remember and follow all the rules. Using best practices helps you write better code with less complexity. With Codiga’s Automated Code Reviews, you can verify that your code is high-quality, accurate, and does not contain any mistakes.

Automated code reviews can be set up to keep up with all the code rules and best practices. There are a couple of tools that provide automatic code reviews. One such tool is Codiga; with Codiga, you can get automated code reviews directly on your pull/merge requests.

Automated Code Review on GitHub

While other tools require manual configuration, we have done everything for you. You will just need to install Codiga into your code collaboration platform, and you are good to go.

With Automated code reviews, you can manage everything from our Dashboard or directly from your pull/merge requests. We provide code review support from 12+ languages, and the rules are updated every day by our dedicated team of engineers. The best part of our code reviews is that they happen in seconds.

Wrapping up
We had a turnaround with many essential best practices for TypeScript, such as:

Require should not be used except in imports
Function overloads should be consecutive
Use === instead of ==
Avoid the use of any types
Organize and remove unused imports
Use access modifiers for classes
There are many best practices you should use; you can find them here.

We also discussed the importance of Automated Code Reviews and how Codiga can help boost your productivity. Once you have installed the app and given Codiga access, you can create a pull request to review code within existing repositories or create a new project directly on the Codiga platform.
