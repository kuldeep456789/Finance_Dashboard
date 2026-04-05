"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLayout } from "@/context/LayoutContext";
import { useNotification } from "@/context/NotificationContext";

const categoryOptions = ["Banking", "Brokerage", "Exchange", "Wallet", "Other"];

const emptyFormState = {
  provider: "",
  accountIdentifier: "",
  accessKey: "",
  category: categoryOptions[0],
  notes: "",
};

const fieldStyle = {
  width: "100%",
  borderRadius: "0.75rem",
  border: "1px solid color-mix(in srgb, var(--theme-outline-variant) 84%, transparent)",
  background: "color-mix(in srgb, var(--theme-surface-container-low) 90%, transparent)",
  color: "var(--theme-on-surface)",
  padding: "0.68rem 0.78rem",
  fontSize: "0.875rem",
  outline: "none",
} as const;

function maskSecret(secret: string) {
  if (secret.length <= 4) return "••••";
  return `${secret.slice(0, 2)}••••${secret.slice(-2)}`;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(timestamp);
}

export function CredentialsPanel() {
  const { isCredentialPanelOpen, closeCredentialPanel, addCredential, credentials } = useLayout();
  const { showToast } = useNotification();
  const [form, setForm] = useState(emptyFormState);

  const handleClosePanel = useCallback(() => {
    setForm(emptyFormState);
    closeCredentialPanel();
  }, [closeCredentialPanel]);

  useEffect(() => {
    if (!isCredentialPanelOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClosePanel();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isCredentialPanelOpen, handleClosePanel]);

  const recentCredentials = useMemo(() => credentials.slice(0, 5), [credentials]);

  const handleFieldChange =
    (field: keyof typeof emptyFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const provider = form.provider.trim();
    const accountIdentifier = form.accountIdentifier.trim();
    const accessKey = form.accessKey.trim();
    const notes = form.notes.trim();

    if (!provider || !accountIdentifier || !accessKey) {
      showToast("Missing Fields", "Please fill provider, account, and access key.", "error");
      return;
    }

    addCredential({
      provider,
      accountIdentifier,
      accessKey,
      category: form.category,
      notes,
    });

    showToast("Credential Added", `${provider} credentials saved successfully.`, "success");
    handleClosePanel();
  };

  if (!isCredentialPanelOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClosePanel();
        }
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "color-mix(in srgb, var(--theme-surface) 50%, black 50%)",
          opacity: 0.78,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-credential-title"
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border"
        style={{
          borderColor: "color-mix(in srgb, var(--theme-outline-variant) 76%, transparent)",
          background: "color-mix(in srgb, var(--theme-surface-bright) 86%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow:
            "0 26px 55px rgba(2, 8, 23, 0.36), inset 0 1px 0 color-mix(in srgb, white 10%, transparent)",
        }}
      >
        <div
          className="flex items-start justify-between gap-4 px-6 py-5 border-b"
          style={{
            borderColor: "color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
            background: "color-mix(in srgb, var(--theme-surface-container-low) 70%, transparent)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "0.67rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--theme-primary)",
              }}
            >
              Security Vault
            </p>
            <h2
              id="add-credential-title"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.3rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-heading)",
                color: "var(--theme-on-surface)",
              }}
            >
              Add Financial Credential
            </h2>
            <p
              style={{
                margin: "0.4rem 0 0",
                fontSize: "0.8rem",
                color: "var(--theme-on-surface-variant)",
              }}
            >
              Create a structured and secure credential entry for your finance operations.
            </p>
          </div>

          <button
            onClick={handleClosePanel}
            aria-label="Close credential panel"
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors"
            style={{
              borderColor: "color-mix(in srgb, var(--theme-outline-variant) 72%, transparent)",
              background: "color-mix(in srgb, var(--theme-surface-container-low) 84%, transparent)",
              color: "var(--theme-on-surface-variant)",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="credential-provider"
                  style={{
                    display: "block",
                    marginBottom: "0.35rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "var(--theme-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Institution / Provider
                </label>
                <input
                  id="credential-provider"
                  type="text"
                  value={form.provider}
                  onChange={handleFieldChange("provider")}
                  placeholder="Ex: HDFC Bank, Binance, PayPal"
                  style={fieldStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="credential-account"
                  style={{
                    display: "block",
                    marginBottom: "0.35rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "var(--theme-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Account Email / Username
                </label>
                <input
                  id="credential-account"
                  type="text"
                  value={form.accountIdentifier}
                  onChange={handleFieldChange("accountIdentifier")}
                  placeholder="Ex: treasury@company.com"
                  style={fieldStyle}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="credential-key"
                    style={{
                      display: "block",
                      marginBottom: "0.35rem",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface-variant)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Access Key / Secret
                  </label>
                  <input
                    id="credential-key"
                    type="password"
                    value={form.accessKey}
                    onChange={handleFieldChange("accessKey")}
                    placeholder="Paste secure key"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="credential-category"
                    style={{
                      display: "block",
                      marginBottom: "0.35rem",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface-variant)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Category
                  </label>
                  <select
                    id="credential-category"
                    value={form.category}
                    onChange={handleFieldChange("category")}
                    style={fieldStyle}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="credential-notes"
                  style={{
                    display: "block",
                    marginBottom: "0.35rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "var(--theme-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Notes
                </label>
                <textarea
                  id="credential-notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleFieldChange("notes")}
                  placeholder="Optional notes about owner, rotation policy, or usage limits."
                  style={fieldStyle}
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="px-4 py-2 rounded-xl font-semibold border transition-colors"
                  style={{
                    borderColor: "color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
                    background: "color-mix(in srgb, var(--theme-surface-container-low) 86%, transparent)",
                    color: "var(--theme-on-surface-variant)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-container))",
                    color: "var(--theme-on-primary)",
                    border: "1px solid color-mix(in srgb, var(--theme-primary) 32%, transparent)",
                    boxShadow: "0 8px 18px color-mix(in srgb, var(--theme-primary) 22%, transparent)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                    add_circle
                  </span>
                  Save Credential
                </button>
              </div>
            </form>

            <aside
              className="rounded-xl border p-4 h-fit"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-outline-variant) 84%, transparent)",
                background: "color-mix(in srgb, var(--theme-surface-container-low) 86%, transparent)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  color: "var(--theme-on-surface-variant)",
                }}
              >
                Recent Credentials
              </p>
              <div className="mt-3 space-y-3">
                {recentCredentials.length === 0 && (
                  <div
                    className="rounded-lg px-3 py-2.5 border"
                    style={{
                      borderColor: "color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
                      background: "color-mix(in srgb, var(--theme-surface-container-high) 60%, transparent)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--theme-on-surface-variant)" }}>
                      No entries yet. Add your first credential.
                    </p>
                  </div>
                )}

                {recentCredentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="rounded-lg px-3 py-2.5 border"
                    style={{
                      borderColor: "color-mix(in srgb, var(--theme-outline-variant) 82%, transparent)",
                      background: "color-mix(in srgb, var(--theme-surface-container-high) 58%, transparent)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.86rem",
                          fontWeight: 700,
                          color: "var(--theme-on-surface)",
                        }}
                      >
                        {credential.provider}
                      </p>
                      <span
                        style={{
                          fontSize: "0.64rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.45rem",
                          borderRadius: "999px",
                          color: "var(--theme-primary)",
                          background: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                        }}
                      >
                        {credential.category}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0.35rem 0 0",
                        fontSize: "0.76rem",
                        color: "var(--theme-on-surface-variant)",
                      }}
                    >
                      {credential.accountIdentifier}
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.72rem",
                        color: "var(--theme-on-surface-variant)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Key: {maskSecret(credential.accessKey)}
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.68rem",
                        color: "var(--theme-on-surface-variant)",
                      }}
                    >
                      Added {formatDate(credential.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
