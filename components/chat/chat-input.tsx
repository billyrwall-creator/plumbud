"use client";

import { useState } from "react";
type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export default function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Ask PlumbBud about a fault, regulation or manual..."
        className="w-full resize-none border-0 bg-transparent p-2 text-sm text-slate-700 outline-none"
        disabled={disabled}
      />
     {selectedImage && imagePreview && (
  <div className="mb-3">
    <img
      src={imagePreview}
      alt="Selected upload"
      className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
    />

    <div className="mt-2 flex items-center gap-3">
      <p className="text-sm text-green-600">
        📎 {selectedImage.name}
      </p>

      <button
        type="button"
        onClick={() => {
          URL.revokeObjectURL(imagePreview);
          setSelectedImage(null);
          setImagePreview(null);
        }}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        ❌ Remove
      </button>
    </div>
  </div>
)}
        <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">Responses are generated server-side and the API key stays private.</p>
        <label className="cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
  📷 Attach
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={(e) => {
  const file = e.target.files?.[0];

  if (file) {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
}}
  />
</label>
        <button
          onClick={onSend}
          disabled={disabled}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {disabled ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
