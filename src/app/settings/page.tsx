"use client";

import { useRole } from "@/context/RoleContext";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

const featuredInvestments = [
  {
    name: "Apple Inc.",
    ticker: "AAPL",
    value: "$12,450.00",
    change: "+2.4%",
    positive: true,
    icon: "phone_iphone",
  },
  {
    name: "Tesla Motors",
    ticker: "TSLA",
    value: "$8,200.00",
    change: "+5.1%",
    positive: true,
    icon: "electric_car",
  },
  {
    name: "Ethereum",
    ticker: "ETH",
    value: "$6,800.00",
    change: "-1.2%",
    positive: false,
    icon: "currency_bitcoin",
  },
  {
    name: "S&P 500 ETF",
    ticker: "SPY",
    value: "$15,300.00",
    change: "+0.8%",
    positive: true,
    icon: "trending_up",
  },
];

const activityLog = [
  { action: "Logged in from Chrome on Windows", time: "2 hours ago", icon: "login", color: "var(--theme-primary)" },
  { action: "Changed notification preferences", time: "Yesterday", icon: "tune", color: "var(--theme-secondary)" },
  { action: "Updated billing method to Visa ****4242", time: "3 days ago", icon: "credit_card", color: "var(--theme-tertiary)" },
  { action: "Exported Q3 financial report", time: "1 week ago", icon: "download", color: "var(--theme-primary-dim)" },
  { action: "Enabled two-factor authentication", time: "2 weeks ago", icon: "verified_user", color: "var(--theme-primary)" },
];

const notifications = [
  { label: "Portfolio alerts", desc: "Get notified on major price swings", enabled: true },
  { label: "Weekly digest", desc: "Summary of your weekly performance", enabled: true },
  { label: "Transaction alerts", desc: "Instant notifications on transactions", enabled: false },
  { label: "Market news", desc: "Breaking financial news updates", enabled: true },
];

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  avatar: string;
  coverImage: string;
};

const PROFILE_STORAGE_KEY = "aetheris-profile-settings";
const PROFILE_UPDATED_EVENT = "aetheris-profile-updated";

const defaultProfileData: ProfileData = {
  fullName: "Julian Sterling",
  email: "julian.sterling@aetheris.io",
  phone: "+1 (555) 234-8910",
  location: "New York, NY",
  timezone: "EST (UTC-5)",
  avatar: "",
  coverImage: "",
};

const readStoredProfile = (): ProfileData => {
  if (typeof window === "undefined") return defaultProfileData;

  try {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!storedProfile) return defaultProfileData;

    const parsed = JSON.parse(storedProfile) as Partial<ProfileData>;
    return {
      fullName:
        typeof parsed.fullName === "string" && parsed.fullName.trim().length > 0
          ? parsed.fullName
          : defaultProfileData.fullName,
      email:
        typeof parsed.email === "string" && parsed.email.trim().length > 0
          ? parsed.email
          : defaultProfileData.email,
      phone:
        typeof parsed.phone === "string" && parsed.phone.trim().length > 0
          ? parsed.phone
          : defaultProfileData.phone,
      location:
        typeof parsed.location === "string" && parsed.location.trim().length > 0
          ? parsed.location
          : defaultProfileData.location,
      timezone:
        typeof parsed.timezone === "string" && parsed.timezone.trim().length > 0
          ? parsed.timezone
          : defaultProfileData.timezone,
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : "",
      coverImage: typeof parsed.coverImage === "string" ? parsed.coverImage : "",
    };
  } catch {
    return defaultProfileData;
  }
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export default function SettingsPage() {
  const { role } = useRole();
  const isAdmin = role === "admin";
  const [notifState, setNotifState] = useState(notifications.map((n) => n.enabled));
  const [profileData, setProfileData] = useState<ProfileData>(readStoredProfile);
  const [draftProfileData, setDraftProfileData] = useState<ProfileData>(profileData);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarUploadMessage, setAvatarUploadMessage] = useState("Upload a square photo for the cleanest profile card.");
  const [coverUploadMessage, setCoverUploadMessage] = useState("Upload a wide photo for the banner area.");
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  const profileInitials = getInitials(profileData.fullName);
  const draftInitials = getInitials(draftProfileData.fullName);
  const accountDetails = [
    { label: "Full Name", value: profileData.fullName },
    { label: "Email", value: profileData.email },
    { label: "Phone", value: profileData.phone },
    { label: "Location", value: profileData.location },
    { label: "Timezone", value: profileData.timezone },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
  }, [profileData]);

  const toggleNotif = (index: number) => {
    if (!isAdmin) return;
    setNotifState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const startProfileEditing = () => {
    if (!isAdmin) return;
    setDraftProfileData(profileData);
    setAvatarUploadMessage("Upload a square photo for the cleanest profile card.");
    setCoverUploadMessage("Upload a wide photo for the banner area.");
    setIsEditingProfile(true);
  };

  const cancelProfileEditing = () => {
    setDraftProfileData(profileData);
    setAvatarUploadMessage("Changes were not saved.");
    setCoverUploadMessage("Changes were not saved.");
    setIsEditingProfile(false);
  };

  const updateDraftField = (field: keyof Omit<ProfileData, "avatar" | "coverImage">, value: string) => {
    setDraftProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage",
    setMessage: (message: string) => void,
    successText: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file (PNG, JPG, WEBP, or GIF).");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        setMessage("Image upload failed. Please try another file.");
        return;
      }

      setDraftProfileData((prev) => ({
        ...prev,
        [field]: result,
      }));
      setMessage(`${file.name} is ready. ${successText}`);
    };
    reader.onerror = () => setMessage("Could not read the selected image. Please try again.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, "avatar", setAvatarUploadMessage, "Click Save Profile to apply.");
  };

  const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, "coverImage", setCoverUploadMessage, "Click Save Profile to apply.");
  };

  const removeDraftAvatar = () => {
    setDraftProfileData((prev) => ({
      ...prev,
      avatar: "",
    }));
    setAvatarUploadMessage("Photo removed. Click Save Profile to apply.");
  };

  const removeDraftCover = () => {
    setDraftProfileData((prev) => ({
      ...prev,
      coverImage: "",
    }));
    setCoverUploadMessage("Banner removed. Click Save Profile to apply.");
  };

  const saveProfile = () => {
    const nextProfile: ProfileData = {
      fullName: draftProfileData.fullName.trim() || defaultProfileData.fullName,
      email: draftProfileData.email.trim() || defaultProfileData.email,
      phone: draftProfileData.phone.trim() || defaultProfileData.phone,
      location: draftProfileData.location.trim() || defaultProfileData.location,
      timezone: draftProfileData.timezone.trim() || defaultProfileData.timezone,
      avatar: draftProfileData.avatar,
      coverImage: draftProfileData.coverImage,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
    }

    setProfileData(nextProfile);
    setDraftProfileData(nextProfile);
    setAvatarUploadMessage("Profile updated successfully.");
    setCoverUploadMessage("Profile updated successfully.");
    setIsEditingProfile(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Role Banner */}
      <div
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: isAdmin
            ? "rgba(88, 245, 209, 0.08)"
            : "rgba(193, 151, 254, 0.08)",
          border: `1px solid ${isAdmin ? "color-mix(in srgb, var(--theme-primary) 15%, transparent)" : "color-mix(in srgb, var(--theme-secondary) 15%, transparent)"}`,
          animation: "fadeInUp 0.4s ease forwards",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            color: isAdmin ? "var(--theme-primary)" : "var(--theme-secondary)",
            fontSize: "1.25rem",
          }}
        >
          {isAdmin ? "admin_panel_settings" : "visibility"}
        </span>
        <span style={{ fontSize: "0.8125rem", color: "var(--theme-on-surface-variant)" }}>
          You are viewing as{" "}
          <strong style={{ color: isAdmin ? "var(--theme-primary)" : "var(--theme-secondary)" }}>
            {isAdmin ? "Admin" : "Viewer"}
          </strong>
          {!isAdmin && " — editing is disabled"}
        </span>
      </div>

      {/* Profile Header Card */}
      <div
        className="glass-card"
        style={{
          borderRadius: "0.75rem",
          overflow: "hidden",
          animation: "fadeInUp 0.5s ease forwards",
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: 160,
            background:
              profileData.coverImage
                ? `linear-gradient(135deg, rgba(5, 17, 38, 0.68) 0%, rgba(22, 39, 78, 0.58) 50%, rgba(184, 255, 187, 0.15) 100%), center / cover no-repeat url(${profileData.coverImage})`
                : "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 15%, transparent) 0%, color-mix(in srgb, var(--theme-secondary) 15%, transparent) 50%, rgba(184,255,187,0.1) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--theme-primary) 20%, transparent), transparent 50%), radial-gradient(circle at 80% 20%, rgba(193,151,254,0.2), transparent 50%)",
            }}
          />
          {/* Floating orbs */}
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(88,245,209,0.08)",
              top: -30,
              right: 80,
              filter: "blur(40px)",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "color-mix(in srgb, var(--theme-secondary) 10%, transparent)",
              bottom: -20,
              left: 120,
              filter: "blur(30px)",
              animation: "float 5s ease-in-out infinite 1s",
            }}
          />
        </div>

        {/* Profile Info */}
        <div style={{ padding: "0 2rem 2rem", marginTop: -50 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "1rem",
                background: profileData.avatar
                  ? `center / cover no-repeat url(${profileData.avatar})`
                  : "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--theme-on-primary)",
                border: "4px solid var(--theme-surface)",
                fontFamily: "var(--font-heading)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              {!profileData.avatar && profileInitials}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--theme-on-surface)",
                    margin: 0,
                  }}
                >
                  {profileData.fullName}
                </h1>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    background: isAdmin
                      ? "rgba(88,245,209,0.12)"
                      : "rgba(193,151,254,0.12)",
                    color: isAdmin ? "var(--theme-primary)" : "var(--theme-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {isAdmin ? "Admin" : "Viewer"}
                </span>
              </div>
              <p style={{ color: "var(--theme-on-surface-variant)", fontSize: "0.875rem", margin: 0 }}>
                {profileData.email}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={isEditingProfile ? cancelProfileEditing : startProfileEditing}
                type="button"
                style={{
                  background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
                  color: "var(--theme-on-primary)",
                  border: "none",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                  {isEditingProfile ? "close" : "edit"}
                </span>
                {isEditingProfile ? "Close Editor" : "Edit Profile"}
              </button>
            )}
          </div>

          {isAdmin && isEditingProfile && (
            <div
              style={{
                marginTop: "1.5rem",
                background: "var(--theme-surface-container-high)",
                borderRadius: "0.75rem",
                border: "1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                padding: "1.25rem",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface)",
                    }}
                  >
                    Edit Profile
                  </h3>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--theme-on-surface-variant)" }}>
                    Update profile details and upload a photo from your system.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--theme-primary)",
                    background: "rgba(88,245,209,0.12)",
                    border: "1px solid rgba(88,245,209,0.25)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.625rem",
                    height: "fit-content",
                  }}
                >
                  Featured
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <label style={{ display: "grid", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={draftProfileData.fullName}
                    onChange={(event) => updateDraftField("fullName", event.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: "rgba(6,25,52,0.6)",
                      color: "var(--theme-on-surface)",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Email
                  </span>
                  <input
                    type="email"
                    value={draftProfileData.email}
                    onChange={(event) => updateDraftField("email", event.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: "rgba(6,25,52,0.6)",
                      color: "var(--theme-on-surface)",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Phone
                  </span>
                  <input
                    type="text"
                    value={draftProfileData.phone}
                    onChange={(event) => updateDraftField("phone", event.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: "rgba(6,25,52,0.6)",
                      color: "var(--theme-on-surface)",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Location
                  </span>
                  <input
                    type="text"
                    value={draftProfileData.location}
                    onChange={(event) => updateDraftField("location", event.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: "rgba(6,25,52,0.6)",
                      color: "var(--theme-on-surface)",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Timezone
                  </span>
                  <input
                    type="text"
                    value={draftProfileData.timezone}
                    onChange={(event) => updateDraftField("timezone", event.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: "rgba(6,25,52,0.6)",
                      color: "var(--theme-on-surface)",
                      padding: "0.625rem 0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: "0.625rem",
                    padding: "0.875rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(104,118,144,0.22)",
                    background: "rgba(6,25,52,0.45)",
                  }}
                >
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Profile Photo
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(104,118,144,0.3)",
                        background: draftProfileData.avatar
                          ? `center / cover no-repeat url(${draftProfileData.avatar})`
                          : "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--theme-on-primary)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                      }}
                    >
                      {!draftProfileData.avatar && draftInitials}
                    </div>

                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <input
                        ref={profilePhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: "none" }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => profilePhotoInputRef.current?.click()}
                          style={{
                            background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
                            color: "var(--theme-on-primary)",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.875rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Upload Photo
                        </button>
                        <button
                          type="button"
                          onClick={removeDraftAvatar}
                          disabled={!draftProfileData.avatar}
                          style={{
                            background: "transparent",
                            color: "var(--theme-on-surface-variant)",
                            border: "1px solid rgba(104,118,144,0.3)",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.875rem",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            cursor: draftProfileData.avatar ? "pointer" : "not-allowed",
                            opacity: draftProfileData.avatar ? 1 : 0.5,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)" }}>
                    {avatarUploadMessage}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "0.625rem",
                    padding: "0.875rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(104,118,144,0.22)",
                    background: "rgba(6,25,52,0.45)",
                  }}
                >
                  <span style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Banner Background
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 320,
                      height: 74,
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(104,118,144,0.3)",
                      background: draftProfileData.coverImage
                        ? `linear-gradient(135deg, rgba(5, 17, 38, 0.68), rgba(22, 39, 78, 0.58)), center / cover no-repeat url(${draftProfileData.coverImage})`
                        : "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 15%, transparent) 0%, color-mix(in srgb, var(--theme-secondary) 15%, transparent) 50%, rgba(184,255,187,0.1) 100%)",
                    }}
                  />
                  <input
                    ref={coverPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    style={{ display: "none" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => coverPhotoInputRef.current?.click()}
                      style={{
                        background: "linear-gradient(135deg, var(--theme-secondary), color-mix(in srgb, var(--theme-secondary) 70%, var(--theme-surface)))",
                        color: "var(--theme-on-primary)",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.875rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Upload Background
                    </button>
                    <button
                      type="button"
                      onClick={removeDraftCover}
                      disabled={!draftProfileData.coverImage}
                      style={{
                        background: "transparent",
                        color: "var(--theme-on-surface-variant)",
                        border: "1px solid rgba(104,118,144,0.3)",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.875rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: draftProfileData.coverImage ? "pointer" : "not-allowed",
                        opacity: draftProfileData.coverImage ? 1 : 0.5,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)" }}>
                    {coverUploadMessage}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={cancelProfileEditing}
                  style={{
                    background: "transparent",
                    color: "var(--theme-on-surface-variant)",
                    border: "1px solid rgba(104,118,144,0.3)",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  style={{
                    background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
                    color: "var(--theme-on-primary)",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                  }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
              padding: "1.25rem",
              background: "#061934",
              borderRadius: "0.75rem",
            }}
          >
            {[
              { label: "Portfolio Value", value: "$45,230", icon: "account_balance_wallet", color: "var(--theme-primary)" },
              { label: "Total Investments", value: "12", icon: "pie_chart", color: "var(--theme-secondary)" },
              { label: "Monthly ROI", value: "+12.5%", icon: "trending_up", color: "var(--theme-tertiary)" },
              { label: "Member Since", value: "Jan 2022", icon: "calendar_today", color: "var(--theme-primary)" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: stat.color, fontSize: "1.5rem", marginBottom: "0.25rem", display: "block" }}
                >
                  {stat.icon}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--theme-on-surface)",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Featured Investments */}
          <div
            style={{
              background: "var(--theme-surface-container-high)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "100ms",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--theme-on-surface)",
                    margin: 0,
                  }}
                >
                  Featured Investments
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--theme-on-surface-variant)", margin: "0.25rem 0 0" }}>
                  Your top-performing holdings
                </p>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--theme-primary)", fontSize: "1.25rem" }}
              >
                star
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {featuredInvestments.map((inv, i) => (
                <div
                  key={i}
                  className="activity-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 0.5rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderBottom: i < featuredInvestments.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "0.75rem",
                        background: inv.positive ? "rgba(88,245,209,0.08)" : "rgba(255,113,108,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          color: inv.positive ? "var(--theme-primary)" : "var(--theme-error)",
                          fontSize: "1.25rem",
                        }}
                      >
                        {inv.icon}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--theme-on-surface)" }}>
                        {inv.name}
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)" }}>
                        {inv.ticker}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--theme-on-surface)" }}>
                      {inv.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: inv.positive ? "var(--theme-tertiary)" : "var(--theme-error)",
                        textShadow: inv.positive
                          ? "0 0 8px rgba(184,255,187,0.3)"
                          : "0 0 8px rgba(255,113,108,0.3)",
                      }}
                    >
                      {inv.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div
            style={{
              background: "var(--theme-surface-container-low)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "200ms",
              opacity: 0,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--theme-on-surface)",
                margin: "0 0 1.25rem",
              }}
            >
              Activity Log
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {activityLog.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.875rem 0",
                    borderBottom: i < activityLog.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${entry.color}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: entry.color, fontSize: "1rem" }}
                    >
                      {entry.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8125rem", color: "var(--theme-on-surface)" }}>
                      {entry.action}
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)" }}>
                      {entry.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Account Details */}
          <div
            style={{
              background: "var(--theme-surface-container-high)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "150ms",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--theme-secondary)", fontSize: "1.25rem" }}>
                badge
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--theme-on-surface)",
                  margin: 0,
                }}
              >
                Account Details
              </h2>
            </div>
            {accountDetails.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: i < accountDetails.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <span style={{ fontSize: "0.8125rem", color: "var(--theme-on-surface-variant)" }}>{item.label}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--theme-on-surface)" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Subscription */}
          <div
            style={{
              borderRadius: "0.75rem",
              padding: "1.5rem",
              background: "linear-gradient(135deg, rgba(88,245,209,0.08), rgba(193,151,254,0.08))",
              position: "relative",
              overflow: "hidden",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "250ms",
              opacity: 0,
            }}
          >
            {/* Gradient border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "0.75rem",
                padding: 1,
                background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 30%, transparent), rgba(193,151,254,0.3))",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--theme-primary)" }}>
                workspace_premium
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  color: "var(--theme-primary)",
                  fontSize: "1rem",
                }}
              >
                Pro Plan
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--theme-on-surface-variant)", marginBottom: "1rem", lineHeight: 1.5 }}>
              Unlimited analytics, real-time alerts, and predictive modeling.
              Renews on <strong style={{ color: "var(--theme-on-surface)" }}>Nov 15, 2023</strong>.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {isAdmin && (
                <button
                  style={{
                    background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
                    color: "var(--theme-on-primary)",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                  }}
                >
                  Manage Plan
                </button>
              )}
              <button
                style={{
                  background: "transparent",
                  color: "var(--theme-primary)",
                  border: "1px solid rgba(104,118,144,0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                View Invoice
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div
            style={{
              background: "var(--theme-surface-container-high)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "300ms",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--theme-tertiary)", fontSize: "1.25rem" }}>
                notifications_active
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--theme-on-surface)",
                  margin: 0,
                }}
              >
                Notifications
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {notifications.map((notif, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.875rem 0",
                    borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--theme-on-surface)" }}>
                      {notif.label}
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--theme-on-surface-variant)" }}>
                      {notif.desc}
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleNotif(i)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      border: "none",
                      cursor: isAdmin ? "pointer" : "not-allowed",
                      background: notifState[i]
                        ? "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))"
                        : "#152c4e",
                      position: "relative",
                      transition: "background 0.3s ease",
                      opacity: isAdmin ? 1 : 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 3,
                        left: notifState[i] ? 23 : 3,
                        transition: "left 0.3s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div
            style={{
              background: "var(--theme-surface-container-low)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "350ms",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--theme-primary)", fontSize: "1.25rem" }}>
                shield
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--theme-on-surface)",
                  margin: 0,
                }}
              >
                Security
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "rgba(88,245,209,0.05)",
                  borderRadius: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--theme-tertiary)", fontSize: "1rem" }}>
                    check_circle
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--theme-on-surface)" }}>Two-factor authentication</span>
                </div>
                <span style={{ fontSize: "0.6875rem", color: "var(--theme-tertiary)", fontWeight: 600 }}>Enabled</span>
              </div>
              {isAdmin && (
                <>
                  <button
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "var(--theme-secondary)",
                      border: "1px solid rgba(193,151,254,0.2)",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                      key
                    </span>
                    Change Password
                  </button>
                  <button
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "var(--theme-error)",
                      border: "1px solid rgba(255,113,108,0.15)",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                      logout
                    </span>
                    Sign Out of All Devices
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
