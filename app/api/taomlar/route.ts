import { taomlarniOl } from "@/lib/services/taomlar";

export async function GET() {
  const taomlar = await taomlarniOl();
  return Response.json({ taomlar });
}
