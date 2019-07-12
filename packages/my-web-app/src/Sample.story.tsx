import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
// @ts-ignore
import { Button } from '@storybook/react/demo'

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked.')}>
      {text('Label', 'Hello Storybook')}
    </Button>
  ))
  .add('with emoji', () => (
    <Button onClick={action('clicked.')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ))
