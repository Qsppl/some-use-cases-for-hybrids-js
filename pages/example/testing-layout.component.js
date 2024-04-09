import { define, html, store } from "https://esm.sh/hybrids@8.2.15";
import { FirstStore } from "./first.store.js";
import { SecondStore } from "./second.store.js";
import "./first.componet.js";
import "./second.component.js";
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/components/divider/divider.js";
export default define({
    tag: "testing-layout",
    firstModels: store([FirstStore], { loose: true }),
    lastCreatedFirstModel: ({ firstModels }) => store.ready(...firstModels) && [...firstModels].sort((a, b) => a.creationDatetime - b.creationDatetime).pop(),
    secondModels: store([SecondStore], { loose: true }),
    lastCreatedSecondModel: ({ secondModels }) => store.ready(...secondModels) && [...secondModels].sort((a, b) => a.creationDatetime - b.creationDatetime).pop(),
    content: ({ firstModels, secondModels, lastCreatedFirstModel, lastCreatedSecondModel }) => html `
        <h2>First Model <code> { content: string, creationDatetime: number } </code></h2>

        <div class="container">
            <div>
                <h3>creation of new IFirst</h3>
                <first-component></first-component>

                <h3>create model in this place</h3>
                <first-component hold></first-component>
            </div>

            <sl-divider vertical></sl-divider>

            <div>
                <h3>IFirst list</h3>
                ${store.ready(...firstModels) && firstModels.map((model) => html ` <first-component source=${model}></first-component> `.key(model))}
            </div>

            <sl-divider vertical></sl-divider>

            <div>
                <h3>last added model</h3>
                ${lastCreatedFirstModel && [lastCreatedFirstModel].map((model) => html ` <first-component source=${model}></first-component> `.key(model))}
            </div>
        </div>

        <h2>Second Model <code> { related: IFirst, creationDatetime: number } </code></h2>

        <div class="container">
            <div>
                <h3>creation of new models</h3>
                <second-component></second-component>

                <h3>create model in this place</h3>
                <second-component hold></second-component>
            </div>

            <sl-divider vertical></sl-divider>

            <div>
                <h3>models list</h3>
                ${store.ready(...secondModels) && secondModels.map((model) => html ` <second-component source=${model}></second-component> `.key(model))}
            </div>

            <sl-divider vertical></sl-divider>

            <div>
                <h3>last added model</h3>
                ${lastCreatedSecondModel && [lastCreatedSecondModel].map((model) => html ` <second-component source=${model}></second-component> `.key(model))}
            </div>
        </div>
    `.css `
        first-component,
        second-component {
            margin: 0.5em 0;
            background-color: #ffffff20;
        }

        .container {
            display: flex; flex-direction: row;
        }

        .container > div {
            flex-basis: 33.33%;
            padding: 1em;
        }

        code {
            display: inline-block;
        }
    `,
});
