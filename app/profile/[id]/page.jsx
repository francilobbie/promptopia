// UserProfile Component
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setUserPosts(data);
    };

    if (userId) fetchPosts();
  }, [userId]);


  return (
    <Profile
      name={session?.user.name || "User Profile"}
      desc="Here's a list of your prompts."
      data={userPosts}
    />
  );
};

export default UserProfile;
