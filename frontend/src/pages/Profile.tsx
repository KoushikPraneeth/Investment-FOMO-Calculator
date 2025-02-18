import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogOut, Dice6, Check } from "lucide-react";
import { getRandomUsername } from "../lib/usernames";
import { Toast } from "../components/Toast";

const Profile = () => {
  const [user, setUser] = React.useState<any>(null);
  const [username, setUsername] = useState("");
  const [isUsernameSaved, setIsUsernameSaved] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        const savedUsername = currentUser.user_metadata?.username;
        if (savedUsername) {
          setUsername(savedUsername);
          setIsUsernameSaved(true);
        } else {
          setUsername(getRandomUsername());
        }
      }
    };

    getUser();
  }, []);

  const saveUsername = async () => {
    setIsSavingUsername(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { username },
      });
      if (updateError) throw updateError;
      setIsUsernameSaved(true);
      setShowToast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save username");
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toast
        message="Username saved! You can't change it anymore."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Profile
          </h2>
          {user && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold text-blue-600">
                    {username}
                  </div>
                  <div className="space-x-2">
                    {!isUsernameSaved && (
                      <>
                        <button
                          onClick={() => setUsername(getRandomUsername())}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Dice6 className="h-5 w-5 mr-2" />
                          Roll New Name
                        </button>
                        <button
                          onClick={saveUsername}
                          disabled={isSavingUsername}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <Check className="h-5 w-5 mr-2" />
                          {isSavingUsername ? "Saving..." : "Save Username"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>
              <p className="text-gray-700">Email: {user.email}</p>
              <button
                onClick={handleSignOut}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          )}
          {!user && (
            <p className="text-gray-700">Could not load user information.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
