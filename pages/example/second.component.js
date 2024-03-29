import { children, define, html, store } from 'https://esm.sh/hybrids@8.2.14';
import setProperty from './set-property.js';
import { SecondStore } from './second.store.js';
import firstComponet, { submit as submitFirstForm } from './first.componet.js';
function toggleEdit(host) {
    host.edit = !host.edit;
    if (host.edit)
        setProperty(host, 'draft', host.source);
}
async function submit(host) {
    const sourceId = (await store.submit(host.draft)).id;
    if (host.hold)
        host.sourceId = sourceId;
    const relatedModel = host.relatedModelForm && await submitFirstForm(host.relatedModelForm);
    await store.set(store.get(SecondStore, sourceId), { relatedModel });
    const relatedModels = await Promise.all(host.relatedModelsForm.map(form => submitFirstForm(form)));
    await store.set(store.get(SecondStore, sourceId), { relatedModels });
    toggleEdit(host);
    return host.source;
}
function clear(host) {
    if (!host.source)
        setProperty(host, 'draft', undefined);
    else
        store.set(host.draft, host.source);
}
function addRelatedModel() {
}
export default define({
    tag: 'second-component',
    sourceId: {
        set: (host, value) => {
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
    subModelsForms: children(firstComponet, { deep: true }),
    relatedModelForm: ({ subModelsForms }) => subModelsForms.find(component => component.hasAttribute("related-item")),
    relatedModelsForm: ({ subModelsForms }) => [...subModelsForms].filter(component => component.hasAttribute("related-list-item")),
    content: ({ sourceId, source, draft, edit, driven }) => html `
    <template layout="column gap">
        <div style="font-size: 0.75em; line-height: 1em; background-color: #000000b0; padding: 0 0 0 .5rem; display: flex; align-items: center;">
            <span style="flex-grow: 1;">second-model-form [${sourceId || ' '}]</span>

            ${edit ? html `
            <button
                class="aligned"
                type="button"
                onclick=${submit}
                disabled=${(source && store.pending(source)) || (!source && driven)}
            >Save</button>

            ${source && html `
            <button
                class="aligned"
                type="button"
                onclick=${toggleEdit}
            >Cancel</button>
            `}

            <button
                class="aligned"
                type="button"
                onclick=${clear}
                disabled=${source && store.pending(source)}
            >Clear</button>

            ` : html `
            <button
                class="aligned"
                type="button"
                onclick=${toggleEdit}
            >Edit</button>

            <button
                class="aligned"
                type="button"
                onclick=${html.set(source, null)}
                disabled=${source && store.pending(source)}
            >Delete</button>
            `}
        </div>

        ${edit ? html `
        <div style="padding: 0 .5rem .5rem;">
            <span><b>color:</b> <input value="${draft.color}" oninput="${html.set(draft, 'color')}" /></span>

            <details open style="margin: 1em 0;">
                <summary style="font-family: monospace;">(property) ISecond.relatedModel?: IFirst | undefined</summary>
                <ul style="margin: unset;">
                    <li><first-component related-item source-id=${draft.relatedModel?.id} hold driven></first-component></li>
                </ul>
            </details>

            <details open style="margin: 1em 0;">
                <summary style="font-family: monospace;">(property) ISecond.relatedModels: IFirst[]</summary>
                <ul style="margin: unset;">
                    ${draft.relatedModels.map(model => html `
                    <li>
                        <first-component style="flex-grow: 1;" related-list-item hold driven></first-component>

                        <button
                            style="display: block;margin-left: auto;margin-bottom: 1em;"
                            type="button"
                        >Delete item</button>
                    </li>
                    `.key(model.id))}

                    <li>
                        <first-component style="flex-grow: 1;" related-list-item hold driven></first-component>

                        <button
                            style="display: block;margin-left: auto;margin-bottom: 1em;"
                            type="button"
                        >Delete item</button>
                    </li>

                    <li>
                        <first-component style="flex-grow: 1;" related-list-item hold driven></first-component>

                        <button
                            style="display: block;margin-left: auto;margin-bottom: 1em;"
                            type="button"
                        >Delete item</button>
                    </li>

                    <li>
                        <button
                            type="button"
                            onclick=${addRelatedModel}
                            disabled=${source && store.pending(source)}
                        >Add related model</button>
                    </li>
                </ul>
            </details>
        </div>

        ` : html `
        <div style="padding: 0 .5rem .5rem;">
            <span><b>color:</b> ${source && store.ready(source) ? source.color : "---"}</span>

            ${source && store.ready(source) && source.relatedModel && html `
            <details open style="margin: 1em 0;">
                <summary style="font-family: monospace;">(property) ISecond.relatedModel?: IFirst | undefined</summary>
                <ul style="margin: unset;">
                    <li><first-component related-item source-id=${source.relatedModel.id} hold driven></first-component></li>
                </ul>
            </details>
            `}

            ${source && store.ready(source) && source.relatedModels.length > 0 && html `
            <details open style="margin: 1em 0;">
                <summary style="font-family: monospace;">(property) ISecond.relatedModels: IFirst[]</summary>
                <ul style="margin: unset;">
                    ${source.relatedModels.map(model => html `
                    <li><first-component related-list-item source-id=${model?.id} hold driven></first-component></li>
                    `.key(model.id))}
                </ul>
            </details>
            `}
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
