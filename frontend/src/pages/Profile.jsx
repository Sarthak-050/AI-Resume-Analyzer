import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { User, Lock, Save, KeyRound } from "lucide-react";

import { updateProfile, changePassword } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/Loader";

function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    try {
      setSavingName(true);
      const data = await updateProfile(name.trim());
      updateUser({ name: data.user.name });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 p-4 sm:p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-50">
            Account Settings
          </h1>
          <p className="text-ink-400 mt-1">
            Manage your profile and password.
          </p>
        </div>

        {/* Profile info */}
        <Card className="p-5 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-5">
            <User className="w-5 h-5 text-brand-400" />
            Profile Information
          </h2>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
                  rounded-lg px-3.5 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-ink-900 border border-ink-800 text-ink-500
                  rounded-lg px-3.5 py-3 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-ink-500 mt-1.5">
                Email address cannot be changed.
              </p>
            </div>

            <Button type="submit" disabled={savingName}>
              {savingName ? (
                <>
                  <Loader size={16} className="border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Change password */}
        <Card className="p-5 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-50 mb-5">
            <Lock className="w-5 h-5 text-brand-400" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
                  rounded-lg px-3.5 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
                  rounded-lg px-3.5 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500
                  rounded-lg px-3.5 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? (
                <>
                  <Loader size={16} className="border-white/40 border-t-white" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
}

export default Profile;