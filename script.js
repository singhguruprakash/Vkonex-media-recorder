window.addEventListener('DOMContentLoaded', main)

async function main() {
  //Selecting dom elements
  let video = document.querySelector('#preview')
  let startBtn = document.querySelector('#start')
  let stopBtn = document.querySelector('#stop')
  let timer = document.querySelector('#timer')
  let downloadBtn = document.querySelector('#download')

  //Default styling
  downloadBtn.style.display = 'none'
  stopBtn.setAttribute('class', 'disabled')

  //Global varaibles
  let videoStream = null
  let mediaRecorder = null
  let recordedBlobs = []
  let timerInterval = null
  let startTime = {
    hr: 0,
    min: 0,
    sec: 0,
  }
  //Video preview
  videoStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  video.srcObject = videoStream

  //Video Start Recording
  startBtn.addEventListener('click', () => {
    mediaRecorder = new MediaRecorder(videoStream, {
      mimeType: 'video/webm',
    })
    mediaRecorder.addEventListener('dataavailable', (e) => {
      recordedBlobs.push(e.data)
    })

    mediaRecorder.addEventListener('stop', () => {
      let videoLocal = URL.createObjectURL(
        new Blob(recordedBlobs, { type: 'video/webm' })
      )
      downloadBtn.href = videoLocal
      downloadBtn.click()
    })
    stopBtn.removeAttribute('class', 'disabled')
    startBtn.setAttribute('class', 'disabled')
    mediaRecorder.start(1000)
    timerInterval = setInterval(() => {
      startTime.sec++
      if (startTime.sec > 60) {
        startTime.sec %= 60
        startTime.min++
      }
      if (startTime.min > 60) {
        startTime.min %= 60
        startTime.hr++
      }
      if (startTime.hr > 24) {
        startTime = {
          hr: 0,
          min: 0,
          sec: 0,
        }
      }
      updateTimer(timer, startTime)
    }, 1000)
  })

  //Video Stop recording
  stopBtn.addEventListener('click', (event) => {
    if (mediaRecorder) {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
      startBtn.removeAttribute('class', 'disabled')
      stopBtn.setAttribute('class', 'disabled')
      startTime = {
        hr: 0,
        min: 0,
        sec: 0,
      }
      mediaRecorder.stop()
    }
  })
}
// Change Timer
function updateTimer(timer, time) {
  timer.textContent = timeString(time.min) + ':' + timeString(time.sec)
}
function timeString(t) {
  return t > 9 ? t.toString() : `0${t}`
}


