import Mediator from '../../modules/mediator'
const bus = new Mediator()

window.showPopup = () => {
  document.querySelector('.c-popup').style.display = 'flex'
}

setTimeout(() => {
  const avatarForm = document.getElementById('avatarForm')
  const avatarInput = document.getElementById('avatar')
  const avatarFileName = document.getElementById('avatarFileName')

  avatarInput.onchange = function (e) {
    let text = 'Выбрать файл на компьютере'
    let className = ''
    if (e.target.files[0].name !== null) {
      text = e.target.files[0].name
      className = 'grey'
    }
    avatarFileName.innerText = text
    avatarFileName.className = className
  }

  avatarForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(avatarForm)

    bus.emit('user:avatar', formData)
  })
}, 500)
