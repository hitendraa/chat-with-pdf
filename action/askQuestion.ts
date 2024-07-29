"use server"

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
    auth().protect();
    const { userId } = await auth();


    const chatRef = adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .collection("chat");

    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter(
        (doc) => doc.data().role === "human"
    )

    const userMessage: Message  = {
        role: "Human",
        message: question,
        createdAt: new Date(),
    }

    await chatRef.add(userMessage);

    const reply = await generateLangchainCompletion(id, question);

    const aiMessage: Message = {
        role: "Ai",
        message: reply,
        createdAt: new Date(),
    }

    await chatRef.add(aiMessage);

    return { success: true, message: null }
}