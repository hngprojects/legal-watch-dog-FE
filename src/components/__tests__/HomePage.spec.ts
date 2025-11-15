import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomePage from '../../screens/HomePage.vue'

describe('HomePage', () => {
  it('renders properly', () => {
    const wrapper = mount(HomePage, { props: { msg: 'AI present' } })
    expect(wrapper.text()).toContain('AI')
  })
})
