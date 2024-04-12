import Mediator from '../../modules/mediator'
const bus = new Mediator()

window.showPopup = (): void => {
  const popup: HTMLElement | null = document.querySelector('.c-popup')
  if (popup !== null) {
    popup.style.display = 'flex'
  }
}

setTimeout(() => {
  const avatarForm = document.getElementById('formAvatar') as HTMLFormElement
  const avatarInput = document.getElementById('avatar')
  const avatarFileName = document.getElementById('avatarFileName')

  if (avatarInput !== null && avatarFileName !== null) {
    avatarInput.onchange = function (e: any) {
      let text = 'Выбрать файл на компьютере'
      let className = ''
      if (e.target !== null && e.target.files[0].name !== null) {
        text = e.target.files[0].name
        className = 'grey'
      }
      avatarFileName.innerText = text
      avatarFileName.className = className
    }
  }

  if (avatarForm !== null) {
    avatarForm.addEventListener('submit', event => {
      event.preventDefault()

      const formData = new FormData(avatarForm)

      bus.emit('user:avatar', formData)
    })
  }
}, 500)
