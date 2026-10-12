// Store policies. SAMPLE WORDING: have the owners review before launch.
export const policies: Record<string, { title: string; description: string; updated: string; body: string }> = {
  shipping: {
    title: 'Shipping policy',
    description: 'Flat-rate shipping by size within the US, processing times, and gift shipping for Gummikins orders.',
    updated: 'October 2026',
    body: `
<p>Every Gummikins is packed by hand with care. Here’s how shipping works.</p>
<h2>Where we ship</h2>
<p>We currently ship within the United States. International shipping is coming. <a href="/contact">Contact us</a> if you’d like to be told when it’s ready.</p>
<h2>Processing time</h2>
<p>Ready-to-ship items leave our hands within 2–4 business days. Special orders and Giant Gummikins ship when finished, on the timeline we agree with you.</p>
<h2>Shipping rates</h2>
<p>Single-item orders ship via USPS Ground Advantage at a flat rate based on size:</p>
<table>
<thead><tr><th>Item</th><th>Shipping</th></tr></thead>
<tbody>
<tr><td>Keychain Gummikins</td><td>$6.95</td></tr>
<tr><td>Small Gummikins</td><td>$7.95</td></tr>
<tr><td>Medium Gummikins</td><td>$8.95</td></tr>
<tr><td>Large Gummikins</td><td>$10.95</td></tr>
<tr><td>Giant Gummikins</td><td>$15.95</td></tr>
<tr><td>Nest Blanket</td><td>$10.95–$15.95, depending on size</td></tr>
<tr><td>Texture Square</td><td>$7.95</td></tr>
</tbody>
</table>
<p>Orders with more than one item are calculated at checkout.</p>
<h2>Sales tax</h2>
<p>Sales tax is calculated at checkout based on your delivery address. Where required, tax applies to shipping charges as well.</p>
<h2>Gifts</h2>
<p>You can ship directly to a gift recipient. Add a gift note at checkout and we’ll handwrite it on a card and leave prices out of the package.</p>
<h2>Lost or damaged packages</h2>
<p>If your package arrives damaged or doesn’t arrive, <a href="/contact">contact us</a> within 7 days of the expected delivery date and we’ll help make it right.</p>`,
  },
  returns: {
    title: 'Returns & exchanges',
    description: 'How returns and exchanges work for handmade Gummikins and special orders.',
    updated: 'October 2026',
    body: `
<p>We want you to love your Gummikins. If something isn’t right, we’re here to help.</p>
<h2>Returns</h2>
<p>Unused items in their original condition can be returned within 14 days of delivery. Please <a href="/contact">contact us</a> first so we can send instructions. Return shipping is the customer’s responsibility unless the item arrived damaged or we made a mistake.</p>
<h2>Exchanges</h2>
<p>Want a different color or size? We’re happy to exchange if the one you’d like is in stock.</p>
<h2>Final sale</h2>
<p>Giant Gummikins, custom colors, and other special orders are made just for you and are final sale.</p>
<h2>Handmade variation</h2>
<p>Because every piece is made by hand, small differences in size, shape, and stitching from the photos are expected and aren’t considered defects.</p>
<h2>Damaged items</h2>
<p>If your order arrives damaged, email us a photo within 7 days of delivery and we’ll replace or refund it.</p>`,
  },
  privacy: {
    title: 'Privacy policy',
    description: 'How Gummikins collects, uses, and protects your personal information.',
    updated: 'October 2026',
    body: `
<p>Your privacy matters to us. This policy explains what we collect and why.</p>
<h2>What we collect</h2>
<ul>
<li>Information you give us when you order, join our newsletter, or contact us: your name, email, shipping address, and messages.</li>
<li>Payment details, which are handled directly by our secure payment processor. We never see or store your full card number.</li>
<li>Basic, anonymous information about how the site is used, to help us improve it.</li>
</ul>
<h2>How we use it</h2>
<ul>
<li>To process and ship your orders and answer your questions.</li>
<li>To send our newsletter, only if you sign up. You can unsubscribe anytime.</li>
<li>To keep the shop running smoothly and securely.</li>
</ul>
<h2>What we don’t do</h2>
<p>We never sell your personal information. We share it only with the services needed to run the shop, such as payment processing, shipping, and email.</p>
<h2>Your choices</h2>
<p>You can ask us to see, correct, or delete the personal information we hold about you by emailing <a href="mailto:hello@gummikins.com">hello@gummikins.com</a>.</p>
<h2>Cookies</h2>
<p>Our site uses a small amount of browser storage to remember your basket. Our checkout and analytics providers may use their own cookies.</p>`,
  },
  terms: {
    title: 'Terms of service',
    description: 'The terms that apply when you use the Gummikins website and shop.',
    updated: 'October 2026',
    body: `
<p>By using gummikins.com and placing an order, you agree to these terms.</p>
<h2>Products</h2>
<p>All Gummikins products are handmade. Colors may look slightly different on different screens, and each piece may vary a little from the photos.</p>
<h2>Pricing & availability</h2>
<p>Prices are in US dollars and may change without notice. Items are made in small batches and are available as supplies last. If an item sells out after you order, we’ll contact you with options or a full refund.</p>
<h2>Safety</h2>
<p>Gummikins are not intended for children under 3. Keychains include a metal ring and are not toys for small children. Please supervise young children with any plush.</p>
<h2>Comfort, not medical</h2>
<p>Gummikins and our sensory-friendly items are comfort objects. They are not medical or therapeutic devices and are not intended to diagnose, treat, or cure any condition.</p>
<h2>Intellectual property</h2>
<p>Gummikins™, our logo, designs, photos, and text belong to Gummikins and may not be copied or used without permission.</p>
<h2>Contact</h2>
<p>Questions about these terms? Email <a href="mailto:hello@gummikins.com">hello@gummikins.com</a>.</p>`,
  },
};
