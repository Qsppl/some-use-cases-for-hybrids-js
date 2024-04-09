import { define, html, store } from "https://esm.sh/hybrids@8.2.15";
import setProperty from "./set-property.js";
import { SecondStore } from "./second.store.js";
function resetDraft(host) {
    if (!host.source)
        setProperty(host, "draft", undefined);
    else
        store.set(host.draft, host.source);
}
async function submit(host) {
    const related = host.draft.relatedModel && (await store.submit(host.draft.relatedModel));
    const source = await store.submit(host.draft);
    if (host.hold)
        host.source = source;
    resetDraft(host);
    host.edit = false;
}
function addRelated(model) {
    store.set(model, {
        relatedModels: [...model.relatedModels, {}],
    });
}
function deleteRelated(model, related) {
    store.set(model, {
        relatedModels: model.relatedModels.filter((model) => model !== related),
    });
}
export default define({
    tag: "second-component",
    source: store(SecondStore),
    draft: store(SecondStore, { draft: true }),
    edit: {
        get: (host, value) => !host.source || value,
        set: (host, value, lastValue) => value,
    },
    hold: false,
    connect: {
        value: undefined,
        connect: (host) => {
            resetDraft(host);
            store.set(host.draft, {
                relatedModel: {},
                relatedModels: [...host.draft.relatedModels, {}, {}],
            });
        },
    },
    content: ({ source, draft, edit }) => html `
        <template layout="column gap">
            <div class="header">
                <span class="header-placeholder">second-model-form [${source?.id}]</span>

                ${edit
        ? html `
                          <button class="aligned" type="button" onclick=${submit} disabled=${source && store.pending(source)}>Save</button>

                          ${source && html ` <button class="aligned" type="button" onclick=${html.set("edit", !edit)}>Cancel</button> `}

                          <button class="aligned" type="button" onclick=${resetDraft} disabled=${source && store.pending(source)}>Clear</button>
                      `
        : html `
                          <button class="aligned" type="button" onclick=${html.set("edit", !edit)}>Edit</button>

                          <button class="aligned" type="button" onclick=${html.set(source, null)} disabled=${source && store.pending(source)}>Delete</button>
                      `}
            </div>

            <div class="content">
                <span>
                    <b>color:</b>
                    ${edit
        ? html ` <input value="${draft.color}" oninput="${html.set(draft, "color")}" /> `
        : html ` ${source && store.ready(source) ? source.color : "---"} `}
                </span>
                <details open>
                    <summary>(property) ISecond.relatedModel?: IFirst | undefined</summary>
                    <ul>
                        ${edit
        ? html ` <li><first-component driven related-item draft=${draft.relatedModel} hold driven></first-component></li> `
        : source &&
            store.ready(source) &&
            source.relatedModel &&
            html ` <li><first-component driven related-item source=${source.relatedModel} hold driven></first-component></li> `}
                    </ul>
                </details>
                <details open>
                    <summary>(property) ISecond.relatedModels: IFirst[]</summary>
                    <ul>
                        ${edit
        ? html `
                                  ${draft.relatedModels.map((relatedDraft) => html `
                                          <li>
                                              <first-component driven draft=${relatedDraft} hold driven></first-component>

                                              <button type="button" class="align-right" onclick=${() => deleteRelated(draft, relatedDraft)}>Delete item</button>
                                          </li>
                                      `.key(relatedDraft))}

                                  <li>
                                      <button type="button" onclick=${() => addRelated(draft)} disabled=${source && store.pending(source)}>
                                          Add related model
                                      </button>
                                  </li>
                              `
        : source &&
            store.ready(source) &&
            source.relatedModels.length > 0 &&
            source.relatedModels.map((model) => html ` <li><first-component driven related-list-item source=${model} hold driven></first-component></li> `.key(model))}
                    </ul>
                </details>
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

        details {
            margin: 1em 0;
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

        ul {
            margin: unset;
        }

        li {
            margin-bottom: 1em;
        }

        .align-right {
            display: block;
            margin-left: auto;
        }
    `,
});
