import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js'; 
import { formatCurrency } from '../utils/money.js';  
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js'; 



export function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productsId = cartItem.productsId;

    const matchingProducts = getProduct(productsId);

    

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

   


    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    

  cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container
      js-cart-item-container-${matchingProducts.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProducts.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProducts.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProducts.priceCents)}
            </div>
            <div class="product-quantity
              js-product-quantity-${matchingProducts.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link
                js-delete-link-${matchingProducts.id}"
                data-products-id="${matchingProducts.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
              ${deliveryOptionsHTML(matchingProducts, cartItem)}
          </div>
        </div>
      </div>
      `;


  });

  function deliveryOptionsHTML(matchingProducts, cartItem) {

    let html = '';
    deliveryOptions.forEach((deliveryOptions) =>{

      const today = dayjs();
      const deliveryDate = today.add(deliveryOptions.deliveryDays, 'days');
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOptions.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOptions.priceCents)} -`;

      const isChecked = deliveryOptions.id === cartItem.deliveryOptionId;
      
      html += `
      <div class="delivery-option js-delivery-option"
      data-products-id="${matchingProducts.id}"
      data-delivery-option-id="${deliveryOptions.id}">
        <input type="radio" 
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
          name="delivery-option-${matchingProducts.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
            `
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productsId = link.dataset.productsId;
      removeFromCart(productsId);
      
      const container = document.querySelector(`.js-cart-item-container-${productsId}`);
      container.remove();

      renderPaymentSummary();

    })
  });

    document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        element.addEventListener('click',() => {
          const {productsId, deliveryOptionId} = element.dataset
          updateDeliveryOption(productsId, deliveryOptionId);
          renderOrderSummary();
          renderPaymentSummary();
        });
      });
  
}    
