import ProfilePage from "@/components/User/Profile";

const page = () => {
  return (
    <ProfilePage
      userProfile={{
        id: "2352365462",
        email: "abc@gmail.com",
        role: "user",
        verified: false,
        createdAt: "",
        updatedAt: "",
        profile: {
          phoneNo: "9227462834",
          displayName: "John Doe",
          bio: null,
          avatarUrl: "",
          locale: "en-US",
          preferences: undefined,
          createdAt: "",
          updatedAt: "",
        },
      }}
    />
  );
};

export default page;
