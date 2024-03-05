window.inputFocus = (e, focus) => {
  const classFocus = 'c-input_focus'
  const isValue = e.value.length

  if (focus || isValue) {
    e.parentElement.classList.add(classFocus)
  } else {
    e.parentElement.classList.remove(classFocus)
  }
}