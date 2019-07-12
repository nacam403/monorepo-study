import { configure, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

function loadStories() {
  const req = require.context('../src', true, /\.story\.tsx?$/)
  req.keys().forEach(story => req(story))
}

addDecorator(withKnobs)

configure(loadStories, module)
