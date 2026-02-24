<script setup lang="ts">
// Refund and Return Policy View
// Content sourced from docs/Return Policy.md
</script>

<template>
  <div class="policy-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Refund & Return Policy</h1>
        <p class="subtitle">Clear, fair, and transparent.</p>
      </div>
    </div>

    <div class="policy-content">
      <p class="intro-text">
        At Blue Penguin, each piece is thoughtfully handcrafted. Because many of our products are
        made-to-order or produced in small batches, we maintain a careful and transparent return
        policy.
      </p>

      <div class="policy-section">
        <h2>1. Returns Eligibility</h2>
        <p>We accept returns only under the following conditions:</p>
        <ul>
          <li>The item was received damaged or defective.</li>
          <li>The wrong item was delivered.</li>
          <li>A manufacturing defect is identified within 48 hours of delivery.</li>
        </ul>
        <p>
          To request a return, customers must contact us within 48 hours of receiving the product
          and provide:
        </p>
        <ul>
          <li>Order details</li>
          <li>Clear photos or videos showing the issue</li>
          <li>Unboxing proof (if available)</li>
        </ul>
        <p>Items must be unused, unworn, and returned in original packaging.</p>
      </div>

      <div class="policy-section">
        <h2>2. Non-Returnable Items</h2>
        <p>The following items are not eligible for return or refund:</p>
        <ul>
          <li>Custom-made or personalized jewelry</li>
          <li>Size-adjusted or specially modified pieces</li>
          <li>Items purchased during limited offers or clearance sales</li>
          <li>Minor variations in color, texture, or finish due to the handmade nature</li>
        </ul>
        <p class="note">
          <strong>Please note:</strong> Slight variations are natural in handcrafted products and
          are not considered defects.
        </p>
      </div>

      <div class="policy-section">
        <h2>3. Refund Policy</h2>
        <p>If a return is approved:</p>
        <ul>
          <li>Refunds will be processed to the original payment method.</li>
          <li>
            Processing time: 5–10 business days after we receive and inspect the returned item.
          </li>
          <li>Shipping charges (if applicable) are non-refundable.</li>
        </ul>
        <p>
          If a replacement is preferred and available, we will ship a replacement at no additional
          product cost.
        </p>
      </div>

      <div class="policy-section">
        <h2>4. Return Shipping</h2>
        <ul>
          <li>
            If the return is due to our error (damaged or incorrect item), we will cover return
            shipping.
          </li>
          <li>
            In all other approved cases, return shipping costs are the responsibility of the
            customer.
          </li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>5. Order Cancellations</h2>
        <ul>
          <li>Orders can be cancelled within 12 hours of placing the order.</li>
          <li>Custom or personalized orders cannot be cancelled once production has begun.</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>6. Contact Information</h2>
        <p>To request a return or report an issue, please contact us via:</p>
        <ul>
          <li>Instagram DM</li>
          <li>WhatsApp</li>
          <li>Email: blue.penguin.india@gmail.com</li>
        </ul>
        <p>Please include your order number and clear details of the issue.</p>
      </div>

      <div class="back-navigation">
        <RouterLink to="/" class="btn-primary">Back to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.policy-page {
  min-height: 100vh;
  background-color: var(--color-bg-light, #f9fafb);
  display: flex;
  flex-direction: column;
}

.hero-section {
  background-color: var(--color-blue-primary, #1e3a8a);
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.policy-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transform: translateY(-2rem);
  position: relative;
  z-index: 20;
}

.intro-text {
  font-size: 1.15rem;
  color: var(--color-text-main, #1f2937);
  line-height: 1.8;
  margin-bottom: 3rem;
  text-align: center;
  font-style: italic;
}

.policy-section {
  margin-bottom: 3rem;
}

.policy-section h2 {
  font-size: 1.5rem;
  color: var(--color-text-main, #1f2937);
  margin-bottom: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-bottom: 0.5rem;
}

.policy-section p {
  color: var(--color-text-light, #4b5563);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1.05rem;
}

.policy-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.policy-section li {
  color: var(--color-text-light, #4b5563);
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.note {
  background-color: #f3f4f6;
  padding: 1rem;
  border-left: 4px solid var(--color-blue-primary, #1e3a8a);
  border-radius: 4px;
  margin-top: 1rem;
}

.back-navigation {
  margin-top: 4rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.btn-primary {
  display: inline-block;
  background-color: var(--color-blue-primary, #1e3a8a);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1.5rem 3rem;
  }

  .hero-section h1 {
    font-size: 2.25rem;
  }

  .policy-content {
    padding: 2.5rem 1.5rem;
    transform: translateY(-1rem);
    border-radius: 0;
    box-shadow: none;
  }

  .intro-text {
    font-size: 1.05rem;
    margin-bottom: 2rem;
  }
}
</style>
