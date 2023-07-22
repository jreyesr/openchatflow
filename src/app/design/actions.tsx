"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { convertToConfig } from "@/components/nodes/converter";

export async function createConversationTemplate(data: FormData) {
  const title = data.get("name") as string;
  const description = data.get("description") as string;

  const newObj = await prisma.conversationTemplate.create({
    data: {
      title,
      description,
      flow: { nodes: [], edges: [] },
    },
    select: { id: true },
  });

  revalidatePath("/design");
  redirect(`/design/${newObj.id}`);
}

export async function updateConversationTemplate(
  id: number,
  data: { nodes: any[]; edges: any[] }
) {
  let newConfig;

  // only if nodes exist
  if (data.nodes.length > 0) {
    // Force lose type information, TS gets angry otherwise
    newConfig = convertToConfig(id.toString(), data.nodes, data.edges) as any;
  } else {
    newConfig = {};
  }

  await prisma.conversationTemplate.update({
    where: { id },
    data: {
      flow: data,
      machineConfig: newConfig,
    },
    select: { id: true },
  });
}
