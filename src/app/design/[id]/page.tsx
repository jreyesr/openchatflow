import { prisma } from "@/lib/prisma";

import Editor from "@/components/Editor";
import { updateConversationTemplate } from "../actions";

type Props = {
  params: { id: string };
};

export default async function Design({ params }: Props) {
  const id = parseInt(params.id);

  const { flow } = await prisma.conversationTemplate.findUniqueOrThrow({
    where: { id },
  });

  async function onSave(data: { nodes: any[]; edges: any[] }) {
    "use server";
    updateConversationTemplate(id, data);
  }

  return (
    <div className="flex" style={{ height: "75vh" }}>
      <Editor
        flowId={id.toString()}
        initialNodes={(flow as any).nodes}
        initialEdges={(flow as any).edges}
        save={onSave}
      />
    </div>
  );
}
