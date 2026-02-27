<script setup lang="ts">
// Shipping Policy View
// Content sourced from docs/Shipping Policy.md
</script>

<template>
  <div class="policy-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Shipping Policy</h1>
        <p class="subtitle">Carefully packed and thoughtfully handcrafted.</p>
      </div>
    </div>

    <div class="policy-content">
      <p class="intro-text">
        At Blue Penguin, every piece is thoughtfully handcrafted and carefully packed. Because many
        of our items are made-to-order or produced in limited batches, shipping timelines may vary
        slightly.
      </p>

      <div class="policy-section">
        <h2>1. Order Processing Time</h2>
        <ul>
          <li><strong>Ready-to-ship items:</strong> Dispatched within 2–4 business days.</li>
          <li><strong>Made-to-order items:</strong> Dispatched within 5–10 business days.</li>
          <li>
            <strong>Custom or personalized pieces:</strong> Processing time will be communicated at
            the time of order.
          </li>
        </ul>
        <p>Orders are processed on business days only (excluding Sundays and public holidays).</p>
        <p>You will receive confirmation once your order has been shipped.</p>
      </div>

      <div class="policy-section">
        <h2>2. Shipping Timeline</h2>
        <p>Estimated delivery times after dispatch:</p>
        <ul>
          <li><strong>Within Kerala:</strong> 2–4 business days</li>
          <li><strong>Rest of India:</strong> 3–7 business days</li>
        </ul>
        <p>Delivery timelines may vary depending on courier services and location accessibility.</p>
      </div>

      <div class="policy-section">
        <h2>3. Shipping Charges</h2>
        <ul>
          <li>Shipping charges (if applicable) will be communicated at the time of order.</li>
          <li>
            Free shipping may be offered during special promotions or above certain order values.
          </li>
        </ul>
      </div>

      <div class="policy-section">
        <h2>4. Order Tracking</h2>
        <p>Once shipped, tracking details will be shared via:</p>
        <ul>
          <li>WhatsApp</li>
          <li>Instagram DM</li>
          <li>Email (if provided)</li>
        </ul>
        <p>
          Customers are responsible for ensuring accurate delivery details at the time of placing
          the order.
        </p>
      </div>

      <div class="policy-section">
        <h2>5. Delays & External Factors</h2>
        <p>While we strive to deliver on time, delays may occur due to:</p>
        <ul>
          <li>Courier service disruptions</li>
          <li>Weather conditions</li>
          <li>Public holidays</li>
          <li>Incomplete or incorrect address details</li>
        </ul>
        <p>
          Blue Penguin is not liable for delays caused by external courier partners, but we will
          always assist in tracking and resolving delivery issues.
        </p>
      </div>

      <div class="policy-section">
        <h2>6. Delivery Issues</h2>
        <p>If:</p>
        <ul>
          <li>
            The package appears damaged at the time of delivery, please record an unboxing video.
          </li>
          <li>The package is marked as delivered but not received, contact us within 24 hours.</li>
        </ul>
        <p>We will coordinate with the courier partner to investigate and resolve the issue.</p>
      </div>

      <div class="policy-section">
        <h2>7. International Shipping</h2>
        <p>Currently, we ship only within India.</p>
        <p>
          For international orders, please contact us directly to discuss availability and shipping
          costs.
        </p>
      </div>

      <div class="policy-section contact-section">
        <p>For any shipping-related queries, please contact us via:</p>
        <ul>
          <li>Instagram DM</li>
          <li>WhatsApp</li>
          <li>Email: blue.penguin.india@gmail.com</li>
        </ul>
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
  background-color: var(--color-bg-light);
  display: flex;
  flex-direction: column;
}

.hero-section {
  background-color: var(--color-blue-primary);
  color: var(--color-white);
  padding: var(--spacing-6xl) var(--spacing-2xl) var(--spacing-5xl);
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
  font-size: var(--font-size-5xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: var(--font-size-xl);
  opacity: 0.9;
  font-weight: 300;
}

.policy-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-5xl) var(--spacing-2xl);
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transform: translateY(-2rem);
  position: relative;
  z-index: 20;
}

.intro-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-main);
  line-height: 1.8;
  margin-bottom: var(--spacing-4xl);
  text-align: center;
  font-style: italic;
}

.policy-section {
  margin-bottom: var(--spacing-4xl);
}

.policy-section h2 {
  font-size: var(--font-size-2xl);
  color: var(--color-text-main);
  margin-bottom: var(--spacing-xl);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.policy-section p {
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-md);
}

.policy-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.policy-section li {
  color: var(--color-text-light);
  line-height: 1.8;
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
}

.contact-section {
  background-color: var(--color-bg-soft);
  padding: var(--spacing-xl);
  border-left: 4px solid var(--color-blue-primary);
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-3xl);
}

.contact-section p {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.contact-section ul {
  margin-bottom: 0;
}

.back-navigation {
  margin-top: var(--spacing-5xl);
  text-align: center;
  padding-top: var(--spacing-3xl);
  border-top: 1px solid var(--color-border);
}

.btn-primary {
  display: inline-block;
  background-color: var(--color-blue-primary);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-md);
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
    padding: var(--spacing-5xl) var(--spacing-xl) var(--spacing-4xl);
  }

  .hero-section h1 {
    font-size: var(--font-size-4xl);
  }

  .policy-content {
    padding: 2.5rem 1.5rem;
    transform: translateY(-1rem);
    border-radius: 0;
    box-shadow: none;
  }

  .intro-text {
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-3xl);
  }
}
</style>
