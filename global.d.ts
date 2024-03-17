declare module '*.hbs?raw' {
  const content: string;
  export default content;
}

interface Window {
  onChatShow: (event: any) => void;
  dataChatSelected: any;
  dataChatList: any;
  isChatSelected: any;
  inputFocus: any;
  toRoute: any;
  onPasswordValidate: any;
  onEmailValidate: any;
}
