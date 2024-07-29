import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

async function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  auth().protect();
  const { userId } = await auth();

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  return (
    <div className="grid lg:grid-cols-2 h-full overflow-hidden">
      {/* Left - PdfView */}
      <div className="col-span-1 bg-gray-100 border-r-2 lg:border-indigo-600 overflow-auto">
        <PdfView url={url} />
      </div>
      
      {/* Right - Chat */}
      <div className="col-span-1 overflow-y-auto">
        <Chat id={id} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
