const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<body><div id="app"></div></body>', {
  url: 'http://localhost:3000/'
})

global.window = jsdom.window
global.document = jsdom.window.document
global.FormData = jsdom.window.FormData
global.location = jsdom.window.location
global.history = jsdom.window.history

console.log('mocha: jsdom loaded')
