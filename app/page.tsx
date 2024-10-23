import React from "react";
import HomePage from "./pages";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
      <header className="text-center text-4xl mt-1">Plan my adventure</header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HomePage />
      </main>
    </div>
  );
}