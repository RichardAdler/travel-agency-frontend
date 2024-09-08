"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/app/components/page-specific/Blog/Header";
import Footer from "@/app/components/global/Footer";

const BlogDetail = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setBlog(blogDoc.data());
    } else {
      setBlog(null);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog post not found.</p>;

  return (
    <>
      <Header />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">{blog.title}</h1>

      {/* Image container with fixed width and height */}
      <div className="relative w-full max-w-4xl h-[400px] mb-8 mx-auto">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          layout="fill"
          objectFit="cover" // Ensures the image covers the container without stretching
          className="rounded-lg"
        />
      </div>

      <div
        className="prose max-w-full"
        dangerouslySetInnerHTML={{ __html: blog.content }} // Render rich text content
      />

      <p className="text-gray-500 mt-8">Written by: {blog.author}</p>
      <p className="text-gray-500">
        Published on: {new Date(blog.publishedAt.seconds * 1000).toLocaleDateString()}
      </p>
    </div>
    <Footer />
    </>
  );
};

export default BlogDetail;
