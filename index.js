let model = null
let width = 512
let height = width
let streaming = false
let video = null
let canvas = null
let ctx = null
let startbutton = null

const predict = async () => {
  const returnTensors = false // Pass in `true` to get tensors back, rather than values.
  const predictions = await model.estimateFaces(document.getElementById("canvas"), returnTensors)
  console.log(predictions)
  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i++) {
      const start = predictions[i].topLeft
      const end = predictions[i].bottomRight
      const size = [end[0] - start[0], end[1] - start[1]]
      ctx.fillRect(start[0], start[1] - 0, size[0], size[1])
    }
  }
}

const startup = async () => {
  model = await blazeface.load()
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  startbutton = document.getElementById('startbutton')
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      video.srcObject = stream
      video.play()
    })
    .catch(err => {
      console.log("An error occurred: " + err)
    })
  video.addEventListener('canplay', ev => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width)
      video.setAttribute('width', width)
      video.setAttribute('height', height)
      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      streaming = true
    }
  }, false)
  startbutton.addEventListener('click', ev => {
    ctx.drawImage(video, 0, 0, width, height)
    predict()
    ev.preventDefault()
  }, false)
}

window.addEventListener('load', startup, false)