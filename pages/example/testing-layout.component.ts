import { define, html, store } from 'https://esm.sh/hybrids@8.2.14'
import { FirstStore, IFirst } from './first.store.js'
import { ISecond, SecondStore } from './second.store.js'
import './first.componet.js'
import './second.component.js'

interface ITestingLayoutComponent extends HTMLElement {
    firstModels: IFirst[]
    secondModels: ISecond[]
    lastCreatedFirstModel: undefined | false | IFirst
}

export default define<ITestingLayoutComponent>({
    tag: 'testing-layout',
    firstModels: store([FirstStore], { loose: true }),
    secondModels: store([SecondStore], { loose: true }),
    lastCreatedFirstModel: ({ firstModels }) => store.ready(...firstModels) && [...firstModels].sort((a, b) => a.creationDatetime - b.creationDatetime).pop(),
    content: ({ firstModels, secondModels, lastCreatedFirstModel }) => html`
        <h2>First Model <code style="display: inline-block;"> { content: string, creationDatetime: number } </code></h2>

        <div style="display: flex; flex-direction: row;">
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>creation of new IFirst</h3>
                <first-component></first-component>

                <h3>create model in this place</h3>
                <first-component hold></first-component>
            </div>
            <div style="flex-basis: 33.33%; border-right: solid gray 2px; padding: 1em;">
                <h3>IFirst list:</h3>
                ${store.ready(...firstModels) && firstModels.map((model) => html`
                <first-component source-id=${model.id}></first-component>
                `.key(model.id))}
            </div>
            <div style="flex-basis: 33.33%; padding: 1em;">
                <h3>first option for displaying the last added model:</h3>
                <code>
                    <span>lastCreatedFirstModel && html&#96;</span><br>
                    <span>${'<first-component source-id=${lastCreatedFirstModel.id}></first-component>'}</span><br>
                    <span>&#96;.key(lastCreatedFirstModel.id)</span>
                </code>
                ${lastCreatedFirstModel && html`
                <first-component source-id=${lastCreatedFirstModel.id}></first-component>
                `.key(lastCreatedFirstModel.id)}

                <h3>second option for displaying the last added model:</h3>
                <code>
                    <span>lastCreatedFirstModel && [lastCreatedFirstModel].map(model => html&#96;</span><br>
                    <span>${'<first-component source-id=${model.id}></first-component>'}</span><br>
                    <span>&#96;.key(model.id))</span>
                </code>
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
                <h3>models list:</h3>
                ${store.ready(...secondModels) && secondModels.map((model) => html`
                <second-component source-id=${model.id}></second-component>
                `.key(model.id))}
            </div>
            <div style="flex-basis: 33.33%; padding: 1em;">
                <h3>first option for displaying the last added model:</h3>
                <code>
                    <span>lastCreatedFirstModel && html&#96;</span><br>
                    <span>${'<first-component source-id=${lastCreatedFirstModel.id}></first-component>'}</span><br>
                    <span>&#96;.key(lastCreatedFirstModel.id)</span>
                </code>
                ${lastCreatedFirstModel && html`
                <second-component source-id=${lastCreatedFirstModel.id}></second-component>
                `.key(lastCreatedFirstModel.id)}

                <h3>second option for displaying the last added model:</h3>
                <code>
                    <span>lastCreatedFirstModel && [lastCreatedFirstModel].map(model => html&#96;</span><br>
                    <span>${'<first-component source-id=${model.id}></first-component>'}</span><br>
                    <span>&#96;.key(model.id))</span>
                </code>
                ${lastCreatedFirstModel && [lastCreatedFirstModel].map((model) => html`
                <second-component source-id=${model.id}></second-component>
                `.key(model.id))}
            </div>
        </div>
    `.css`
        first-component,
        second-component {
            width: fit-content;
            margin: 0.5em 0;
            background-color: #ffffff20;
        }
    `,
})
