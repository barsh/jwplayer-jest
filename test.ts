import * as jsdom from 'jsdom'
import * as path from 'path'
let window: jsdom.DOMWindow

const src = path.resolve('./jwplayer/debug-v8.0.2/jwplayer.js').replace(/\\/g, '/')

beforeAll((done) => {
  window = new jsdom.JSDOM(`
    <html>
    <head>
    <script src="file://${src}"></script>
    </head>
    <body></body>
    </html>
    `, {
    runScripts: 'dangerously', // enable scripts to execute
    resources: 'usable' // enable scripts to be downloaded
  }).window
  window.document.addEventListener('load', () => {
    expect((window as any).jwplayer).toBeDefined()
    done()
  })
})

it('window.jwplayer is defined', () => {
  expect((window as any).jwplayer).toBeDefined()
})

it('succeeds when model.playlist.sources is valid', (done) => {
  const model = {
    playlist: [{ sources: [{ file: 'http://playertest.longtailvideo.com/mp4.mp4' }] }]
  }
  const readyHandler = (api) => {
    expect(api).toBeDefined()
    done()
  }
  const errorHandler = (api, error) => {
    expect('setup failed with message: ' + error.message).toBe('')
    done()
  }
  testSetup(done, model, readyHandler, errorHandler)
})

function testSetup(done, model, success, error) {
  window.document.body.innerHTML = '<div id="player"></div>'
  const api = (window as any).jwplayer('player')
  api.setup(model)

  api.on('ready', () => {
    success.call(api)
    expect(api.remove()).not.toThrowError()
    done()
  })
  api.on('setupError', (e) => {
    error.call(api, e)
    expect(api.remove()).not.toThrowError()
    done()
  })
  done()
  return api
}
