describe('onliner - testing API endpoints', () => {

  it('Verify any product is present in certain shops', () => { 

    cy.intercept({
      method: 'GET',
      url: '**sdapi/shop.api/products/**',
    }).as('shops');

    cy.visit(`${Cypress.env('baseUrl')}/notebook/lenovo/82fg00fwre`);


    //expected shops [2518, 3886, 19463, 19502, 19938]
    cy.wait('@shops').then((interception) => {
      expect(interception.response.body.shops).to.have.property(2518);
      expect(interception.response.body.shops).to.have.property(3886);
      expect(interception.response.body.shops).to.have.property(19463);
      expect(interception.response.body.shops).to.have.property(19502);
      expect(interception.response.body.shops).to.have.property(19938);
    });
  });

  it('Add to cart and delete from cart', () => { 
    
    cy.intercept({
      method: 'POST',
      url: '**sdapi/cart.api/detached-cart/**',
    }).as('cart');

    cy.visit(`${Cypress.env('baseUrl')}/notebook/lenovo/82fg00fwre`);
    cy.get("a.button-style.button-style_base-alter:nth-child(3)").click({force: true});

    cy.wait('@cart').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    });

    cy.intercept({
      method: 'DELETE',
      url: '**/sdapi/cart.api/detached-cart/**',
    }).as('deletedItem')

    cy.get('.product-recommended__control_checkout > .button-style_another').click();
    cy.get('.cart-form__offers-part_remove > .cart-form__control > a').click({force: true});

    cy.wait('@deletedItem').then((interception) => {
      expect(interception.request.body.positions[0].shop_id).to.equal(3886)
      expect(interception.request.body.positions[0].product_id).to.equal(2204772)
      expect(interception.response.statusCode).to.equal(204)
    })
  })
})
