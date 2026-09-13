import React from "react";

interface PolicyPageProps {
  title: string;
  subtitle: string;
  content?: string;
}

export default function PolicyPage({
  title,
  subtitle,
}: PolicyPageProps) {
  return (
    <main className="policy-page">

      {/* ================================
          HERO SECTION
      ================================= */}
      <section className="policy-hero">
        <div className="policy-hero-inner">

          <p className="policy-eyebrow">
            ✦ {subtitle}
          </p>

          <h1>{title}</h1>

          <div className="policy-hero-line" />

          <p className="policy-updated">
            Last Updated: September 12, 2026
          </p>

        </div>
      </section>


      {/* ================================
          POLICY CONTENT
      ================================= */}
      <section className="policy-wrapper">

        <div className="policy-content">

          {/* INTRODUCTION */}
          <div className="policy-intro">

            <p>
              SR Artémore (“we,” “our,” or “us”) respects your privacy
              and is committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, store,
              protect, and disclose information when you visit or use
              our website, create an account, place an order, communicate
              with us, or otherwise use our services.
            </p>

            <p>
              By accessing or using our website, you acknowledge that
              you have read and understood this Privacy Policy.
            </p>

          </div>


          {/* 01 */}
          <PolicySection
            number="01"
            title="Information We Collect"
          >
            <p>
              We may collect information that you provide directly to us
              when you use our website or services.
            </p>

            <PolicySubsection title="Personal and Contact Information">
              <p>
                This may include your full name, email address, phone
                number, billing address, shipping address, and other
                contact information provided during inquiries or
                customer support.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Account Information">
              <p>
                When you create an account, we may collect and maintain
                information such as your email address or username,
                password, account preferences, saved addresses,
                wishlist or favorite products, and account-related
                settings.
              </p>

              <p>
                Your password is stored using appropriate security
                measures and should never be shared with anyone else.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Order and Transaction Information">
              <p>
                When you place an order, we may collect information
                relating to your transaction, including products
                purchased, order details, quantity of products, order
                value, shipping and delivery information, returns,
                cancellations, exchanges, and order history.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Payment Information">
              <p>
                Payment information may be processed through the payment
                service provider used for your transaction.
              </p>

              <p>
                We may receive information necessary to confirm and
                process your payment, such as transaction status, payment
                confirmation, payment method, and transaction reference.
              </p>

              <p>
                We do not intentionally store complete card numbers,
                CVV numbers, or other sensitive payment credentials on
                our own systems.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Communications">
              <p>
                If you contact us, we may retain the information you
                provide, including messages, inquiries, feedback,
                complaints, and other communications.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Device and Technical Information">
              <p>
                When you access our website, certain technical
                information may automatically be collected, including
                your IP address, browser type, device type, operating
                system, website pages visited, date and time of access,
                general usage information, and other technical
                information necessary to operate and secure the website.
              </p>
            </PolicySubsection>
          </PolicySection>


          {/* 02 */}
          <PolicySection
            number="02"
            title="How We Collect Information"
          >
            <p>
              We may collect information through several methods,
              including:
            </p>

            <PolicyList
              items={[
                <>
                  <strong>Directly From You</strong> — when you create
                  an account, place an order, add products to your cart,
                  add products to your wishlist, contact us, subscribe
                  to communications, submit forms, or provide
                  information during checkout.
                </>,
                <>
                  <strong>Automatically</strong> — certain technical
                  and usage information may be collected automatically
                  when you browse or interact with our website.
                </>,
                <>
                  <strong>Through Service Providers</strong> — we may
                  use trusted third-party service providers that assist
                  us with payment processing, website hosting, order
                  fulfillment, shipping, email communication, analytics,
                  website security, and customer support.
                </>,
              ]}
            />
          </PolicySection>


          {/* 03 */}
          <PolicySection
            number="03"
            title="How We Use Your Information"
          >
            <p>
              Depending on how you interact with us, we may use the
              information we collect for the following purposes:
            </p>

            <PolicySubsection title="To Provide Our Services">
              <PolicyList
                items={[
                  "Create and manage your account",
                  "Process and fulfill orders",
                  "Process payments",
                  "Arrange shipping and delivery",
                  "Manage returns and cancellations",
                  "Provide customer support",
                  "Maintain your wishlist and cart",
                  "Provide access to your order history",
                ]}
              />
            </PolicySubsection>

            <PolicySubsection title="To Improve Our Website">
              <p>
                We may use information about how visitors interact with
                our website to improve website functionality, user
                experience, performance, and security, understand
                customer preferences, develop new products and
                services, and identify technical problems.
              </p>
            </PolicySubsection>

            <PolicySubsection title="To Communicate With You">
              <PolicyList
                items={[
                  "Respond to inquiries",
                  "Provide customer support",
                  "Send order confirmations",
                  "Send shipping or delivery updates",
                  "Communicate about account-related matters",
                  "Provide important service-related information",
                ]}
              />
            </PolicySubsection>

            <PolicySubsection title="Marketing">
              <p>
                Where permitted by applicable law, we may use your
                information to send promotional communications about
                our products, collections, offers, or services.
              </p>

              <p>
                You may unsubscribe from promotional communications at
                any time.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Security and Fraud Prevention">
              <p>
                We may use information to protect accounts, detect
                suspicious activity, prevent fraud, investigate
                security incidents, protect our website and users, and
                maintain the security and integrity of our services.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Legal Requirements">
              <p>
                We may process or disclose information where necessary
                to comply with applicable laws, respond to lawful
                requests, protect our legal rights, resolve disputes,
                enforce our terms and policies, or prevent illegal or
                harmful activity.
              </p>
            </PolicySubsection>
          </PolicySection>


          {/* 04 */}
          <PolicySection
            number="04"
            title="Cookies and Similar Technologies"
          >
            <p>
              Our website may use cookies and similar technologies to
              improve functionality and user experience.
            </p>

            <PolicyList
              items={[
                "Keep you signed in",
                "Remember your shopping cart",
                "Remember preferences",
                "Understand website usage",
                "Improve website performance",
                "Maintain website security",
              ]}
            />

            <p>
              You can control or disable cookies through your browser
              settings. However, disabling certain cookies may affect
              some website functionality.
            </p>
          </PolicySection>


          {/* 05 */}
          <PolicySection
            number="05"
            title="Shopping Cart and Wishlist Information"
          >
            <p>
              When you add products to your cart or wishlist,
              information relating to those products may be associated
              with your account or browser session.
            </p>

            <p>
              This information may be used to provide features such as
              saving products in your cart, maintaining your wishlist,
              showing your previous selections, and improving your
              shopping experience.
            </p>
          </PolicySection>


          {/* 06 */}
          <PolicySection
            number="06"
            title="How We Share Your Information"
          >
            <p>
              We do not sell your personal information for money.
            </p>

            <p>
              We may share information with trusted third parties where
              necessary to operate our website and provide our services.
            </p>

            <PolicySubsection title="Payment Providers">
              <p>
                Payment service providers may process payment
                information necessary to complete transactions.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Shipping and Delivery Providers">
              <p>
                We may provide necessary information such as your name,
                phone number, shipping address, and order details to
                delivery partners.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Technology and Hosting Providers">
              <p>
                We may use third-party providers for website hosting,
                database infrastructure, security, analytics, email
                services, and other technical requirements.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Customer Support Providers">
              <p>
                Information may be shared with service providers that
                assist us in responding to customer inquiries and
                providing support.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Legal or Government Authorities">
              <p>
                We may disclose information where required by law,
                legal proceedings, governmental requests, or to protect
                our rights, users, or services.
              </p>
            </PolicySubsection>

            <p>
              We require service providers handling personal
              information on our behalf to use reasonable measures to
              protect that information.
            </p>
          </PolicySection>


          {/* 07 */}
          <PolicySection
            number="07"
            title="Data Security"
          >
            <p>
              We take reasonable technical and organizational measures
              to protect your personal information against unauthorized
              access, loss, misuse, alteration, or disclosure.
            </p>

            <p>
              However, no internet-based system can be guaranteed to be
              completely secure.
            </p>

            <p>
              You are responsible for maintaining the confidentiality
              of your account credentials and should not share your
              password with anyone.
            </p>

            <p>
              If you believe that your account or personal information
              has been compromised, please contact us promptly.
            </p>
          </PolicySection>


          {/* 08 */}
          <PolicySection
            number="08"
            title="Data Retention"
          >
            <p>
              We retain personal information only for as long as
              reasonably necessary for the purposes described in this
              Privacy Policy.
            </p>

            <p>
              The length of time information is retained may depend on:
            </p>

            <PolicyList
              items={[
                "Whether you maintain an account",
                "Whether we need to fulfill an order",
                "Customer service requirements",
                "Legal or regulatory requirements",
                "Accounting and business requirements",
                "Resolution of disputes",
                "Enforcement of our agreements and policies",
              ]}
            />

            <p>
              When information is no longer required, we may securely
              delete or anonymize it where appropriate.
            </p>
          </PolicySection>


          {/* 09 */}
          <PolicySection
            number="09"
            title="Your Privacy Rights"
          >
            <p>
              Depending on applicable law and your location, you may
              have certain rights regarding your personal information.
            </p>

            <PolicySubsection title="Right to Access">
              <p>
                You may request access to personal information we hold
                about you.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Right to Correction">
              <p>
                You may request that inaccurate or incomplete
                information be corrected.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Right to Deletion">
              <p>
                You may request deletion of your personal information,
                subject to applicable legal or business requirements.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Right to Data Portability">
              <p>
                Where applicable, you may request a copy of certain
                personal information in a commonly used format.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Right to Withdraw Consent">
              <p>
                Where processing is based on your consent, you may
                withdraw that consent.
              </p>
            </PolicySubsection>

            <PolicySubsection title="Marketing Preferences">
              <p>
                You may unsubscribe from promotional emails by using
                the unsubscribe option included in our communications.
              </p>

              <p>
                You may continue to receive important non-promotional
                communications relating to your account, orders, or
                transactions.
              </p>
            </PolicySubsection>
          </PolicySection>


          {/* 10 */}
          <PolicySection
            number="10"
            title="Children's Privacy"
          >
            <p>
              Our website is not intended for children who are under
              the age of majority applicable in their jurisdiction.
            </p>

            <p>
              We do not knowingly collect personal information from
              children without appropriate authorization.
            </p>

            <p>
              If you believe that a child has provided us with personal
              information, please contact us so that we can take
              appropriate steps to address the situation.
            </p>
          </PolicySection>


          {/* 11 */}
          <PolicySection
            number="11"
            title="Third-Party Websites"
          >
            <p>
              Our website may contain links to third-party websites,
              services, or platforms.
            </p>

            <p>
              We are not responsible for the privacy practices,
              security, or content of third-party websites.
            </p>

            <p>
              When you visit a third-party website, we recommend
              reviewing its privacy policy and terms before providing
              personal information.
            </p>
          </PolicySection>


          {/* 12 */}
          <PolicySection
            number="12"
            title="International Data Transfers"
          >
            <p>
              Depending on the services and technology providers we
              use, your personal information may be processed or stored
              in countries other than the country in which you live.
            </p>

            <p>
              Where required by applicable law, we will take appropriate
              measures to protect personal information when it is
              transferred internationally.
            </p>
          </PolicySection>


          {/* 13 */}
          <PolicySection
            number="13"
            title="Changes to This Privacy Policy"
          >
            <p>
              We may update this Privacy Policy from time to time to
              reflect changes in our website, services, business
              practices, technology, or applicable legal requirements.
            </p>

            <p>
              When we make changes, we will update the “Last Updated”
              date at the top of this Privacy Policy.
            </p>

            <p>
              We encourage you to review this page periodically to stay
              informed about how we protect your information.
            </p>
          </PolicySection>


          {/* 14 */}
          <PolicySection
            number="14"
            title="Contact Us"
            last
          >
            <p>
              If you have questions about this Privacy Policy, our
              privacy practices, or would like to exercise any
              applicable privacy rights, please contact us.
            </p>

            <div className="policy-contact-card">

              <div className="contact-item">
                <span>Email</span>
                <a href="mailto:srartemore@gmail.com">
                  srartemore@gmail.com
                </a>
              </div>

              <div className="contact-item">
                <span>Address</span>
                <p>
                  SR ARTÉMORE
                  <br />
                  27 Old Gloucester Street
                  <br />
                  London WC1N 3AX
                  <br />
                  United Kingdom
                </p>
              </div>

            </div>

            <p className="policy-controller">
              For the purpose of applicable data protection laws, we
              are the data controller of your personal information.
            </p>
          </PolicySection>

        </div>

      </section>

    </main>
  );
}


/* =========================================
   REUSABLE POLICY SECTION
========================================= */

function PolicySection({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <article
      className={`policy-section ${
        last ? "policy-section-last" : ""
      }`}
    >
      <div className="policy-section-heading">

        <span className="policy-number">
          {number}
        </span>

        <h2>{title}</h2>

      </div>

      <div className="policy-section-body">
        {children}
      </div>
    </article>
  );
}


/* =========================================
   POLICY SUBSECTION
========================================= */

function PolicySubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="policy-subsection">

      <h3>{title}</h3>

      <div>
        {children}
      </div>

    </div>
  );
}


/* =========================================
   POLICY LIST
========================================= */

function PolicyList({
  items,
}: {
  items: React.ReactNode[];
}) {
  return (
    <ul className="policy-list">
      {items.map((item, index) => (
        <li key={index}>
          <span className="policy-bullet">✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}