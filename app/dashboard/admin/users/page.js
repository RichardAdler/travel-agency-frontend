"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import the ShadCN table components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Import ShadCN form components
import { Input } from "@/components/ui/input"; // Import ShadCN Input component
import { Button } from "@/components/ui/button"; // Import ShadCN Button component
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebase"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import auth function
import Switch from "react-switch"; 
import { sendPasswordResetEmail } from "firebase/auth";
import AdminLayout from "@/app/components/page-specific/Admin/AdminLayout";

const ManageUsers = () => {
  const [user, loading] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State to hold the filtered list of users
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const router = useRouter();

  // Zod schema for form validation
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    isAdmin: z.boolean().optional(),
  });

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists() || userDoc.data().role !== "admin") {
            router.push("/");
            return;
          }

          const usersCollection = collection(db, "users");
          const userDocs = await getDocs(usersCollection);
          const userList = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(userList);
          setFilteredUsers(userList); // Initially, set the filtered users to the full list
        } catch (err) {
          setError("Failed to fetch users. Please try again later.");
        }
      }
    };

    fetchUsers();
  }, [user, router]);

  // Admin toggle logic
  const handleAdminToggle = async (userId, isAdmin) => {
    const newRole = isAdmin ? "user" : "admin";
    await updateDoc(doc(db, "users", userId), { role: newRole });
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
  };

  // Password reset logic
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      alert(`Failed to send password reset email: ${error.message}`);
    }
  };

  // Delete user logic
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId)); // Also update the filtered list
    } catch (error) {
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  // Handle new user form submission
  const handleNewUserSubmit = async (values) => {
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const { user } = userCredential; // Get the newly created user object

      // Step 2: Add user data to Firestore using the user's UID
      const newUser = {
        name: values.name,
        email: values.email,
        role: values.isAdmin ? "admin" : "user",
      };

      // Add the user to the "users" collection in Firestore with the UID
      await setDoc(doc(db, "users", user.uid), newUser);

      // Step 3: Update state and close the popup
      setUsers([...users, { id: user.uid, ...newUser }]); // Add new user to the local state
      setFilteredUsers([...users, { id: user.uid, ...newUser }]); // Update the filtered list
      setShowPopup(false); // Close the popup after successful submission
      alert("User created successfully!");
    } catch (err) {
      console.error("Error creating new user:", err.message);
      alert(`Error creating user: ${err.message}`);
    }
  };

  // Search handler to filter users by email
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(searchValue)));
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in to view this page.</p>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <div className="flex flex-grow justify-center mx-4">
            <Input
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded w-full max-w-md"
            />
        </div>
        <Button onClick={() => setShowPopup(true)}>Create New User</Button>
        </div>


      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableCaption>Manage all users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Switch
                  onChange={() => handleAdminToggle(user.id, user.role === "admin")}
                  checked={user.role === "admin"}
                />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleResetPassword(user.email)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNewUserSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin</FormLabel>
                      <FormControl>
                        <input type="checkbox" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={() => setShowPopup(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
