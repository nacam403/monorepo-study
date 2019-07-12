import { configure, addParameters, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

function loadStories() {
  const req = require.context('../src', true, /\.story\.tsx?$/)
  req.keys().forEach(story => req(story))
}

addDecorator(withKnobs)

addParameters({
  backgrounds: [
    { name: 'gray', value: '#888888', default: true },
    { name: 'white', value: '#ffffff' },
    { name: 'black', value: '#000000' },
  ],
})

configure(loadStories, module)
