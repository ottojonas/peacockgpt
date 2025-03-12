import { NextApiRequest, NextApiResponse } from "next";
import { getProviders } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Providers endpoint called") 
  try {
    const providers = await getProviders(); 
    console.log("Providers: ", providers)
    if (providers) {
      res.status(200).json(providers)
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    console.error("Error fetching providers: ", error);
    res.status(500).json({ error: "Failed to fetch providers" })
  }
}
