"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Import dynamic for client-side loading
import { db, auth, storage } from "../../firebase/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Header from "@/app/components/page-specific/Blog/Header";
import Footer from "@/app/components/global/Footer";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Rich text content state
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !imageFile) {
      setError("All fields including the image are required.");
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        title,
        content, // Rich text content
        excerpt,
        imageUrl: "",
        authorId: user.uid,
        author: user.displayName,
        publishedAt: new Date(),
      };

      // Add the blog data to Firestore
      const docRef = await addDoc(collection(db, "blogs"), blogData);

      // Upload the image
      const imageRef = ref(storage, `blog/${docRef.id}`);
      await uploadBytes(imageRef, imageFile);

      // Get image URL and update the blog document
      const imageUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "blogs", docRef.id), { imageUrl });

      router.push("/blog");
    } catch (err) {
      setError("Error submitting blog post.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Ensure user is logged in before showing the form
  if (!user) return <p>You need to be logged in to create a blog post.</p>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Create New Blog Post</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Excerpt</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Short description"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent} // Quill handles content
              placeholder="Write your blog content here..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Featured Image</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <button
            type="submit"
            className={`bg-orange-500 text-white px-6 py-2 rounded-md ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            Create Post
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateBlog;
