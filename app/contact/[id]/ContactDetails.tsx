"use client";

import Header from "@/components/Header/Header";
import { useContactActions } from "@/hooks/useContactActions";
import { Facebook, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  title: string;
  skills: string;
  city: string;
  email: string;
  image: string;
  bio1: string;
  bio2: string;
}

export default function ContactDetails({ person }: { person: Contact }) {
  const [copied, setCopied] = useState(false);

  const { toggleMyContact, loading } = useContactActions({
    onlyMine: false,
  });

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/contact/${person.id}`
      : "";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleAddToMyContacts = () => {
    toggleMyContact(person.id);
    toast.success("Contact updated in My Contacts");
  };

  return (
    <section>
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-24">
        <div className="flex flex-col lg:flex-row items-start">
          {/* --- LEFT CONTENT --- */}
          <div className="flex-1 min-w-0">
            {/* name */}
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6">
              {person.name}
            </h1>

            {/* thin green underline (matches Figma) */}
            <div className="w-full">
              <div className="border-b border-[#A9C5A1] dark:border-[#264233] mb-8" />
            </div>

            {/* contact meta (icons + label) */}
            <ul className="space-y-5 text-gray-700 dark:text-gray-300 max-w-xl">
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 18 16"
                    fill="currentColor"
                  >
                    <path d="M10.2409 9.25474C13.0918 9.14038 15.578 8.87523 18 8.28479V14.5059C18 15.331 17.3229 16 16.4873 16H1.51267C0.677333 16 0 15.3312 0 14.5059V8.28479C2.422 8.87523 4.90822 9.14038 7.75911 9.25474V10.0298C7.75911 10.357 8.02778 10.6224 8.35911 10.6224H9.64089C9.97222 10.6224 10.2409 10.357 10.2409 10.0298V9.25474ZM16.4873 3.36155H1.51267C0.677111 3.36155 0 4.03056 0 4.85564V7.51503C2.408 8.12083 4.9 8.3952 7.75911 8.51109V7.94194C7.75911 7.61468 8.02778 7.34931 8.35911 7.34931H9.64089C9.97222 7.34931 10.2409 7.61468 10.2409 7.94194V8.51109C13.1 8.39498 15.592 8.12083 18 7.51503V4.85564C18 4.03056 17.3229 3.36155 16.4873 3.36155Z" />
                  </svg>
                </div>

                <span className="text-md">{person.skills}</span>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 dark:text-gray-200">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-md">{person.city}</span>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 dark:text-gray-200">
                  <Mail className="w-6 h-6" />
                </div>
                <a
                  href={`mailto:${person.email}`}
                  className="text-md text-gray-700 dark:text-gray-300 hover:underline"
                >
                  {person.email}
                </a>
              </li>
            </ul>
          </div>

          {/* --- RIGHT AVATAR + SOCIAL --- */}
          <aside className="max-w-[300px] fhrink-0">
            <div className="flex flex-col items-center">
              <div
                className="relative w-[15vw] h-[30vh] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2c3a32]
              bg-white dark:bg-[#071014] shadow-sm"
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover object-top scale-[1.15]"
                />
              </div>

              {/* social icons */}
              <div className="mt-6 flex items-center justify-end w-full gap-2.5 text-gray-600 dark:text-gray-300">
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="facebook"
                >
                  <Facebook className="w-7 h-7" />
                </Link>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="twitter"
                >
                  <Twitter className="w-7 h-7" />
                </Link>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="linkedin"
                >
                  <Linkedin className="w-7 h-7" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* body paragraphs */}
        <div className="mt-5 w-full text-justify space-y-6 text-gray-600 dark:text-gray-300 text-sm leading-7">
          <p>{person.bio1}</p>
          <p>{person.bio2}</p>

          {/* optional extra paragraph to match screenshot spacing */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Imperdiet sed euismod nisi porta lorem mollis. Aliquam ultrices
            sagittis orci a scelerisque purus semper eget. Sagittis vitae et leo
            duis ut diam quam nulla porttitor. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Facere, vitae numquam. Magni, atque
            facilis. Voluptatem aperiam incidunt saepe alias laboriosam? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Aliquam quaerat
            est quidem saepe error cumque perferendis ipsam eum optio quisquam,
            vel sequi fuga nihil laudantium odit explicabo in voluptatem
            reprehenderit?
          </p>
        </div>

        {/* --- bottom centered action buttons --- */}
        <div className="mt-16 flex justify-center items-center gap-6">
          <button
            aria-label="share"
            onClick={handleShare}
            className="relative dark:bg-[#171717] flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M14 0.5C21.4558 0.5 27.5 6.54416 27.5 14C27.5 21.4558 21.4558 27.5 14 27.5C6.54416 27.5 0.5 21.4558 0.5 14C0.5 6.54416 6.54416 0.5 14 0.5Z"
                fill="#63A053"
                fillOpacity="0.31"
                stroke="#63A053"
              />
              <path
                d="M19.9033 13.6L16.3333 9.928V11.896L15.6644 12C12.3122 12.488 10.0411 14.296 8.74222 17.064C10.5467 15.752 12.7867 15.12 15.5556 15.12H16.3333V17.272M14.7778 15.936C11.3011 16.104 8.81222 17.392 7 20C7.77778 16 10.1111 12 15.5556 11.2V8L21 13.6L15.5556 19.2V15.92C15.2989 15.92 15.0422 15.928 14.7778 15.936Z"
                fill="#63A053"
              />
              <path
                d="M19.9033 13.6L16.3333 9.928V11.896L15.6644 12C12.3122 12.488 10.0411 14.296 8.74222 17.064C10.5467 15.752 12.7867 15.12 15.5556 15.12H16.3333V17.272M14.7778 15.92V15.936M14.7778 15.936C11.3011 16.104 8.81222 17.392 7 20C7.77778 16 10.1111 12 15.5556 11.2V8L21 13.6L15.5556 19.2V15.92C15.2989 15.92 15.0422 15.928 14.7778 15.936Z"
                stroke="#63A053"
                stroke-width="0.1"
              />
            </svg>
            {copied && (
              <span className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded">
                Link copied
              </span>
            )}
          </button>

          <button
            aria-label="add"
            onClick={handleAddToMyContacts}
            disabled={loading.toggle}
            className="dark:bg-[#171717] flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M14 0.5C21.4558 0.5 27.5 6.54416 27.5 14C27.5 21.4558 21.4558 27.5 14 27.5C6.54416 27.5 0.5 21.4558 0.5 14C0.5 6.54416 6.54416 0.5 14 0.5Z"
                fill="#63A053"
                fillOpacity="0.31"
                stroke="#63A053"
              />
              <path
                d="M14.0001 7.77777V20.2222M20.2223 14H7.77783"
                stroke="#63A053"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <a
            href={`mailto:${person.email}`}
            aria-label="message"
            className=" dark:bg-[#171717] flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M14 0.5C21.4558 0.5 27.5 6.54416 27.5 14C27.5 21.4558 21.4558 27.5 14 27.5C6.54416 27.5 0.5 21.4558 0.5 14C0.5 6.54416 6.54416 0.5 14 0.5Z"
                fill="#63A053"
                fillOpacity="0.31"
                stroke="#63A053"
              />
              <path
                d="M9 8.5H20C20.2761 8.5 20.5 8.72386 20.5 9V16.5H16.3398L16.209 16.5928L10.2373 20.8574L10.9902 17.0977L11.1104 16.5H9C8.72386 16.5 8.5 16.2761 8.5 16V9C8.5 8.72386 8.72386 8.5 9 8.5Z"
                stroke="#63A053"
              />
              <path d="M11 11H18" stroke="#63A053" strokeLinecap="round" />
              <path d="M11 13H15" stroke="#63A053" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
