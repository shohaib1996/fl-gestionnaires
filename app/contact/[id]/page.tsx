"use client";

import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Plus,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header/Header";

const person = {
  name: "Jacqueline Katanga",
  title: "Architecte",
  skills: "Architect, Landscaping",
  city: "Gemena",
  email: "organizer@bbaze.org",
  img: "/images/manager.png",
  bio1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit eget gravida cum sociis. Ultrices eros in cursus turpis. Dis parturient montes nascetur ridiculus. Vivamus arcu felis bibendum ut tristique et. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit eget gravida cum sociis. Ultrices eros in cursus turpis. Dis parturient montes nascetur ridiculus. Vivamus arcu felis bibendum ut tristique et.",
  bio2: "Sed id semper risus in hendrerit. Nunc non blandit massa enim nec dui nunc mattis. Eget magna fermentum iaculis eu non diam. Suscipit adipiscing bibendum est ultricies integer. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida.",
};

export default function ContactDetails() {
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
            <ul className="space-y-6 text-gray-700 dark:text-gray-300 max-w-xl">
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

                <span className="text-sm">{person.skills}</span>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 dark:text-gray-200">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-sm">{person.city}</span>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 dark:text-gray-200">
                  <Mail className="w-6 h-6" />
                </div>
                <a
                  href={`mailto:${person.email}`}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
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
                className="relative w-[260px] h-[250px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2c3a32]
              bg-white dark:bg-[#071014] shadow-sm"
              >
                <Image
                  src={person.img}
                  alt={person.name}
                  fill
                  sizes="(min-width: 1024px) 250px, 160px"
                  className="object-cover"
                />
              </div>

              {/* social icons */}
              <div className="mt-6 flex items-center gap-6 text-gray-600 dark:text-gray-300">
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="linkedin"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* body paragraphs */}
        <div className="mt-10 w-full text-justify space-y-6 text-gray-600 dark:text-gray-300 text-sm leading-7">
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
            className="w-12 h-12 rounded-full border-2 border-[#CFE8C9] bg-white dark:bg-[#071014] flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <Share2 className="w-5 h-5 text-[#63A053]" />
          </button>

          <button
            aria-label="add"
            className="w-12 h-12 rounded-full border-2 border-[#CFE8C9] bg-white dark:bg-[#071014] flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <Plus className="w-5 h-5 text-[#63A053]" />
          </button>

          <button
            aria-label="message"
            className="w-12 h-12 rounded-full border-2 border-[#CFE8C9] bg-white dark:bg-[#071014] flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <MessageSquare className="w-5 h-5 text-[#63A053]" />
          </button>
        </div>
      </div>
    </section>
  );
}
