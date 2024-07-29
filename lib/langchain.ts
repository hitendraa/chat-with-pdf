import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = "hitendra";

async function fetchMessageFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User Not Found");
  }

  console.log("--- Fetching Chat history from Firebase... ---");
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .get();

  const chatHistory = chats.docs.map((doc) => {
    return doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message);
  });

  console.log(`---Last ${chatHistory.length} messages fetched ---`);
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth(); // Corrected

  if (!userId) {
    throw new Error("User Not Found");
  }

  console.log("--- Fetching Download URL from Firebase... ---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  const downloadUrl = firebaseRef.docs.map((doc) => doc.data().downloadUrl)[0];

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

  const response = await fetch(downloadUrl);
  const data = await response.blob();

  console.log("---Loading PDF Document... ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  console.log("---Splitting the document into smaller chunks... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- ${splitDocs.length} documents generated ---`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No Namespace value provided");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth(); // Corrected

  if (!userId) {
    throw new Error("User Not Found");
  }

  let pineconeVectorStore;

  console.log("--- Generating Embeddings for the split documents... ---");
  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reusing existing embeddings... ---`
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing embeddings in ${indexName} Pinecone Vector Store with namespace ${docId} ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);

  console.log("--- GCreating a retriever... ---");

  if (!pineconeVectorStore) {
    throw new Error("Pinecone Vector Store not found");
  }

  console.log("--- Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever();

  const chatHistory = await fetchMessageFromDB(docId);

  console.log("--- Defining a prompt template ... ---");
  const historyAwareprompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  console.log("--- Creating a retrieval chain... ---");

  const historyAwareRetrievalChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwareprompt,
  });

  console.log("---Drafting a prompt for asking a question... ---");
  const historyAwareRetrievalprompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's question based on the below context: \n\n {context}",
    ],

    ...chatHistory,
    ["user", "{input}"],
  ]);

  console.log("---Creating a Document combination chain... ---");
  const historyAwareDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalprompt,
  });

  console.log("---Generating a completion... ---");
  const conversationRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrievalChain,
    combineDocsChain: historyAwareDocsChain,
  });

  console.log("---Running the Chain with sample conversation... ---");
  const reply = await conversationRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log(reply.answer);
  return reply.answer;
};

export  { model, generateLangchainCompletion}