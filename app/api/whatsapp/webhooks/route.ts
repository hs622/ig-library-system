import { NextRequest } from "next/server";



export default async function GET(request: NextRequest) {

  const body = await request.json()
  console.log(body)
  console.log(request.headers)

  return
}