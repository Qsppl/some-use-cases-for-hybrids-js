import { define, html, store } from 'https://esm.sh/hybrids@8.2.14'
import setProperty from './set-property.js'
import { FirstStore, IFirst } from './first.store.js'

function toggleEdit(host: IFirstComponent) {
    setProperty(host, 'draft', host.source)
    host.edit = true
}

async function submit(host: IFirstComponent) {
    const source = await store.submit(host.draft)
    store.clear([FirstStore])
    if (host.hold) host.sourceId = source.id
    setProperty(host, 'draft', undefined)
    host.edit = false
}

function clear(host: IFirstComponent) {
    if (!host.source) setProperty(host, 'draft', undefined)
    else store.set(host.draft, host.source)
}

export interface IFirstComponent extends HTMLElement {
    sourceId?: string
    source: undefined | IFirst
    draft: IFirst
    edit: boolean
    hold: boolean
    driven: boolean
}

export default define<IFirstComponent>({
    tag: 'first-component',
    sourceId: {
        set: (host, value: undefined | string, lastValue) => {
            if (value !== undefined) setProperty(host, 'draft', value)
            return value
        },
        get: (host, lastValue) => lastValue,
    },
    source: store(FirstStore, { id: 'sourceId' }),
    draft: store(FirstStore, { draft: true }),
    edit: {
        get: (host, value) => !host.source || value,
        set: (host, value) => value,
    },
    hold: false,
    driven: false,
    content: ({ sourceId, source, draft, edit, driven }) => html`
      <template layout="column gap">
          <span style="font-size: 0.75em; line-height: 1em; background-color: #000000b0; padding: 0 .5rem;">first-model-form [${sourceId || ' '}]</span>
          ${edit ? html`
          <div style="padding: 0 .5rem .5rem;">
              <input value="${draft.content}" oninput="${html.set(draft, 'content')}" />
              <button
                  type="button"
                  onclick=${submit}
                  disabled=${(source && store.pending(source)) || (!source && driven)
            }
              >Save</button>
              <button
                  type="button"
                  onclick=${clear}
                  disabled=${source && store.pending(source)}
              >Clear</button>
          </div>
          ` : html`
          <div style="padding: 0 .5rem .5rem;">
              ${source && store.ready(source) && html`
              <span>${source.content}</span>
              `}
              <button type="button" onclick="${toggleEdit}">Edit</button>
          </div>
          `}
      </template>
`,
})
