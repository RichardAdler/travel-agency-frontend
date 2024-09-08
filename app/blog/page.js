"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase"; // Firebase setup
import { collection, getDocs, orderBy, query, limit, startAfter, deleteDoc, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/page-specific/Blog/Header";
import Footer from "../components/global/Footer";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState(""); // Fetch user role from Firestore
  const [hasBlogs, setHasBlogs] = useState(false); // State to check if there are blogs

  useEffect(() => {
    fetchBlogs();
    // Fetch the user role when the user is logged in
    if (user) {
      fetchUserRole(user.uid);
    }
  }, [user]);

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserRole(userDoc.data().role);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    const blogQuery = query(collection(db, "blogs"), orderBy("publishedAt", "desc"), limit(6));
    const querySnapshot = await getDocs(blogQuery);
    const lastVisibleBlog = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleBlog);

    const fetchedBlogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBlogs(fetchedBlogs);
    setHasBlogs(fetchedBlogs.length > 0); // Check if there are any blogs
    setLoading(false);
  };

  const fetchMoreBlogs = async () => {
    if (!lastVisible) return;

    setLoading(true);
    const nextBlogQuery = query(
      collection(db, "blogs"),
      orderBy("publishedAt", "desc"),
      startAfter(lastVisible),
      limit(5)
    );
    const querySnapshot = await getDocs(nextBlogQuery);
    const lastVisibleBlog = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleBlog);

    const fetchedBlogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs((prevBlogs) => [...prevBlogs, ...fetchedBlogs]);
    setLoading(false);
  };

  const deleteBlog = async (id) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold">Posts</h2>
          
          {/* Only show "Create New Post" button for logged-in users with the "user" or "admin" role */}
          {user && (userRole === "user" || userRole === "admin") && (
            <Link href="/blog/create">
              <button className="bg-orange-500 text-white px-4 py-2 rounded">
                Create New Post
              </button>
            </Link>
          )}
        </div>

        {/* Handle empty state - if there are no blog posts */}
        {!hasBlogs && !loading && (
          <p className="text-center text-gray-500">No blog posts available yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow-lg rounded-md overflow-hidden">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={500}
                height={300}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <Link href={`/blog/${blog.id}`}>
                  <button className="text-orange-500 hover:underline">Read More</button>
                </Link>

                {/* Only show Edit/Delete for the post author or admin */}
                {user && (user.uid === blog.authorId || userRole === "admin") && (
                  <div className="flex space-x-4 mt-4">
                    <Link href={`/blog/edit/${blog.id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    </Link>
                    {userRole === "admin" && (
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {lastVisible && !loading && (
          <div className="text-center mt-8">
            <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={fetchMoreBlogs}>
              Load More
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogList;
