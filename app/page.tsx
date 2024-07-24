
import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Store your PDF Documents",
    description: "Store your PDF documents in the cloud and access them from anywhere.",
    icon: GlobeIcon
  },
  {
    name: "Blazing fast responses",
    description: "Experience ligntning fast answers to your questions.",
    icon: ZapIcon
  },
  {
    name: "Chat Memorisation",
    description: "Our intelligent Chatbot remebers previous conversations, providing a seamless experience.",
    icon: BrainCogIcon
  },
  {
    name: "Interactive PDF Viewer",
    description: "View your PDF documents in an interactive viewer.",
    icon: EyeIcon
  },
  {
    name: "Cloud Backup",
    description: "Your PDF documents are backed up in the cloud.",
    icon: ServerCogIcon
  },
  {
    name: "responsive across all devices",
    description: "Access your PDF documents from any device.",
    icon: MonitorSmartphoneIcon
  }
]


export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Your Interactive Document companion</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">Transform Your PDFs into Interactive conversations</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br/>
              <br/> Upload your documents into {" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href='/dashboard'>Get Started</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image 
            alt="App SS"
            src="https://i.imgur.com/VciRSTI.jpeg"
            width={2432}
            height={1442}
            className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
