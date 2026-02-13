# Data Transfer Guide – Products & Stock from Old Version

Yes, **the system allows data transfer**. You can bring **products and stock** (and optionally all other data) from an old version into this one.

---

## Option 1: Full backup restore (easiest)

Use this when the old version can export a **full backup** (JSON file).

1. **In the old version**
   - Go to **Reports & Analytics** (or equivalent).
   - Click **Backup All Data** (or “Export backup”).
   - Save the `.json` file (e.g. to USB or same computer).

2. **In this system**
   - Log in as **Admin** (Manager).
   - Go to **Reports & Analytics**.
   - Click **Restore Backup**.
   - Choose the backup `.json` file from the old version.
   - Confirm when asked.
   - All data from the backup (including **products and stock**) will replace the current data.

**Note:** If the old backup format matches (has `products`, `storeConfig`, etc.), this brings over products and stock. If the old backup has a different structure, use Option 2.

---

## Option 2: Import products & stock only (Manager only)

Use this when you only have a **list of products** (and stock) – e.g. from an old export or a JSON you prepared.

1. **Prepare a JSON file** with products. It can be:
   - **An array of products:**
     ```json
     [
       { "name": "Rice 5kg", "barcode": "8901234567890", "category": "Grains", "costPrice": 450, "sellingPrice": 650, "stock": 45, "unit": "kg", "reorderLevel": 10 },
       { "name": "Cooking Oil 2L", "barcode": "8901234567891", "category": "Oils", "costPrice": 280, "sellingPrice": 380, "stock": 8, "unit": "litres" }
     ]
     ```
   - **Or a backup-style object** with a `products` array:
     ```json
     { "products": [ { "name": "Rice 5kg", "barcode": "8901234567890", "stock": 45, ... } ] }
     ```
   - Field names can be: `name`/`Name`, `barcode`/`Barcode`, `category`/`Category`, `costPrice`/`cost`/`Cost Price`, `sellingPrice`/`price`/`Selling Price`, `marketPrice`/`Market Price`, `stock`/`Stock`/`quantity`, `unit`/`Unit`, `reorderLevel`/`Reorder Level`, `supplier`/`Supplier`, `isIntangible`, `soldByAmount`.

2. **In this system**
   - Log in as **Admin** (Manager).
   - Go to **Reports & Analytics**.
   - Click **Import Products & Stock**.
   - Select your `.json` file.
   - When asked:
     - **OK** = **Replace** all current products with the imported list (recommended when moving from old system).
     - **Cancel** = **Merge** (add imported products to existing ones).

3. Products and stock are updated in the app and saved locally (works offline).

---

## Summary

| Method              | Who can do it | What you need                    | Result                          |
|---------------------|---------------|----------------------------------|---------------------------------|
| **Restore Backup**  | Admin         | Full backup `.json` from old app | All data (products, stock, etc.) |
| **Import Products & Stock** | Admin | JSON: array of products or `{ products: [...] }` | Products and stock only (replace or merge) |

Both options work **offline** (no internet required) once the file is on the same machine.
