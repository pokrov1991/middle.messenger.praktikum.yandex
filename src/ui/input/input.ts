window.inputFocus = (e: { value: string | any[], parentElement: { classList: { add: (arg0: string) => void, remove: (arg0: string) => void } } }, focus: any) => {
  const classFocus = 'c-input_focus'
  const isValue = e.value.length

  if ((Boolean(focus)) || (isValue !== 0)) {
    e.parentElement.classList.add(classFocus)
  } else {
    e.parentElement.classList.remove(classFocus)
  }
}
