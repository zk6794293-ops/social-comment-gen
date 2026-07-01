"use client";
import { useState } from "react";

const tones = ["Happy", "Sad", "Funny", "Savage", "Supportive", "Question", "Professional"];

export default function Home() {
  const [post, setPost] = useState("");
  const [tone, setTone] = useState("Happy");
  const [comments, setComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!post.trim()) return alert("Please paste a post first");
    setLoading(true);
    setComments([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: post, tone }),  // ← یہاں ٹھیک کر دیا
      });

      const data = await res.json();
      setComments(data.comments || ["Something went wrong. Try again"]);
    } catch (e) {
      setComments(["Server error. Check API key"]);
    }
    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const openGmail = () => {
    window.open("mailto:zk6794293@gmail.com?subject=Project Inquiry&body=Hi, I checked your AI Comment Generator portfolio project");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto text-center py-12">
        <img
          src="/IMG_20260523_153916_001.webp"
          alt="Creator"
          width={96}
          height={96}
          className="rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
        />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Comment Generator
        </h1>
        <p className="text-gray-600 mt-3">Generate intelligent, context-aware comments for any social media post in seconds</p>
        
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={openGmail}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:scale-105 transition shadow-md"
          >
            Contact via Gmail
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-white/20 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Project</h2>
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">AI Comment Generator</span> is a full-stack web application built to help content creators, marketers, and social media managers generate engaging, tone-specific comments instantly.
          </p>
          <p>
            <span className="font-semibold">Tech Stack:</span> Built with Next.js 14, React, TypeScript, Tailwind CSS, and OpenAI GPT API. Deployed on Vercel with serverless API routes for fast, scalable performance.
          </p>
          <p>
            <span className="font-semibold">Key Features:</span> Multi-language support, 7 emotional tones, one-click copy, responsive design, and instant AI responses. The interface uses modern glassmorphism UI with smooth animations.
          </p>
          <p>
            <span className="font-semibold">Purpose:</span> Save hours of manual comment writing. Boost engagement by posting relevant, high-quality comments that match your brand voice across LinkedIn, Twitter, Instagram, and more.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-white/20">
        <label className="block text-sm font-semibold mb-2">Step 1: Paste Post</label>
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Paste any post in any language... English, Urdu, Hindi, Arabic"
          className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <label className="block text-sm font-semibold mt-4 mb-2">Step 2: Choose Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
        >
          {tones.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate 3 Comments"}
        </button>

        {comments.length > 0 && (
          <div className="mt-6 space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-xl shadow flex justify-between items-center gap-3">
                <p className="flex-1 text-sm">{c}</p>
                <button onClick={() => copy(c)} className="text-sm text-purple-600 font-semibold shrink-0">Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="max-w-2xl mx-auto mt-16 py-8 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600">Built with Next.js 14, TypeScript, Tailwind CSS, and OpenAI API</p>
        <p className="text-sm text-gray-500 mt-1">zk6794293@gmail.com</p>
        <div className="mt-6 flex justify-center">
          <div 
            dangerouslySetInnerHTML={{
              __html: `
                <script>
                  atOptions = {
                    'key' : '074c93d14e356d9a34267853d044db70',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/074c93d14e356d9a34267853d044db70/invoke.js"></script>
              `
            }}
          />
        </div>
      </footer>
    </main>
  );
}