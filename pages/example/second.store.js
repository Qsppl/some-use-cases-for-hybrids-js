import { store } from "https://esm.sh/hybrids@8.2.15";
import { FirstStore } from "./first.store.js";
let autoincrement = 2;
const source = new Map([
    ["0", { id: "0", relatedModel: "1", creationDatetime: 1711120485090 }],
    ["1", { id: "1", color: "green", relatedModel: "0", creationDatetime: 1711120562192 }],
    ["2", { id: "2", color: "orange", creationDatetime: 1711120567576, relatedModels: ["1", "2"] }],
]);
export const SecondStore = {
    id: true,
    color: "Lorem ipsum.",
    relatedModel: FirstStore,
    relatedModels: [FirstStore],
    creationDatetime: NaN,
    [store.connect]: {
        list: () => [...source.values()],
        get: (id) => source.get(id) ?? null,
        set: (id, values) => {
            if (!id && values) {
                // create
                const newModelId = String(++autoincrement);
                source.set(newModelId, {
                    ...values,
                    id: newModelId,
                    creationDatetime: Number(new Date()),
                });
                return source.get(newModelId) ?? null;
            }
            if (id && values) {
                // update
                const lastSourceValue = source.get(id);
                if (!lastSourceValue)
                    throw new Error();
                source.set(id, { ...lastSourceValue, ...values });
                const newValue = source.get(id);
                if (!newValue)
                    throw new Error();
                return newValue;
            }
            if (id && !values) {
                // delete
                source.delete(id);
                return source.get(id) ?? null;
            }
            throw new Error();
        },
        loose: true,
    },
};
