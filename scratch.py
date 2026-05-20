import json
import re

with open('templates/page.json', 'r', encoding='utf-8') as f:
    text = f.read()

comment_match = re.match(r'(/\*.*?\*/)', text, flags=re.DOTALL)
prefix = comment_match.group(1) + '\n' if comment_match else ''
text_no_comment = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL).strip()
data = json.loads(text_no_comment)

liquid = data['sections']['custom_liquid_CMiKrY']['settings']['custom_liquid']

# 1. Replace CSS
css_old = r'\.custom-order \.submit-row \{.*?\.custom-order \.wishlist-btn:hover svg \{[^}]*\}'
css_new = '''
.custom-order .product-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 30px;
}
.custom-order .quantity-wrapper {
  display: flex;
  align-items: center;
  background: #252525;
  width: 130px;
  justify-content: space-between;
}
.custom-order .qty-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  padding: 12px 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.custom-order .qty-btn:hover {
  opacity: 0.7;
}
.custom-order .qty-input {
  background: transparent;
  border: none;
  color: #fff;
  width: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 0;
  -moz-appearance: textfield;
}
.custom-order .qty-input::-webkit-outer-spin-button,
.custom-order .qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.custom-order .add-to-cart-btn {
  flex-grow: 1;
  background: #0a0a0a;
  color: #fff;
  border: none;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s;
}
.custom-order .add-to-cart-btn:hover {
  background: #1a1a1a;
}
'''
# Try replacing CSS
if re.search(css_old, liquid, flags=re.DOTALL):
    liquid = re.sub(css_old, css_new.strip(), liquid, flags=re.DOTALL)
else:
    print("CSS match failed")

# 2. Remove old quantity
liquid = re.sub(r'<div class="form-row"><label class="row-label">Quantity</label><input type="number" name="quantity" min="1" value="1"></div>\s*', '', liquid)

# 3. Replace submit row HTML (including wishlist)
html_old = r'<div class="submit-row"><button type="submit" class="add-to-bag-btn">.*?</button>\s*<button type="button" class="wishlist-btn".*?</button></div>'
html_new = '''<div class="product-actions">
        <div class="quantity-wrapper">
          <button type="button" class="qty-btn" id="qty-minus">&minus;</button>
          <input type="number" class="qty-input" name="quantity" id="qty-input" min="1" value="1">
          <button type="button" class="qty-btn" id="qty-plus">+</button>
        </div>
        <button type="submit" class="add-to-cart-btn">ADD TO CART</button>
      </div>'''
if re.search(html_old, liquid, flags=re.DOTALL):
    liquid = re.sub(html_old, html_new, liquid, flags=re.DOTALL)
else:
    # Try just the add to bag button in case wishlist is already missing
    html_old2 = r'<div class="submit-row"><button type="submit" class="add-to-bag-btn">.*?</button></div>'
    if re.search(html_old2, liquid, flags=re.DOTALL):
        liquid = re.sub(html_old2, html_new, liquid, flags=re.DOTALL)
    else:
        print("HTML match failed")

# 4. Add JS for quantity
js_insert = '''
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      qtyInput.value = val + 1;
    });
  }
'''
if 'qtyMinus.addEventListener' not in liquid:
    liquid = liquid.replace('const productForm = document.getElementById(\'product-form\');', js_insert.strip() + '\n\n  const productForm = document.getElementById(\'product-form\');')

data['sections']['custom_liquid_CMiKrY']['settings']['custom_liquid'] = liquid

with open('templates/page.json', 'w', encoding='utf-8') as f:
    f.write(prefix + json.dumps(data, indent=2) + '\n')
