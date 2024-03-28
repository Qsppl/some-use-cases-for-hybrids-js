import { define, html, store } from 'https://esm.sh/hybrids@8.2.14';
import setProperty from './set-property.js';
import { SecondStore } from './second.store.js';
function toggleEdit(host) {
    setProperty(host, 'draft', host.source);
    host.edit = true;
}
async function submit(host) {
    const source = await store.submit(host.draft);
    store.clear([SecondStore]);
    if (host.hold)
        host.sourceId = source.id;
    setProperty(host, 'draft', undefined);
    host.edit = false;
}
function clear(host) {
    setProperty(host, 'draft', host.source);
}
export default define({
    tag: 'second-component',
    sourceId: {
        set: (host, value, lastValue) => {
            if (value !== undefined)
                setProperty(host, 'draft', value);
            return value;
        },
        get: (host, lastValue) => lastValue,
    },
    source: store(SecondStore, { id: 'sourceId' }),
    draft: store(SecondStore, { draft: true }),
    edit: {
        get: (host, value) => !host.source || value,
        set: (host, value) => value,
    },
    hold: false,
    driven: false,
    content: ({ sourceId, source, draft, edit, driven }) => html `
      <template layout="column gap">
          <span style="font-size: 0.75em; line-height: 1em; background-color: #000000b0; padding: 0 .5rem;">second-model-form [${sourceId || ' '}]</span>
          ${edit ? html `
          <div style="padding: 0 .5rem .5rem;">
              <input value="${draft.color}" oninput="${html.set(draft, 'color')}" />
              <button
                  type="button"
                  onclick=${submit}
                  disabled=${(source && store.pending(source)) || (!source && driven)}
              >Save</button>
              <button
                  type="button"
                  onclick=${clear}
                  disabled=${source && store.pending(source)}
              >Clear</button>
              <first-component source-id=${draft.related?.id} hold driven></first-component>
          </div>
          ` : html `
          <div style="padding: 0 .5rem .5rem;">
              ${source && store.ready(source) && html `
              <span>${source.color}</span>
              `}
              <button type="button" onclick="${toggleEdit}">Edit</button>
              ${source && store.ready(source) && source.related && html `
              <first-component source-id=${source.related.id} hold driven></first-component>
              `}
          </div>
          `}
      </template>
`,
});
