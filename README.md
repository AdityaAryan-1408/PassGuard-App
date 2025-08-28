# 🛡️ PassGuard: A Secure Password Manager

PassGuard is a modern, secure, client-side password manager built with React and Firebase. It allows users to generate, analyze, and save their passwords with end-to-end encryption, ensuring that only the user has access to their vault.

## ✨ Key Features

- **Secure User Accounts**: Sign up and log in with email/password or Google.
- **Email Verification**: New email/password accounts require email verification for enhanced security.
- **End-to-End Encryption**: All sensitive data (usernames, passwords, tags) is encrypted on your device using your master password as the key before being sent to the database.
- **Password Strength Analysis**: An offline, rule-based strength checker provides instant feedback on your passwords.
- **Password Generation**: Instantly generate strong, random passwords locally in your browser.
- **Secure Vault**: View, edit, and delete your saved credentials in a secure, organized vault.
- **Optional Tagging**: Add custom tags to your entries for better organization (e.g., "Work," "Social").
- **Light & Dark Mode**: A sleek, modern UI with theme support.

## 🚀 How to Use

1.  **Create an Account**: Sign up using your email or Google account. If using email, you'll need to verify it. Remember your master password, as it's the key to your vault.
2.  **Save a Credential**:
    -   Enter the service name (e.g., "Google").
    -   Add an optional tag (e.g., "Work Email").
    -   Enter your username and password. You can use the "Generate" button to create a strong password and the "Analyze" button to check its strength.
    -   Click "Save Securely."
3.  **View Your Vault**:
    -   Click the "Saved Info" button in the header to access your vault.
    -   Use the search bar to filter by service or tag.
    -   Click the eye icon (👁️) to reveal a password and username.
    -   Click the pencil icon (✏️) to edit an entry.
    -   Click the trash icon (🗑️) to delete an entry.

## 🛠️ Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Encryption**: crypto-js (AES)