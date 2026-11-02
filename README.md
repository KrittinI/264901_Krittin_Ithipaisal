## Assignment #1

The discount module is to calculate the final price of an order by applying multiple discount campaigns to
items added to the shopping cart. The campaigns are as listed below:

| Campaigns                            | Category | Discount Rules                                                                                                                                                                                      | Examples                                                                                                                                                         |
| ------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fixed amount                         | Coupon   | Discounts the entire cart by subtracting an amount from the total price<br><br>Parameters:<br>\* Amount                                                                                             | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br><br>Discount: 50 THB<br>Total Price: 550 THB                                                           |
| Percentage discount                  | Coupon   | Discounts the entire cart by subtracting a percentage from the total price<br><br>Parameters:<br>\* Percentage                                                                                      | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br><br>Discount: 10%<br>Total Price: 540 THB                                                              |
| Percentage discount by item category | On Top   | Discount the entire amount of a specific category of items in cart<br><br>Parameters:<br>_ Category (Clothing, Accessories, Electronics)<br>_ Amount                                                | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hoodie: 700 THB<br>1 Watch: 850 THB<br>1 Bag: 640 THB<br><br>Discount: 15% Off on Clothing<br>Total Price: 2,382.5 THB |
| Discount by points                   | On Top   | Users spent points for a fixed amount of discount (1 point = 1 THB). The amount will be capped at 20% of total price<br><br>Parameters:<br>\* Customer points<br><br>Noted that “20%” is fixed rule | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br>1 Belt: 230 THB<br><br>Points: 68 Points<br><br>Total Price: 762 THB                                   |
| Special campaigns                    | Seasonal | From the total price, at every X THB, subtracting a fixed amount Y THB<br><br>Parameters:<br>_ Every X THB<br>_ Discount Y THB                                                                      | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br>1 Belt: 230 THB<br><br>Discount: 40 THB at every 300 THB<br>Total Price: 750 THB                       |

## Users can apply multiple discount campaigns in an order. However, there are rules for applying as below:

- Apply only one campaign from the same category, i.e. users have to choose either Fixed amount or
  Percentage discount.
- The order of applying campaigns is **Coupon > On Top > Seasonal**.

## Your task is to create the discount module that has the following attributes:

- Take the list items in a shopping cart.
- Take the list of discount campaigns and their parameters to apply.
- Calculate the final price according to the rules.

### In order assumptions for applying order to discion

Method POST /orders

```json
{
  "orders": [{ "id": 1, "amount": 1 }],
  "coupon": "",
  "onTop": "",
  "seasonal": ""
}
```

type percentage not more than 100

Method POST /coupons

```json
{
  "type": "fixed | percentage",
  "amount": 10
}
```

Method PUT /coupons/:couponId

```json
{
  "type": "fixed | percentage",
  "amount": 10
}
```

Method GET /coupons

```json
{
  "coupons": [{ "id": 1, "type": "fixed | percentage", "amount": 10 }]
}
```

Method POST /ontop

```json
{
  "type": "clothing | accessories | electronics | points",
  "amount": 10
}
```

Method PUT /ontop/:ontopId

```json
{
  "type": "clothing | accessories | electronics | points",
  "amount": 10
}
```

Method GET /ontop

```json
{
  "ontop": []
}
```

condition for seasonal
discount not greater than every
ex:

```json
{
  "every": 10,
  "discount": 100
}
```

Method POST /seasonal

```json
{
  "every": 10,
  "discount": 1
}
```

Method PUT /seasonal/sesaonalId

```json
{
  "every": 10,
  "discount": 1
}
```

Method GET /seasonal

```json
{
  "seasonal": []
}
```

Method GET /products

```json
{
  "products": [
    {
      "id": 1,
      "name": "T-Shirt",
      "category": "Clothing",
      "price": 350
    },
    {
      "id": 2,
      "name": "Hat",
      "category": "Accessories",
      "price": 250
    },
    {
      "id": 3,
      "name": "Hoodie",
      "category": "Clothing",
      "price": 700
    },
    {
      "id": 4,
      "name": "Watch",
      "category": "Electronics",
      "price": 850
    },
    {
      "id": 5,
      "name": "Bag",
      "category": "Accessories",
      "price": 640
    },
    {
      "id": 6,
      "name": "Belt",
      "category": "Accessories",
      "price": 230
    },
    {
      "id": 7,
      "name": "Shoes",
      "category": "Clothing",
      "price": 1200
    }
  ]
}
```
