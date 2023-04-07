import { CreateAPIData } from "@/types/api"

export async function createAPIKey() {
    const res = await fetch('/api/api-key/create')
    const data = (await res.json()) as CreateAPIData

    if(data.error || !data.createdAPIKey) {
        if(data.error instanceof Array) {
            throw new Error(data.error.join(' '))
        }

        throw new Error(data.error ?? 'Something went wrong')
    }

    return data.createdAPIKey.key
}