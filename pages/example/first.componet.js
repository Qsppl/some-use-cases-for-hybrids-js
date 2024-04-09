import { define, html, store } from "https://esm.sh/hybrids@8.2.15";
import setProperty from "./set-property.js";
import { FirstStore } from "./first.store.js";
function resetDraft(host) {
    if (!host.source)
        setProperty(host, "draft", undefined);
    else
        store.set(host.draft, host.source);
}
export async function submit(host) {
    const source = await store.submit(host.draft);
    if (host.hold)
        host.source = source;
    host.edit = false;
    resetDraft(host);
    return source;
}
export default define({
    tag: "first-component",
    source: store(FirstStore),
    draft: store(FirstStore, { draft: true }),
    edit: {
        get: (host, value) => !host.source || value,
        set: (host, value, lastValue) => {
            if (value !== lastValue)
                resetDraft(host);
            return value;
        },
    },
    hold: false,
    driven: false,
    connect: {
        value: undefined,
        connect: (host) => {
            if (!host.source)
                setProperty(host, "draft", undefined);
            else
                store.set(host.draft, host.source);
        },
    },
    content: ({ source, draft, edit, driven }) => html `
        <template layout="column gap">
            <div class="header">
                <span class="header-placeholder">first-model-form [${source?.id || " "}]</span>

                ${edit
        ? html `
                          <button class="aligned" type="button" onclick=${submit} disabled=${(source && store.pending(source)) || (!source && driven)}>
                              Save
                          </button>

                          ${source && html ` <button class="aligned" type="button" onclick=${html.set("edit", false)}>Cancel</button> `}

                          <button class="aligned" type="button" onclick=${resetDraft} disabled=${source && store.pending(source)}>Clear</button>
                      `
        : html `
                          <button class="aligned" type="button" onclick=${html.set("edit", true)}>Edit</button>

                          <button class="aligned" type="button" onclick=${html.set(source, null)} disabled=${source && store.pending(source)}>Delete</button>
                      `}
            </div>

            <div class="content">
                <span>
                    <b>content:</b>
                    ${edit && html ` <input value=${draft.content} disabled=${store.pending(draft)} oninput="${html.set(draft, "content")}" /> `}
                    ${!edit && ((source && store.ready(source) && source.content) || "---")}
                </span>
            </div>
        </template>
    `.css `
        .header {
            font-size: 0.75em;
            line-height: 1em;
            background-color: #000000b0;
            padding: 0 0 0 .5rem;
            display: flex;
            align-items: center;
        }

        .header-placeholder {
            flex-grow: 1;
        }

        .content {
            padding: 0 .5rem .5rem;
        }


        summary,
        .header,
        button {
            font-family: monospace;
        }

        .aligned {
            box-sizing: content-box;
            width: 6ch;
        }
    `,
});
