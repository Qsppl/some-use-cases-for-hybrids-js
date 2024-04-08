import { define, html, store } from "https://esm.sh/hybrids@8.2.15";
import setProperty from "./set-property.js";
import { FirstStore } from "./first.store.js";
function toggleEdit(host) {
    host.edit = !host.edit;
    if (host.edit)
        setProperty(host, "draft", host.source);
}
export async function submit(host) {
    const source = await store.submit(host.draft);
    if (host.hold)
        host.sourceId = source.id;
    toggleEdit(host);
    return source;
}
export function clear(host) {
    if (!host.source)
        setProperty(host, "draft", undefined);
    else
        store.set(host.draft, host.source);
}
export default define({
    tag: "first-component",
    sourceId: {
        set: (host, value) => {
            if (value !== undefined)
                setProperty(host, "draft", value);
            return value;
        },
        get: (host, lastValue) => lastValue,
    },
    source: store(FirstStore, { id: "sourceId" }),
    draft: store(FirstStore, { draft: true }),
    edit: {
        get: (host, value) => !host.source || value,
        set: (host, value) => value,
    },
    hold: false,
    driven: false,
    content: ({ sourceId, source, draft, edit, driven }) => html `
        <template layout="column gap">
            <div style="font-size: 0.75em; line-height: 1em; background-color: #000000b0; padding: 0 0 0 .5rem; display: flex; align-items: center;">
                <span style="flex-grow: 1;">first-model-form [${sourceId || " "}]</span>

                ${edit
        ? html `
                          <button class="aligned" type="button" onclick=${submit} disabled=${(source && store.pending(source)) || (!source && driven)}>
                              Save
                          </button>

                          ${source && html ` <button class="aligned" type="button" onclick=${toggleEdit}>Cancel</button> `}

                          <button class="aligned" type="button" onclick=${clear} disabled=${source && store.pending(source)}>Clear</button>
                      `
        : html `
                          <button class="aligned" type="button" onclick=${toggleEdit}>Edit</button>

                          <button class="aligned" type="button" onclick=${html.set(source, null)} disabled=${source && store.pending(source)}>Delete</button>
                      `}
            </div>

            ${edit
        ? html `
                      <div style="padding: 0 .5rem .5rem;">
                          <span><b>content:</b> <input value="${draft.content}" oninput="${html.set(draft, "content")}" /></span>
                      </div>
                  `
        : html `
                      <div style="padding: 0 .5rem .5rem;">
                          ${source && store.ready(source) && html ` <span><b>content:</b> ${source && store.ready(source) ? source.content : "---"}</span> `}
                      </div>
                  `}
        </template>
    `.css `
        button.aligned {
            font-family: monospace;
            box-sizing: content-box;
            width: 6ch;
        }
    `,
});
