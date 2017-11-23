# Learn from our Academy
Javascript 6, HTML5 and CSS3 are the modern web technologies used to create software.
HTML5 and CSS3 create the interface, while Javascript6 can be used to create the server and make that interface functional.
Fearless Apps can train anyone not yet capable of developing these products. It does not matter what your current skill is, we teach everyone.

**[noob] Watch & Learn** *- Get inspired and be fearless*

- Talk: Goals
- Talk: Lessons

**[beginner] Plug & Play** *- How to create simple shapes and content*

- Project: Flags
- Project: Wiki

**[beginner] Basic Client** *- How to create interactive interfaces*

- Project: Calculator
- Project: Stopwatch

**[intermediate] Advanced Templating** *- How to create complex interfaces*
- Project: List
- Project: Graphs

**[intermediate] Server Shenanigans** *- How to create a web service*

- Project: List
- Project: Chat

**[professional] API Exploration** *- How to use external web services*

- Project: Mailer
- Project: Map

**[professional] Account Systems** *- How to use a database and do authentication*

- Project: Administrator
- Project: Shop

**[expert] Data & Automation** *- How to do CRON jobs and work with large datasets*

- Project: Market
- Project: Game

## Getting Started
* [Install node.js](http://nodejs.org/download/)
* Install Brunch globally `npm install -g brunch`
* Install npm packages inside this repository `npm install`
* Host the client at http://localhost:443 `npm start`

## Usage
```html

  <!--
  fires "string_or_function(element)" 
  when the HTML element is ever put inside the DOM
  -->
  <div data-load="path.to.string_or_function"></div>
  
  <!--
  data-bind + data-text updates the innerText
  on load and when the object is sent from the server
  -->
  <div data-bind="path.to.object" data-text="name"></div>
  
  <!--
  fires "click_function(element)"
  you can read data-something through "element.dataset.something"
  -->
  <div data-click="path.to.click_function" data-something="hello world"></div>
  
  <input data-keyup="path.to.keyup_function"></div>
  
  <input data-change="path.to.change_function"></div>
  
```
```javascript

window.root = {

  path: {
  
    to: {

      string_or_function: 'test',
      
      object: { name: 'test' },

      click_function: (element) => {

        console.log(element.dataset.something);

      },

      keyup_function: (element) => {

        console.log('input value:', element.value);

      },

      change_function: (element) => {

        console.log('change detected:', element.value);

      }

    }
  
  }
  
}

```
