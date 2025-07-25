import type { NextApiRequest, NextApiResponse } from 'next'
import { createUserWithProfile } from '@/lib/createUserWithProfile'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const result = await createUserWithProfile(req.body)
  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json({ error: result.error })
  }
}
