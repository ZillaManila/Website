// Lightweight cart kept in the visitor's browser until checkout is connected.
export interface CartItem {
  id: string;
  slug: string;
  name: string;
  variant: string;
  price: number;
  shipping: number;
  image: string;
  qty: number;
  max: number;
}

const KEY = 'gummikins-cart-v1';

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable: cart lives for this page view only */
  }
  memory = items;
  window.dispatchEvent(new CustomEvent('cart:change', { detail: items }));
}

let memory: CartItem[] | null = null;

export const cart = {
  items(): CartItem[] {
    if (!memory) memory = read();
    return memory;
  },
  count() {
    return this.items().reduce((n, i) => n + i.qty, 0);
  },
  subtotal() {
    return this.items().reduce((n, i) => n + i.qty * i.price, 0);
  },
  // Single-item orders use the flat rate for that size; more items are quoted at checkout.
  shipping(): number | null {
    const items = this.items();
    if (this.count() === 1) return items[0].shipping;
    return null;
  },
  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const items = [...this.items()];
    const found = items.find((i) => i.id === item.id);
    if (found) found.qty = Math.min(found.max, found.qty + qty);
    else items.push({ ...item, qty: Math.min(item.max, qty) });
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = this.items()
      .map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(i.max, qty)) } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  remove(id: string) {
    write(this.items().filter((i) => i.id !== id));
  },
};

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
