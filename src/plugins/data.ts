import { Plugin } from '@nuxt/types'
import data from '~/assets/data/data.json'

const dataInjection: Plugin = (_, inject) => {
  inject('amciData', data)
}

export default dataInjection
