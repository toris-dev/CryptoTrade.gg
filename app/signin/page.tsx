import AuthForm from "../components/AuthForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  );
}
