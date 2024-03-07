import './profile.scss'
import Handlebars from 'handlebars'
import { layoutProfile } from './../../layouts'
import { profile, profileItem } from './../../modules'
import { title } from './../../ui'

const layoutProfilePromise = await layoutProfile()
const LayoutProfile = layoutProfilePromise.LayoutProfile

const profilePromise = await profile()
const Profile = profilePromise.Profile
const profileItemPromise = await profileItem()
const ProfileItem = profileItemPromise.ProfileItem

const titlePromise = await title()
const Title = titlePromise.Title

Object.entries({ 
  LayoutProfile,
  Profile,
  ProfileItem,
  Title
}).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

export { default as Profile } from './profile.hbs?raw'