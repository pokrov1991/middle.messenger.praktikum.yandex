import Mediator from '../../modules/mediator'
const bus = new Mediator()

window.showPopup = (type: string): void => {
  const popup: HTMLElement | null = document.querySelector(`.c-popup.${type}`)
  if (popup !== null) {
    popup.style.display = 'flex'
  }

  const avatarForm = document.querySelector(`.c-popup.${type} #formAvatar`) as unknown as HTMLFormElement
  const avatarInput = document.querySelector(`.c-popup.${type} #avatar_${type}`) as unknown as HTMLFormElement
  const avatarFileName = document.querySelector(`.c-popup.${type} #avatarFileName_${type}`) as unknown as HTMLFormElement

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
}
