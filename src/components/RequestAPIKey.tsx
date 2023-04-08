'use client'

import { createAPIKey } from '@/helpers/create-api-key'
import { Key } from 'lucide-react'
import { FC, FormEvent, useState } from 'react'
import LargeHeading from '@/ui/LargeHeading'
import { toast } from '@/ui/Toast'
import Paragraph from '@/ui/Paragraph'
import CopyButton from '@/components/CopyButton'
import { Input } from '@/ui/Input'
import Button from '@/ui/Button'

const RequestAPIKey: FC = ({ }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [APIKey, setAPIKey] = useState<string | null>(null)

    const createNewAPIKey = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsCreating(true)

        try {
            const generateAPIKey = await createAPIKey()
            setAPIKey(generateAPIKey)
        } catch (err) {
            if (err instanceof Error) {
                toast({
                    title: "Error",
                    message: err.message,
                    type: "error"
                })
                return
            }
            toast({
                title: "Error",
                message: "Something went wrong.",
                type: "error"
            })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className='container md:max-w-2xl'>
            <div className='flex flex-col gap-6 items-center'>
                <Key className='mx-auto h-16 w-16 text-gray-400' />
                <LargeHeading className='ml-8'> Request your API Key</LargeHeading>
                <Paragraph>You haven&apos;t requested an API key yet.</Paragraph>
            </div>
            
            <form
                onSubmit={createNewAPIKey}
                className='mt-6 sm:flex sm:items-center'
                action='#'
            >
                <div className='relative rounded-md shadow-md sm:min-w-0 sm:flex-1'>
                    {APIKey ? (
                        <CopyButton valueToCopy={APIKey} className="absolute inset-y-0 right-0 animate-in fade-in duration-300" />
                    ) : null}
                    <Input readOnly value={APIKey ?? ''} placeholder='Request an API Key to display it here.'/>
                </div>
                <div className='mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0'>
                    <Button disabled={!!APIKey} isLoading={isCreating}>Request a key</Button>
                </div>
            </form>
        </div>
    )
}

export default RequestAPIKey