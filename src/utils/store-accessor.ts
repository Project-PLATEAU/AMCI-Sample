/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import EventStore from '~/store/event'

let eventStore: EventStore
function initialiseStores(store: Store<any>): void {
  eventStore = getModule(EventStore, store)
}

export { initialiseStores, eventStore }
