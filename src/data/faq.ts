// FAQ content. `home: true` shows the question on the homepage too.
// Answers may contain simple HTML (links, <p>, <strong>).
export interface Faq {
  q: string;
  a: string;
  id?: string;
  home?: boolean;
}

export const faqs: { group: string; items: Faq[] }[] = [
  {
    group: 'Ordering & shipping',
    items: [
      {
        q: 'How long until my order ships?',
        a: '<p>Ready-to-ship Gummikins leave our hands within 2–4 business days. Giant Gummikins and other special orders are made after you order, and we will confirm the timing with you before we start.</p>',
        home: true,
      },
      {
        q: 'How much is shipping?',
        a: '<p>We ship within the US with USPS Ground Advantage. A single item ships for a flat rate based on its size: Keychain $6.95, Small $7.95, Medium $8.95, Large $10.95, Giant $15.95, and Nest Blankets $10.95–$15.95. Orders with more than one item are calculated at checkout. See the <a href="/policies/shipping">shipping policy</a> for details.</p>',
        home: true,
      },
      {
        q: 'Do you ship internationally?',
        a: '<p>Not yet, but we are working on it. Join the newsletter or <a href="/contact">send us a note</a> and we will let you know as soon as we can ship to you.</p>',
      },
      {
        q: 'Is sales tax included?',
        a: '<p>Sales tax is calculated at checkout based on your delivery address.</p>',
      },
      {
        q: 'What is a Little Drop?',
        id: 'little-drop',
        a: '<p>Little Drops are tiny Gummikins we make from leftover yarn so nothing goes to waste. We tuck one into orders as a free surprise. They are not sold on their own, and they are only available as supplies last, so colors are always a surprise.</p>',
      },
    ],
  },
  {
    group: 'Handmade & materials',
    items: [
      {
        q: 'Will my Gummikins look exactly like the photo?',
        a: '<p>Very close, but not identical. Every Gummikins is crocheted by hand, so size, shape, stitch texture, and smile can vary a little from the one pictured. We think those small differences are what make each one yours.</p>',
        home: true,
      },
      {
        q: 'What are Gummikins made of?',
        a: '<p>Most Gummikins are made with soft acrylic yarn, polyester fiberfill, plastic safety eyes, and an embroidered smile. Nest Blankets and some special pieces use chenille. Each product page lists its exact materials.</p>',
      },
      {
        q: 'Are Gummikins safe for babies and young children?',
        a: '<p>Gummikins are made with safety eyes that lock in from the inside, but they are handmade items and are not tested or certified as baby toys. We recommend them for ages 3 and up. Keychains have a metal ring and are not for small children. Please supervise little ones with any plush.</p>',
      },
    ],
  },
  {
    group: 'Sensory & feel',
    items: [
      {
        q: 'Are Gummikins good for people who like sensory or tactile things?',
        a: '<p>Many of our customers, including neurodivergent kids, teens, and adults, love Gummikins for how they feel. Each product page describes the softness, squishiness, weight, and texture so you can choose what feels right. Gummikins are comfort objects, not medical or therapeutic devices.</p>',
        home: true,
      },
      {
        q: 'Do they make any noise?',
        a: '<p>No. There are no rattles, crinkle paper, beads, or buttons inside. Just yarn and soft stuffing.</p>',
      },
    ],
  },
  {
    group: 'Care',
    items: [
      {
        q: 'How do I clean my Gummikins?',
        a: '<p>Spot clean with a damp cloth and a little mild soap, then gently reshape and let it air dry. Please don’t put Gummikins in the dryer. Nest Blankets and Texture Squares can be washed on a gentle cycle in a laundry bag and laid flat to dry.</p>',
      },
    ],
  },
  {
    group: 'Returns & gifts',
    items: [
      {
        q: 'Can I return a Gummikins?',
        a: '<p>Because every piece is handmade in small batches, we accept returns of unused items in original condition within 14 days of delivery. Special orders are final sale. If something arrives damaged, contact us within 7 days and we will make it right. Read the full <a href="/policies/returns">returns policy</a>.</p>',
      },
      {
        q: 'Can I send a Gummikins as a gift?',
        a: '<p>Yes! Ship it straight to the person you are thinking of. Add a gift note at checkout and we will handwrite it on a card and leave prices out of the package.</p>',
      },
    ],
  },
  {
    group: 'Giant Gummikins & special orders',
    items: [
      {
        q: 'How do I order a Giant Gummikins?',
        a: '<p>Giants are made to order. Fill out the <a href="/custom">special order form</a> with the color you have in mind and when you need it, and we will reply with a timeline and final price.</p>',
      },
      {
        q: 'Can I request a custom color or matching set?',
        a: '<p>Often, yes. Tell us what you are dreaming up on the <a href="/custom">special order page</a>. We will let you know what is possible with the yarns we have.</p>',
      },
    ],
  },
];
