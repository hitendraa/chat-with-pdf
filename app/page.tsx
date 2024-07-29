"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LampContainer } from "@/components/ui/lamp";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FeaturesSection } from "@/components/ui/FeaturesSection";

const features = [
  {
    name: "Store your PDF Documents",
    description:
      "Store your PDF documents in the cloud and access them from anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing fast responses",
    description: "Experience lightning fast answers to your questions.",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorisation",
    description:
      "Our intelligent Chatbot remembers previous conversations, providing a seamless experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer",
    description: "View your PDF documents in an interactive viewer.",
    icon: EyeIcon,
  },
  {
    name: "Cloud Backup",
    description: "Your PDF documents are backed up in the cloud.",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive across all devices",
    description: "Access your PDF documents from any device.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="relative bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="absolute inset-0 h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Document Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button
            asChild
            className="mt-10 border-b rounded-xl bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 transition-colors duration-300"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Unleash the power of <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Chat with PDF
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/img.webp`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-7 mb-0 bg-gradient-to-br from-black to-black py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Use AI <br /> the right way
        </motion.h1>
      </LampContainer>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <HoverEffect
          items={features.map((feature) => ({
            title: feature.name,
            description: feature.description,
            icon: feature.icon,
          }))}
        />
      </div>
      <div className="bg-black">
      <FeaturesSection />
      </div>

      
    </main>
  );
}
