import UserProfile from "@/app/components/user-profile";

export default async function ProfilePage({
  params: { username },
}: {
  params: { username: string };
}) {
  return (
    <div className="container mx-auto py-8">
      <UserProfile />
    </div>
  );
}
