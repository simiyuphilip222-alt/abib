import React from "react";

function Privacy() {
  return (
    <div style={{ padding: "20px", lineHeight: "1.6" }}>
      <h1>Privacy Policy</h1>

      <p>
        We value your privacy and are committed to protecting your personal data.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li>Personal details (name, email)</li>
        <li>Order and transaction data</li>
      </ul>

      <h3>2. How We Use Information</h3>
      <p>
        Your data is used to process orders, improve services, and communicate with you.
      </p>

      <h3>3. Data Protection</h3>
      <p>
        We implement security measures to protect your personal information.
      </p>

      <h3>4. Third Parties</h3>
      <p>
        We may share data with trusted partners such as payment providers (e.g., PayPal).
      </p>

      <h3>5. Your Rights</h3>
      <p>
        You have the right to access, update, or request deletion of your data.
      </p>
    </div>
  );
}

export default Privacy;