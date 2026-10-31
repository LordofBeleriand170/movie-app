"use client";

import { supabase } from "@/libs/supabaseClient";
import { useAuthStore } from "@/features/auth/authStore";
import { useCollectionStore } from "@/features/collection/collectionStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const SettingsComponent = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAuthStore((state) => state.user);
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const updateUser = useCollectionStore((state) => state.updateUser);
  const deleteUser = useCollectionStore((state) => state.deleteUser);

  const handleDelete = async () => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const res = await deleteUser(user.id);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show instant local preview while uploading
    setPreviewImage(URL.createObjectURL(file));

    // Upload to Supabase Storage bucket ("avatars")
    const fileName = `${user?.id}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Error uploading image:", error.message);
      alert("Image upload failed.");
      return;
    }

    // Get the permanent PUBLIC URL from Supabase
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);

    // CRITICAL: Save the permanent Supabase URL to your state
    setProfileImage(publicUrlData.publicUrl);
  };

  useEffect(() => {
    console.log("USER: ", user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      id: user?.id,
      username: name,
      email: email,
      image: profileImage,
    };

    await updateUser(userData);
    alert("Settings saved successfully!");
  };

  return (
    <div className="w-[90%] mt-10 px-4 md:px-8 mx-auto max-w-6xl text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your account settings, profile information, and security
          options.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full lg:w-64 flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-neutral-800 pb-4 lg:pb-0 shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
              activeTab === "profile"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            Profile & Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
              activeTab === "security"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
              activeTab === "notifications"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            Notifications
          </button>
        </nav>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-3xl">
          <form onSubmit={handleSubmit}>
            {/* --- PROFILE TAB --- */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <p className="text-xs text-neutral-400">
                    This information will be displayed publicly on your profile.
                  </p>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl font-bold text-neutral-300 overflow-hidden">
                    {profileImage || user?.image ? (
                      <Image
                        src={profileImage || user?.image}
                        fill
                        alt="Avatar Preview"
                        className="object-cover"
                      />
                    ) : (
                      <div>{user?.name?.[0]?.toUpperCase()}</div>
                    )}
                  </div>
                  <div>
                    <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg border border-neutral-700 transition cursor-pointer inline-block">
                      Change Avatar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={user?.name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user?.email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-500 text-white"
                  />
                </div>
              </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-xs text-neutral-400">
                    Update your password and manage account security
                    preferences.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-500 text-white"
                    />
                  </div>
                </div>

                {/* 2FA Section */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    className="h-4 w-4 accent-red-500 rounded border-neutral-700 bg-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h2 className="text-xl font-semibold">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Choose how and when you want to receive updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">
                        Email Notifications
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Receive email alerts for updates and activity.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      className="h-4 w-4 accent-red-500 rounded border-neutral-700 bg-neutral-900"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">
                        Push Notifications
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Receive push notifications on desktop/mobile.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      className="h-4 w-4 accent-red-500 rounded border-neutral-700 bg-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onSubmit={handleSubmit}
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold rounded-lg shadow transition"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 p-6 border border-red-900/40 rounded-xl bg-red-950/10">
            <h3 className="text-sm font-bold text-red-500">Danger Zone</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold border border-red-500/30 rounded-lg transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
