"use client";
import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../../firebase/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Header from "@/app/components/page-specific/Blog/Header";
import Footer from "@/app/components/global/Footer";

const EditBlog = ({ params }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (id) => {
    const blogDoc = await getDoc(doc(db, "blogs", id));
    if (blogDoc.exists()) {
      const blogData = blogDoc.data();
      setTitle(blogData.title);
      setContent(blogData.content); // Load rich text content
      setExcerpt(blogData.excerpt);
      setImageUrl(blogData.imageUrl);
    } else {
      setError("Blog post not found.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !excerpt) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    const blogData = {
      title,
      content, // Rich text content
      excerpt,
    };

    try {
      if (imageFile) {
        const imageRef = ref(storage, `blog/${id}`);
        await uploadBytes(imageRef, imageFile);
        const newImageUrl = await getDownloadURL(imageRef);
        blogData.imageUrl = newImageUrl;
      }

      await updateDoc(doc(db, "blogs", id), blogData);
      router.push("/blog");
    } catch (err) {
      setError("Error updating blog post.");
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

  if (!user) return <p>You need to be logged in to edit this blog post.</p>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Edit Blog Post</h2>
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
              onChange={setContent}
              placeholder="Edit your blog content here..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Featured Image</label>
            <input type="file" onChange={handleImageChange} />
            {imageUrl && !imageFile && (
              <img src={imageUrl} alt="Current Blog Image" className="mt-4 h-48 object-cover" />
            )}
          </div>
          <button
            type="submit"
            className={`bg-orange-500 text-white px-6 py-2 rounded-md ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            Update Post
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditBlog;
