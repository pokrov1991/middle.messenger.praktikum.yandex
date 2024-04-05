import type Block from '../modules/block'

export async function loadBlockPage (pageName: string): Promise<Block> {
  let blockPage: Block
  let main: () => Promise<Block>
  let login: () => Promise<Block>
  let signin: () => Promise<Block>
  let profilePage: () => Promise<Block>
  let profileEdit: () => Promise<Block>
  let profilePassword: () => Promise<Block>
  let serverError: () => Promise<Block>
  let notFound: () => Promise<Block>

  switch (pageName) {
    case '/main':
      ({ main } = await import('../pages/main'))
      blockPage = await main()
      break
    case '/login':
    case '/':
    case '':
      ({ login } = await import('../pages/login'))
      blockPage = await login()
      break
    case '/signin':
      ({ signin } = await import('../pages/signin'))
      blockPage = await signin()
      break
    case '/profile':
      ({ profilePage } = await import('../pages/profile'))
      blockPage = await profilePage()
      break

    case '/profile-edit':
      ({ profileEdit } = await import('../pages/profile-edit'))
      blockPage = await profileEdit()
      break

    case '/profile-password':
      ({ profilePassword } = await import('../pages/profile-password'))
      blockPage = await profilePassword()
      break

    case '/server-error':
      ({ serverError } = await import('../pages/server-error'))
      blockPage = await serverError()
      break

    default:
      ({ notFound } = await import('../pages/not-found'))
      blockPage = await notFound()
      break
  }

  return blockPage
}
