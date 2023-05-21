"use client";

import { createConversationTemplate } from "../actions";
import Add from "@/icons/add.svg";

export default function NewConversationTemplate() {
  return (
    <form
      // @ts-ignore
      action={createConversationTemplate}
      className="grid grid-cols-1 gap-6 bg-white p-4 lg:max-w-3xl mx-auto"
    >
      <label className="block">
        <span className="text-gray-700">Name</span>
        <input
          type="text"
          name="name"
          className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 invalid:border-red-500"
          required
          placeholder="Enter a short name for this conversation"
        ></input>
      </label>

      <label className="block">
        <span className="text-gray-700">Description</span>
        <input
          type="text"
          name="description"
          className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 invalid:border-red-500"
          required
          placeholder="Enter a description for this conversation"
        ></input>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-orange-600 ml-auto max-w-[15rem] p-2 px-3 text-center flex items-center justify-center font-bold gap-3"
      >
        <Add className="w-8 h-8" />
        Create
      </button>
    </form>
  );
}
