import re

with open('sections/custom-3d-automotive-stickers.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

new_html = '''          <div class="product-price-quantity" style="border: none; padding: 0; margin: 0;">
            <div class="price-section" style="margin-bottom: 20px;">
              <span id="product-price" class="product-price" style="font-size: 20px; font-weight: 700; color: #fff;">{{ product.selected_or_first_available_variant.price | money }}</span>
            </div>
            
            <div class="product-actions" style="display: flex; gap: 12px; width: 100%; margin-top: 15px;">
              <div class="quantity-wrapper" style="display: flex; align-items: center; background: #252525; width: 130px; justify-content: space-between;">
                <button type="button" class="qty-btn" id="qty-minus" style="background: transparent; border: none; color: #fff; font-size: 20px; padding: 12px 16px; cursor: pointer;">&minus;</button>
                <input type="number" class="qty-input" name="quantity" id="qty-input" min="1" value="1" style="background: transparent; border: none; color: #fff; width: 40px; text-align: center; font-size: 16px; font-weight: 600; padding: 0; -moz-appearance: textfield;">
                <button type="button" class="qty-btn" id="qty-plus" style="background: transparent; border: none; color: #fff; font-size: 20px; padding: 12px 16px; cursor: pointer;">+</button>
              </div>
              <button type="submit" class="btn-add-to-cart" {% unless product.available %}disabled{% endunless %} style="flex-grow: 1; background: #0a0a0a; color: #fff; border: none; padding: 16px 20px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer;">
                {% if product.available %}ADD TO CART{% else %}OUT OF STOCK{% endif %}
              </button>
            </div>
          </div>'''

old_pattern = r'<div class="product-price-quantity">.*?</button>'
if re.search(old_pattern, text, flags=re.DOTALL):
    text = re.sub(old_pattern, new_html, text, flags=re.DOTALL)
    
    js_insert = '''
    const qtyMinusSection = document.getElementById('qty-minus');
    const qtyPlusSection = document.getElementById('qty-plus');
    const qtyInputSection = document.getElementById('qty-input');
    
    if (qtyMinusSection && qtyPlusSection && qtyInputSection) {
      qtyMinusSection.addEventListener('click', () => {
        let val = parseInt(qtyInputSection.value) || 1;
        if (val > 1) qtyInputSection.value = val - 1;
      });
      qtyPlusSection.addEventListener('click', () => {
        let val = parseInt(qtyInputSection.value) || 1;
        qtyInputSection.value = val + 1;
      });
    }
'''
    if 'qtyMinusSection.addEventListener' not in text:
        text = text.replace('const variantSelect = document.getElementById(\'variant-selector\');', js_insert.strip() + '\n\n    const variantSelect = document.getElementById(\'variant-selector\');')

    with open('sections/custom-3d-automotive-stickers.liquid', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated sections/custom-3d-automotive-stickers.liquid")
else:
    print("Pattern not found in custom-3d-automotive-stickers.liquid")
