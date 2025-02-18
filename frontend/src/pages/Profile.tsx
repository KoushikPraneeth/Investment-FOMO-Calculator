import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LogOut, Dice6, Check, ArrowLeft, Trash2 } from "lucide-react";
import { getRandomUsername } from "../lib/usernames";
import { Toast } from "../components/Toast";
import { DeleteAccountModal } from "../components/DeleteAccountModal";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [username, setUsername] = useState("");
  const [isUsernameSaved, setIsUsernameSaved] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const showNotification = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const saveUsername = async () => {
    setIsSavingUsername(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { username },
      });
      if (updateError) throw updateError;
      setIsUsernameSaved(true);
      showNotification("Username saved! You can't change it anymore.", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save username");
      showNotification("Failed to save username", "error");
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
      
      await supabase.auth.signOut();
      showNotification("Account deleted successfully", "success");
      navigate("/login");
    } catch (err) {
      setIsDeleting(false);
      showNotification(
        err instanceof Error ? err.message : "Failed to delete account",
        "error"
      );
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-warm-gray-light py-8 px-4 sm:px-6 lg:px-8">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium rounded-md text-charcoal hover:text-charcoal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-3xl font-bold text-charcoal-dark mb-4">
              Your Profile
            </h2>
            {user && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-teal-accent">
                      {username}
                    </div>
                    <div className="space-x-2">
                      {!isUsernameSaved && (
                        <>
                          <button
                            onClick={() => setUsername(getRandomUsername())}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-charcoal bg-warm-gray-lighter hover:bg-warm-gray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
                          >
                            <Dice6 className="h-5 w-5 mr-2" />
                            Roll New Name
                          </button>
                          <button
                            onClick={saveUsername}
                            disabled={isSavingUsername}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent disabled:opacity-50"
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
                <p className="text-charcoal">Email: {user.email}</p>
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
            {!user && (
              <p className="text-charcoal">Could not load user information.</p>
            )}
          </div>
        </div>
      </div>

      {user && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          userEmail={user.email}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Profile;
