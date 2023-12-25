"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from 'swr';


import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [myPosts, setMyPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // Add isDeleting state

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
    mutate('/api/prompt'); // Revalidate the cache for /api/prompt
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

    if (hasConfirmed) {
      const response = await fetch(`/api/prompt/${post._id.toString()}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const filteredPosts = myPosts.filter((item) => item._id !== post._id);
        setMyPosts(filteredPosts);
        mutate('/api/prompt', true); // Revalidate the cache for /api/prompt
      } else {
        const errorData = await response.json();
        console.error('Delete Error:', errorData);
      }
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (confirmDelete) {
      setIsDeleting(true); // Set isDeleting to true
      try {
        const response = await fetch(`/api/users/${session?.user.id}`, { method: "DELETE" });
        if (response.ok) {
          alert("Account successfully deleted.");
          signOut({ redirect: false }); // Sign out without redirecting
          router.push('/');
        } else {
          alert("Failed to delete account. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred while deleting your account.");
      } finally {
        setIsDeleting(false); // Reset isDeleting to false
      }
    }
  };

  const displayName = session && status === 'authenticated' ? "My" : session?.user.name;

  return (
    <Profile
      name={displayName}
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleDeleteAccount={handleDeleteAccount}
      isDeleting={isDeleting}
      isCurrentUserProfile={true}
    />
  );
};

export default MyProfile;
