import { Model, ModelIdentifier, StorageValues, store } from "https://esm.sh/hybrids@8.2.15"
import { FirstStore, IFirst } from "./first.store.js"

let autoincrement = 2
const source = new Map<ModelIdentifier, StorageValues<ISecond>>([
    ["0", { id: "0", relatedModel: "1", creationDatetime: 1711120485090 }],
    ["1", { id: "1", color: "green", relatedModel: "0", creationDatetime: 1711120562192 }],
    ["2", { id: "2", color: "orange", creationDatetime: 1711120567576, relatedModels: ["1", "2"] }],
])

export interface ISecond {
    id: string
    color: string
    creationDatetime: number
    relatedModel?: IFirst
    relatedModels: IFirst[]
}

export const SecondStore: Model<ISecond> = {
    id: true,
    color: "Lorem ipsum.",
    relatedModel: FirstStore,
    relatedModels: [FirstStore],
    creationDatetime: NaN,
    [store.connect]: {
        list: () => [...source.values()],
        get: (id) => source.get(id) ?? null,
        set: async (id, values) => {
            let relatedModel
            if (values?.relatedModel) {
                const { id, ...modelValues } = values.relatedModel
                relatedModel = await store.set(FirstStore, modelValues)
            }

            let relatedModels
            if (values?.relatedModels) {
                relatedModels = await Promise.all<IFirst>(
                    values.relatedModels.map((model) => {
                        const { id, ...modelValues } = model
                        return store.set(FirstStore, modelValues)
                    })
                )
            }

            if (!id && values) {
                // create
                const newModelId = String(++autoincrement)
                source.set(newModelId, {
                    ...values,
                    id: newModelId,
                    creationDatetime: Number(new Date()),
                    relatedModel: relatedModel?.id,
                    relatedModels: relatedModels?.map((model) => model.id),
                })
                return source.get(newModelId) ?? null
            }

            if (id && values) {
                // update
                const lastSourceValue = source.get(id)
                if (!lastSourceValue) throw new Error()

                source.set(id, {
                    ...lastSourceValue,
                    ...values,
                    relatedModel: relatedModel?.id,
                    relatedModels: relatedModels?.map((model) => model.id),
                })

                const newValue = source.get(id)
                if (!newValue) throw new Error()
                return newValue
            }

            if (id && !values) {
                // delete
                source.delete(id)
                return source.get(id) ?? null
            }

            throw new Error()
        },
        loose: true,
    },
}
