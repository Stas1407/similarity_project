import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { APIKey } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { formatDistance } from 'date-fns'
import LargeHeading from '@/ui/LargeHeading'
import Paragraph from '@/ui/Paragraph'
import { Input } from '@/ui/Input'
import Table from '@/components/Table'
import APIKeyOptions from '@/components/APIKeyOptions'

const APIDashboard = async () => {
  const user = await getServerSession(authOptions)
  if (!user) notFound()

  // @ts-ignore
  const APIKeys = await db.APIKey.findMany({
    where: { userId: user.user.id }
  })

  const activeAPIKey = APIKeys.find((APIKey: APIKey) => APIKey.enabled)

  if (!activeAPIKey) notFound()

  const userRequests = await db.aPIRequest.findMany({
    where: {
      APIKeyId: {
        in: APIKeys.map((key: APIKey) => key.id)
      }
    }
  })

  const serializableRequests = userRequests.map((req) => ({
    ...req,
    timestamp: formatDistance(new Date(req.timestamp), new Date()),
  }))

  return (
    <div className='container flex flex-col gap-6'>
      <LargeHeading>Welcome back, {user.user.name}</LargeHeading>
      <div className='flex flex-col md:flex-row gap-4 justify-center lg:justify-start items-center'>
        <Paragraph>Your API key: </Paragraph>
        <Input className="truncate" style={{width: `min(${activeAPIKey.key.length+3}ch, 90%)`}} readOnly value={activeAPIKey.key} />
        <APIKeyOptions APIKeyId={activeAPIKey.id} APIKeyKey={activeAPIKey.key}/>
      </div>
      <Paragraph className='text-center lg:text-left mt-4 mb-4'>Your API history:</Paragraph>

      <Table userRequests={serializableRequests}/>
    </div>
  )
}

export default APIDashboard