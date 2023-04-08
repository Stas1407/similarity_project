import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateAPIData } from "@/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nanoid } from 'nanoid'
import { z } from "zod";
import { withMethods } from "@/lib/api-middlewares/with-methods";

const handler = async (req: NextApiRequest, res: NextApiResponse<CreateAPIData>) => {
    try {
        const user = await getServerSession(req, res, authOptions).then((res) => res?.user)
        if(!user){
            return res.status(401).json({
                error: "Unauthorized to perform this action",
                createdAPIKey: null,
            })
        }
        
        // @ts-ignore
        const existingAPIKey = await db.APIKey.findFirst({ 
            where: { userId: user.id, enabled: true } 
        })

        if(existingAPIKey){
            return res.status(409).json({
                error: "API key already exists",
                createdAPIKey: null,
            })
        }

        // @ts-ignore
        const createdAPIKey = await db.APIKey.create({
            data: {
                userId: user.id,
                key: nanoid()
            }
        })

        return res.status(200).json({
            error: null,
            createdAPIKey
        })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({error: error.issues, createdAPIKey: null})
        }

        return res.status(500).json({
            error: 'Internal Server Error',
            createdAPIKey: null
        })
    }
}

export default withMethods(['GET'], handler);