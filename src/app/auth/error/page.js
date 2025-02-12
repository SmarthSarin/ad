
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            There was a problem authenticating your account. Please make sure you have:
          </p>
          <ul className="mt-4 text-left text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Valid Google OAuth credentials</li>
            <li>MongoDB connection string</li>
            <li>NEXTAUTH_SECRET configured</li>
          </ul>
          <div className="mt-6">
            <Link 
              href="/auth"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
