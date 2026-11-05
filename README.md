# Playtorium Discount API

## Getting Started

Install dependencies and start the Next.js development server with npm:

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3003](http://localhost:3003). Run the linter with `npm run lint`.

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

# API Specification — Discount Campaign

### Numeric Input Validation

For Coupon, On-top, and Seasonal create/update requests, the body must be a valid JSON object. Malformed JSON, `null`, arrays, and primitive JSON values are rejected with `400 Bad Request`. Numeric fields must be JSON numbers and finite values; numeric strings such as `"10"` are rejected. Existing range rules also apply: coupon amounts and non-points On-top amounts cannot be negative; percentage values must be below 100; and Seasonal discounts cannot be negative or greater than or equal to `every`.

## Table of Contents

- [Orders](#orders)
- [Coupons](#coupons)
- [On-top Campaigns](#on-top-campaigns)
- [Seasonal Campaigns](#seasonal-campaigns)
- [Products](#products)
- [Error Responses](#error-responses)

---

# Orders

## POST `/orders`

Create a new order and calculate applicable discounts.

### Request Body

```json
{
  "orders": [
    {
      "id": 1,
      "amount": 1
    }
  ],
  "coupon": "",
  "onTop": "",
  "seasonal": ""
}
```

### Field Description

| Field             | Type   | Required | Description                   |
| ----------------- | ------ | -------- | ----------------------------- |
| `orders`          | Array  | Yes      | List of products in the order |
| `orders[].id`     | Number | Yes      | Product ID                    |
| `orders[].amount` | Number | Yes      | Product quantity              |
| `coupon`          | String | No       | Coupon ID                     |
| `onTop`           | String | No       | On-top campaign ID            |
| `seasonal`        | String | No       | Seasonal campaign ID          |

### Validation Rules

- `orders` must contain at least one product.
- Product quantity must be greater than 0.
- Percentage discount must not exceed 100%.
- Discount amount must not exceed the applicable subtotal.
- Each campaign type can be applied at most once per order.

### Example Response — 201 Created

```json
{
  "orderId": 1,
  "subtotal": 1350,
  "discount": {
    "coupon": 100,
    "onTop": 50,
    "seasonal": 100
  },
  "totalDiscount": 250,
  "total": 1100
}
```

---

# Coupons

## POST `/coupons`

Create a new coupon.

### Request Body

```json
{
  "type": "fixed",
  "amount": 10
}
```

### Field Description

| Field    | Type   | Required | Description                            |
| -------- | ------ | -------- | -------------------------------------- |
| `type`   | String | Yes      | Discount type: `fixed` or `percentage` |
| `amount` | Number | Yes      | Discount amount or percentage          |

### Validation Rules

- `type` must be `fixed` or `percentage`.
- `amount` must be greater than 0.
- If `type` is `percentage`, `amount` must not exceed 100.

### Example Response — 201 Created

```json
{
  "id": 1,
  "type": "fixed",
  "amount": 10
}
```

---

## PUT `/coupons/:couponId`

Update an existing coupon.

### Path Parameter

| Field      | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| `couponId` | Number | Yes      | Coupon ID   |

### Request Body

```json
{
  "type": "percentage",
  "amount": 20
}
```

### Example Response — 200 OK

```json
{
  "id": 1,
  "type": "percentage",
  "amount": 20
}
```

---

## GET `/coupons`

Retrieve all coupons.

### Example Response — 200 OK

```json
{
  "coupons": [
    {
      "id": 1,
      "type": "fixed",
      "amount": 10
    },
    {
      "id": 2,
      "type": "percentage",
      "amount": 20
    }
  ]
}
```

---

## GET `/coupons/:couponId`

Retrieve coupon by Id.

### Example Response — 200 OK

```json
{
  "coupon": {
    "id": 1,
    "type": "fixed",
    "amount": 10
  }
}
```

---

# On-top Campaigns

## POST `/ontop`

Create a new On-top campaign.

### Request Body

```json
{
  "type": "clothing",
  "amount": 10
}
```

### Field Description

| Field    | Type   | Required | Description       |
| -------- | ------ | -------- | ----------------- |
| `type`   | String | Yes      | Campaign category |
| `amount` | Number | Yes      | Discount amount   |

### Supported Types

| Type          | Description                       |
| ------------- | --------------------------------- |
| `clothing`    | Discount for clothing products    |
| `accessories` | Discount for accessories products |
| `electronics` | Discount for electronics products |
| `points`      | Discount based on customer points |

### Validation Rules

- `type` must be one of the supported types.
- `amount` must be greater than 0.
- Percentage discount must not exceed 100%.

### Example Response — 201 Created

```json
{
  "id": 1,
  "type": "clothing",
  "amount": 10
}
```

---

## PUT `/ontop/:ontopId`

Update an existing On-top campaign.

### Path Parameter

| Field     | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `ontopId` | Number | Yes      | On-top campaign ID |

### Request Body

```json
{
  "type": "accessories",
  "amount": 15
}
```

### Example Response — 200 OK

```json
{
  "id": 1,
  "type": "accessories",
  "amount": 15
}
```

---

## GET `/ontop`

Retrieve all On-top campaigns.

### Example Response — 200 OK

```json
{
  "ontop": [
    {
      "id": 1,
      "type": "clothing",
      "amount": 10
    },
    {
      "id": 2,
      "type": "points",
      "amount": 100
    }
  ]
}
```

---

# Seasonal Campaigns

## Discount Condition

The `every` field defines the spending threshold required to receive a discount.

The `discount` field defines the discount amount for each threshold.

### Example

```json
{
  "every": 10,
  "discount": 1
}
```

For every 10 THB spent, the customer receives a 1 THB discount.

### Calculation Formula

```text
Total Discount = floor(Subtotal / Every) * Discount
```

### Example Calculation

| Subtotal | Every | Discount | Total Discount |
| -------: | ----: | -------: | -------------: |
|       10 |    10 |        1 |              1 |
|       50 |    10 |        1 |              5 |
|      100 |    10 |        1 |             10 |
|      105 |    10 |        1 |             10 |

### Validation Rules

- `every` must be greater than 0.
- `discount` must be greater than 0.
- `discount` must not exceed `every`.
- Total discount must not exceed the applicable subtotal.

---

## POST `/seasonal`

Create a new Seasonal campaign.

### Request Body

```json
{
  "every": 10,
  "discount": 1
}
```

### Field Description

| Field      | Type   | Required | Description                   |
| ---------- | ------ | -------- | ----------------------------- |
| `every`    | Number | Yes      | Spending threshold            |
| `discount` | Number | Yes      | Discount amount per threshold |

### Example Response — 201 Created

```json
{
  "id": 1,
  "every": 10,
  "discount": 1
}
```

---

## PUT `/seasonal/:seasonalId`

Update an existing Seasonal campaign.

### Path Parameter

| Field        | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| `seasonalId` | Number | Yes      | Seasonal campaign ID |

### Request Body

```json
{
  "every": 10,
  "discount": 1
}
```

### Example Response — 200 OK

```json
{
  "id": 1,
  "every": 10,
  "discount": 1
}
```

---

## GET `/seasonal`

Retrieve all Seasonal campaigns.

### Example Response — 200 OK

```json
{
  "seasonal": [
    {
      "id": 1,
      "every": 10,
      "discount": 1
    },
    {
      "id": 2,
      "every": 500,
      "discount": 50
    }
  ]
}
```

---

# Products

## GET `/products`

Retrieve all available products.

### Example Response — 200 OK

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

### Field Description

| Field      | Type   | Description          |
| ---------- | ------ | -------------------- |
| `id`       | Number | Product ID           |
| `name`     | String | Product name         |
| `category` | String | Product category     |
| `price`    | Number | Product price in THB |

### Supported Categories

| Category      | Description          |
| ------------- | -------------------- |
| `Clothing`    | Clothing products    |
| `Accessories` | Accessories products |
| `Electronics` | Electronics products |

---

# Error Responses

## 400 Bad Request

Invalid request data or validation failure.

```json
{
  "statusCode": 400,
  "message": "Percentage discount must not exceed 100",
  "error": "Bad Request"
}
```

## 404 Not Found

Requested resource does not exist.

```json
{
  "statusCode": 404,
  "message": "Coupon not found",
  "error": "Not Found"
}
```

## 500 Internal Server Error

Unexpected server error.

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Assignment #1

The discount module is to calculate the final price of an order by applying multiple discount campaigns to

items added to the shopping cart. The campaigns are as listed below:

| Campaigns | Category | Discount Rules | Examples |

| ------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| Fixed amount | Coupon | Discounts the entire cart by subtracting an amount from the total price<br><br>Parameters:<br>\\\* Amount | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br><br>Discount: 50 THB<br>Total Price: 550 THB |

| Percentage discount | Coupon | Discounts the entire cart by subtracting a percentage from the total price<br><br>Parameters:<br>\\\* Percentage | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br><br>Discount: 10%<br>Total Price: 540 THB |

| Percentage discount by item category | On Top | Discount the entire amount of a specific category of items in cart<br><br>Parameters:<br>\_ Category (Clothing, Accessories, Electronics)<br>\_ Amount | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hoodie: 700 THB<br>1 Watch: 850 THB<br>1 Bag: 640 THB<br><br>Discount: 15% Off on Clothing<br>Total Price: 2,382.5 THB |

| Discount by points | On Top | Users spent points for a fixed amount of discount (1 point = 1 THB). The amount will be capped at 20% of total price<br><br>Parameters:<br>\\\* Customer points<br><br>Noted that “20%” is fixed rule | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br>1 Belt: 230 THB<br><br>Points: 68 Points<br><br>Total Price: 762 THB |

| Special campaigns | Seasonal | From the total price, at every X THB, subtracting a fixed amount Y THB<br><br>Parameters:<br>\_ Every X THB<br>\_ Discount Y THB | Items in cart:<br>1 T-Shirt: 350 THB<br>1 Hat: 250 THB<br>1 Belt: 230 THB<br><br>Discount: 40 THB at every 300 THB<br>Total Price: 750 THB |

## Users can apply multiple discount campaigns in an order. However, there are rules for applying as below:

- Apply only one campaign from the same category, i.e. users have to choose either Fixed amount or

  Percentage discount.

- The order of applying campaigns is \***\*Coupon > On Top > Seasonal\*\***.

## Your task is to create the discount module that has the following attributes:

- Take the list items in a shopping cart.

- Take the list of discount campaigns and their parameters to apply.

- Calculate the final price according to the rules.

### In order assumptions for applying order to discion

# API Specification — Discount Campaign

## Table of Contents

- [Orders]\(#orders)

- [Coupons]\(#coupons)

- [On-top Campaigns]\(#on-top-campaigns)

- [Seasonal Campaigns]\(#seasonal-campaigns)

- [Products]\(#products)

- [Error Responses]\(#error-responses)

---

## Implementation Checklist

- [ ] POST `/orders`
- [x] POST `/coupons`
- [x] PUT `/coupons/:couponId`
- [x] GET `/coupons`
- [x] GET `/coupons/:couponId`
- [x] DELETE `/coupons/:couponId`
- [x] POST `/ontop`
- [x] PUT `/ontop/:ontopId`
- [x] GET `/ontop`
- [x] GET `/ontop/:ontopId`
- [x] DELETE `/ontop/:ontopId`
- [x] POST `/seasonal`
- [x] PUT `/seasonal/:seasonalId`
- [x] GET `/seasonal`
- [x] GET `/seasonal/:seasonalId`
- [x] DELETE `/seasonal/:seasonalId`
- [x] GET `/products`

---

# Orders

## POST `/orders`

Create a new order and calculate applicable discounts.

### Request Body

```json
{
  "orders": [
    {
      "id": "1",

      "amount": 1
    }
  ],

  "coupon": "",

  "onTop": "",

  "seasonal": ""
}
```

### Field Description

| Field | Type | Required | Description |

| ----------------- | ------ | -------- | ----------------------------- |

| `orders` | Array | Yes | List of products in the order |

| `orders[].id` | String | Yes | Product ID |

| `orders[].amount` | Number | Yes | Product quantity |

| `coupon` | String | No | Coupon ID |

| `onTop` | String | No | On-top campaign ID |

| `seasonal` | String | No | Seasonal campaign ID |

### Validation Rules

- `orders` must contain at least one product.

- Product quantity must be greater than 0.

- Percentage discount must not exceed 100%.

- Discount amount must not exceed the applicable subtotal.

- Each campaign type can be applied at most once per order.

### Example Response — 201 Created

```json
{
  "orderId": "1",

  "subtotal": 1350,

  "discount": {
    "coupon": 100,

    "onTop": 50,

    "seasonal": 100
  },

  "totalDiscount": 250,

  "total": 1100
}
```

---

# Coupons

## POST `/coupons`

Create a new coupon.

### Request Body

```json
{
  "type": "fixed",

  "amount": 10
}
```

### Field Description

| Field | Type | Required | Description |

| -------- | ------ | -------- | -------------------------------------- |

| `type` | String | Yes | Discount type: `fixed` or `percentage` |

| `amount` | Number | Yes | Discount amount or percentage |

### Validation Rules

- `type` must be `fixed` or `percentage`.

- `amount` must be greater than 0.

- If `type` is `percentage`, `amount` must not exceed 100.

### Example Response — 201 Created

```json
{
  "id": "1",

  "type": "fixed",

  "amount": 10
}
```

---

## PUT `/coupons/:couponId`

Update an existing coupon.

### Path Parameter

| Field | Type | Required | Description |

| ---------- | ------ | -------- | ----------- |

| `couponId` | String | Yes | Coupon ID |

### Request Body

```json
{
  "type": "percentage",

  "amount": 20
}
```

### Example Response — 200 OK

```json
{
  "id": "1",

  "type": "percentage",

  "amount": 20
}
```

---

## GET `/coupons`

Retrieve all coupons.

### Example Response — 200 OK

```json
{
  "coupons": [
    {
      "id": "1",

      "type": "fixed",

      "amount": 10
    },

    {
      "id": "2",

      "type": "percentage",

      "amount": 20
    }
  ]
}
```

---

## DELETE `/coupons/:couponId`

Delete an existing coupon.

### Path Parameter

| Field      | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| `couponId` | String | Yes      | Coupon ID   |

### Example Response — 204 No Content

No response body.

---

# On-top Campaigns

## POST `/ontop`

Create a new On-top campaign.

### Request Body

```json
{
  "type": "clothing",

  "amount": 10
}
```

### Field Description

| Field | Type | Required | Description |

| -------- | ------ | -------- | ----------------- |

| `type` | String | Yes | Campaign category |

| `amount` | Number | Yes | Discount amount |

### Supported Types

| Type | Description |

| ------------- | --------------------------------- |

| `clothing` | Discount for clothing products |

| `accessories` | Discount for accessories products |

| `electronics` | Discount for electronics products |

| `points` | Discount based on customer points |

### Validation Rules

- `type` must be one of the supported types.

- `amount` must be greater than 0.

- Percentage discount must not exceed 100%.

### Example Response — 201 Created

```json
{
  "id": "1",

  "type": "clothing",

  "amount": 10
}
```

---

## PUT `/ontop/:ontopId`

Update an existing On-top campaign.

### Path Parameter

| Field | Type | Required | Description |

| --------- | ------ | -------- | ------------------ |

| `ontopId` | String | Yes | On-top campaign ID |

### Request Body

```json
{
  "type": "accessories",

  "amount": 15
}
```

### Example Response — 200 OK

```json
{
  "id": "1",

  "type": "accessories",

  "amount": 15
}
```

---

## GET `/ontop`

Retrieve all On-top campaigns.

### Example Response — 200 OK

```json
{
  "ontops": [
    {
      "id": "1",

      "type": "clothing",

      "amount": 10
    },

    {
      "id": "2",

      "type": "points",

      "amount": 100
    }
  ]
}
```

---

## GET `/ontop/:ontopId`

Retrieve On-top campaigns by Id.

### Example Response — 200 OK

```json
{
  "ontop": {
    "id": "1",

    "type": "clothing",

    "amount": 10
  }
}
```

---

## DELETE `/ontop/:ontopId`

Delete an existing On-top campaign.

### Path Parameter

| Field     | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `ontopId` | String | Yes      | On-top campaign ID |

### Example Response — 204 No Content

No response body.

---

# Seasonal Campaigns

## Discount Condition

The `every` field defines the spending threshold required to receive a discount.

The `discount` field defines the discount amount for each threshold.

### Example

```json
{
  "every": 10,

  "discount": 1
}
```

For every 10 THB spent, the customer receives a 1 THB discount.

### Calculation Formula

```text

Total Discount = floor(Subtotal / Every) * Discount

```

### Example Calculation

| Subtotal | Every | Discount | Total Discount |

| -------: | ----: | -------: | -------------: |

| 10 | 10 | 1 | 1 |

| 50 | 10 | 1 | 5 |

| 100 | 10 | 1 | 10 |

| 105 | 10 | 1 | 10 |

### Validation Rules

- `every` must be greater than 0.

- `discount` must be greater than 0.

- `discount` must not exceed `every`.

- Total discount must not exceed the applicable subtotal.

---

## POST `/seasonal`

Create a new Seasonal campaign.

### Request Body

```json
{
  "every": 10,

  "discount": 1
}
```

### Field Description

| Field | Type | Required | Description |

| ---------- | ------ | -------- | ----------------------------- |

| `every` | Number | Yes | Spending threshold |

| `discount` | Number | Yes | Discount amount per threshold |

### Example Response — 201 Created

```json
{
  "id": "1",

  "every": 10,

  "discount": 1
}
```

---

## PUT `/seasonal/:seasonalId`

Update an existing Seasonal campaign.

### Path Parameter

| Field | Type | Required | Description |

| ------------ | ------ | -------- | -------------------- |

| `seasonalId` | String | Yes | Seasonal campaign ID |

### Request Body

```json
{
  "every": 10,

  "discount": 1
}
```

### Example Response — 200 OK

```json
{
  "id": "1",

  "every": 10,

  "discount": 1
}
```

---

## GET `/seasonal`

Retrieve all Seasonal campaigns.

### Example Response — 200 OK

```json
{
  "seasonals": [
    {
      "id": "1",

      "every": 10,

      "discount": 1
    },

    {
      "id": "2",

      "every": 500,

      "discount": 50
    }
  ]
}
```

---

## GET `/seasonal/:seasinalId`

Retrieve Seasonal campaigns by Id.

### Example Response — 200 OK

```json
{
  "seasonal": {
    "id": "1",

    "every": 10,

    "discount": 1
  }
}
```

---

## DELETE `/seasonal/:seasonalId`

Delete an existing Seasonal campaign.

### Path Parameter

| Field        | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| `seasonalId` | String | Yes      | Seasonal campaign ID |

### Example Response — 204 No Content

No response body.

---

# Products

## GET `/products`

Retrieve all available products.

### Example Response — 200 OK

```json
{
  "products": [
    {
      "id": "1",

      "name": "T-Shirt",

      "category": "Clothing",

      "price": 350
    },

    {
      "id": "2",

      "name": "Hat",

      "category": "Accessories",

      "price": 250
    },

    {
      "id": "3",

      "name": "Hoodie",

      "category": "Clothing",

      "price": 700
    },

    {
      "id": "4",

      "name": "Watch",

      "category": "Electronics",

      "price": 850
    },

    {
      "id": "5",

      "name": "Bag",

      "category": "Accessories",

      "price": 640
    },

    {
      "id": "6",

      "name": "Belt",

      "category": "Accessories",

      "price": 230
    },

    {
      "id": "7",

      "name": "Shoes",

      "category": "Clothing",

      "price": 1200
    }
  ]
}
```

### Field Description

| Field | Type | Description |

| ---------- | ------ | -------------------- |

| `id` | String | Product ID |

| `name` | String | Product name |

| `category` | String | Product category |

| `price` | Number | Product price in THB |

### Supported Categories

| Category | Description |

| ------------- | -------------------- |

| `Clothing` | Clothing products |

| `Accessories` | Accessories products |

| `Electronics` | Electronics products |

---

# Error Responses

## 400 Bad Request

Invalid request data or validation failure.

```json
{
  "statusCode": 400,

  "message": "Percentage discount must not exceed 100",

  "error": "Bad Request"
}
```

## 404 Not Found

Requested resource does not exist.

```json
{
  "statusCode": 404,

  "message": "Coupon not found",

  "error": "Not Found"
}
```

## 500 Internal Server Error

Unexpected server error.

```json
{
  "statusCode": 500,

  "message": "Internal server error",

  "error": "Internal Server Error"
}
```
