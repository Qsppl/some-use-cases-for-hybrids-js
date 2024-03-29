import { define, html, store } from 'https://esm.sh/hybrids@8.2.14'
import { FirstStore, IFirst } from './first.store.js'
import { ISecond, SecondStore } from './second.store.js'
import './first.componet.js'
import './second.component.js'

interface ITestingLayoutComponent extends HTMLElement {
    firstModels: IFirst[]
    lastCreatedFirstModel: undefined | false | IFirst
    secondModels: ISecond[]
    lastCreatedSecondModel: undefined | false | ISecond
}

export default define<ITestingLayoutComponent>({
    tag: 'testing-layout',
    firstModels: store([FirstStore], { loose: true }),
    lastCreatedFirstModel: ({ firstModels }) => store.ready(...firstModels) && [...firstModels].sort((a, b) => a.creationDatetime - b.creationDatetime).pop(),
    secondModels: store([SecondStore], { loose: true }),
    lastCreatedSecondModel: ({ secondModels }) => store.ready(...secondModels) && [...secondModels].sort((a, b) => a.creationDatetime - b.creationDatetime).pop(),
    content: ({ firstModels, secondModels, lastCreatedFirstModel, lastCreatedSecondModel }) => html`
        <h2>First Model <code style="display: inline-block;"> { content: string, creationDatetime: number } </code></h2>

        <div style="display: flex; flex-direction: row;">
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>creation of new IFirst</h3>
                <first-component></first-component>

                <h3>create model in this place</h3>
                <first-component hold></first-component>
            </div>
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>IFirst list</h3>
                ${store.ready(...firstModels) && firstModels.map((model) => html`
                <first-component source-id=${model.id}></first-component>
                `.key(model.id))}
            </div>
            <div style="flex-basis: 33.33%; padding: 1em;">
                <h3>last added model</h3>
                ${lastCreatedFirstModel && [lastCreatedFirstModel].map((model) => html`
                <first-component source-id=${model.id}></first-component>
                `.key(model.id))}
            </div>
        </div>

        <h2>Second Model <code style="display: inline-block;"> { related: IFirst, creationDatetime: number } </code></h2>

        <div style="display: flex; flex-direction: row;">
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>creation of new models</h3>
                <second-component></second-component>

                <h3>create model in this place</h3>
                <second-component hold></second-component>
            </div>
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>models list</h3>
                ${store.ready(...secondModels) && secondModels.map((model) => html`
                <second-component source-id=${model.id}></second-component>
                `.key(model))}
            </div>
            <div style="flex-basis: 33.33%; padding: 1em;">
                <h3>last added model</h3>
                ${lastCreatedSecondModel && [lastCreatedSecondModel].map((model) => html`
                <second-component source-id=${model.id}></second-component>
                `.key(model))}
            </div>
        </div>
    `.css`
        first-component,
        second-component {
            margin: 0.5em 0;
            background-color: #ffffff20;
        }
    `,
})
