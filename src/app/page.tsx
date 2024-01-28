"use client";
import { useState } from "react";

export default function Home() {
  const [casts, setCasts] = useState<string[]>([""]);

  const saveThread = () => {};

  const onAddCast = () => {
    const newCasts = [...casts, ""];
    setCasts(newCasts);
  };

  const removeCasts = (index: number) => {
    if (casts[index] === undefined) return;
    if (casts.length <= 1) return;

    const newCasts = [...casts];
    newCasts.splice(index, 1);
    setCasts(newCasts);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen my-20">
      <h1 className="text-5xl font-bold">Thread Caster</h1>

      <main className="flex flex-col justify-center items-start">
        <p className=" text-gray-400 mt-4 text-sm">
          Create threads in Farcaster, similar to Twitter
        </p>
        {casts?.map((cast, index) => (
          <div
            className="flex gap-2 mt-4 items-center justify-center"
            key={index}
          >
            <textarea
              className=" text-black w-full h-28 rounded-lg px-1"
              value={cast}
              onChange={(e) => {
                const newCasts = [...casts];
                newCasts[index] = e.target.value;
                setCasts(newCasts);
              }}
            />

            <div
              className=" mx-auto text-white font-bold py-2 px-4 rounded-lg text-nowrap cursor-pointer"
              onClick={() => removeCasts(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`w-6 h-6 text-red-500`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-4 items-center justify-center">
          <button
            className=" bg-blue-500  text-white font-bold py-2 px-4 rounded-lg text-nowrap"
            onClick={onAddCast}
          >
            Add Cast
          </button>
          <button
            className=" bg-green-500 text-white font-bold px-4 py-2  rounded-lg "
            onClick={saveThread}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
