import { store } from 'https://esm.sh/hybrids@8.2.14';
let autoincrement = 2;
const source = new Map([
    ["0", { id: '0', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', creationDatetime: 1711014498391 }],
    ["1", { id: '1', creationDatetime: 1711014651455 }],
    ["2", { id: '2', content: 'Nulla ultricies enim dui, quis semper massa elementum ac.', creationDatetime: 1711014682503 }],
]);
export const FirstStore = {
    id: true,
    content: 'Lorem ipsum dolor.',
    creationDatetime: NaN,
    [store.connect]: {
        list: () => [...source.values()],
        get: (id) => source.get(id) ?? null,
        set: (id, values) => {
            if (!id && values) { // create
                const newModelId = String(++autoincrement);
                source.set(newModelId, {
                    ...values,
                    id: newModelId,
                    creationDatetime: Number(new Date)
                });
                return source.get(newModelId) ?? null;
            }
            if (id && values) { // update
                const lastSourceValue = source.get(id);
                if (!lastSourceValue)
                    throw new Error();
                source.set(id, { ...lastSourceValue, ...values });
                const newValue = source.get(id);
                if (!newValue)
                    throw new Error();
                return newValue;
            }
            if (id && !values) { // delete
                source.delete(id);
                return source.get(id) ?? null;
            }
            throw new Error();
        },
        loose: true,
    },
};
