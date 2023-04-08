'use client'

import { FC, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/DropdownMenu'
import Button from '@/ui/Button'
import { Loader2 } from 'lucide-react'
import { toast } from './ui/Toast'
import { createAPIKey } from '@/helpers/create-api-key'
import { useRouter } from 'next/navigation'
import { revokeAPIKey } from '@/helpers/revoke-api-key'

interface APIKeyOptionsProps {
    APIKeyId: string
    APIKeyKey: string
}

const APIKeyOptions: FC<APIKeyOptionsProps> = ({ APIKeyId, APIKeyKey }) => {
    const [isCreatingNew, setisCreatingNew] = useState<boolean>(false)
    const [isRevoking, setisRevoking] = useState<boolean>(false)
    const router = useRouter()

    const createNewAPIKey = async () => {
        setisCreatingNew(true)

        try {
            await revokeAPIKey({ keyId: APIKeyId })
            await createAPIKey()
            router.refresh()
        } catch (error) {
            toast({
                title: 'Error creating API key',
                message: 'Please try again later',
                type: 'error'
            })
        } finally {
            setisCreatingNew(false)
        }
    }

    const revokeCurrentAPIKey = async () => {
        setisRevoking(true)

        try {
            await revokeAPIKey({ keyId: APIKeyId })
            router.refresh()
        } catch (error) {
            toast({
                title: 'Error revoking API key',
                message: 'Please try again later',
                type: 'error'
            })
        } finally {
            setisRevoking(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={isCreatingNew || isRevoking} asChild>
                <Button variant='ghost' className='flex gap-2 items-center'>
                    <p>
                        {isCreatingNew ? 'Creating new key' : isRevoking ? 'Revoking key' : 'Options'}
                    </p>
                    {isCreatingNew || isRevoking ? (
                        <Loader2 className='animate-spin h-4 w-4' />
                    ) : null}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(APIKeyKey)

                    toast({
                        title: 'Copied',
                        message: 'API Key copied to clipboard',
                        type: 'success'
                    })
                }}>Copy</DropdownMenuItem>
                <DropdownMenuItem onClick={createNewAPIKey}>
                    Create new key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={revokeCurrentAPIKey}>
                    Revoke key
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default APIKeyOptions