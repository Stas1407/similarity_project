import { APIKey } from '@prisma/client'
import {type ZodIssue} from 'zod'

export interface CreateAPIData {
    error: string | ZodIssue[] | null
    createdAPIKey: APIKey | null
}

export interface RevokeAPIData {
    error: string | ZodIssue[] | null
    success: boolean
}