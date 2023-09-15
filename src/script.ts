/// <reference path="timer.ts"/>
  
  function sayHelloWorld(): void {
    console.log("\n");
    console.log("*** Hello World from Type Script code. ***");
    console.log("\n");
    const timer = TIMER;
    timer.llog("fobar");
  }
  
  sayHelloWorld();