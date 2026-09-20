import { taomniOl } from "@/lib/services/taomlar";

export async function GET(
  _sorov: Request,
  kontekst: RouteContext<"/api/taomlar/[id]">,
) {
  const { id } = await kontekst.params;
  const taom = await taomniOl(id);

  if (!taom) {
    return Response.json({ xato: "Taom topilmadi" }, { status: 404 });
  }

  return Response.json({ taom });
}
