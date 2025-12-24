# 📊 How to Import Products from Excel/CSV

## ✅ Bulk Import Products Feature

You can now import multiple products at once from an Excel spreadsheet or CSV file!

---

## 📋 Step-by-Step Guide

### **Step 1: Prepare Your Excel/CSV File**

1. **Create a new Excel file** (or CSV file)
2. **First row must contain column headers:**
   - `Barcode` (required) - Product barcode (ONLY REQUIRED FIELD)
   - `Name` (optional) - Product name (default: "Product [barcode]" if not provided)
   - `Category` (optional) - Product category
   - `Cost Price` (optional) - Cost price (default: 0)
   - `Selling Price` (optional) - Selling price (default: 0)
   - `Stock` (optional) - Current stock quantity (default: 0)
   - `Reorder Level` (optional) - Reorder level (default: 10)
   - `Supplier` (optional) - Supplier name

3. **Fill in the data rows** (one product per row)

---

### **Example Excel/CSV Format:**

| Barcode | Name | Category | Cost Price | Selling Price | Stock | Reorder Level | Supplier |
|---------|------|----------|------------|---------------|-------|---------------|----------|
| 8901234567890 | Rice 5kg | Grains | 450 | 650 | 45 | 10 | ABC Distributors |
| 8901234567891 | Cooking Oil 2L | Oils | 280 | 380 | 8 | 15 | ABC Distributors |
| 8901234567892 | | | | | | | |

**Note:** Only Barcode is required! All other fields are optional. If Name is not provided, it will default to "Product [barcode]".

---

### **Column Name Variations (All Supported):**

The system accepts multiple column name variations (case-insensitive):

- **Name:** `Name`, `name`, `Product Name`, `product name`, `Product`, `product`
- **Barcode:** `Barcode`, `barcode`, `Code`, `code`, `SKU`, `sku`
- **Category:** `Category`, `category`, `Cat`, `cat`
- **Cost Price:** `Cost Price`, `cost price`, `Cost`, `cost`, `CostPrice`, `costprice`
- **Selling Price:** `Selling Price`, `selling price`, `Price`, `price`, `SellingPrice`, `sellingprice`
- **Stock:** `Stock`, `stock`, `Quantity`, `quantity`, `Qty`, `qty`
- **Reorder Level:** `Reorder Level`, `reorder level`, `Reorder`, `reorder`, `ReorderLevel`, `reorderlevel`
- **Supplier:** `Supplier`, `supplier`, `Vendor`, `vendor`

---

### **Step 2: Import the File**

1. **Go to Products & Prices** from the menu
2. **Click the "Import Excel/CSV" button** (blue button with upload icon, next to "Add New Product")
3. **Select your Excel or CSV file** - You can choose from:
   - Your computer hard drive
   - **Flash drive / USB drive** (plug in your flash drive, then navigate to it in the file picker)
   - Network drive
   - Any other storage location
4. **Navigate to your flash drive** in the file picker:
   - Look for your USB drive letter (e.g., E:, F:, G:)
   - Open it and find your Excel file
   - Select the file and click "Open"
5. **Wait for processing** - the system will:
   - Parse the file
   - Validate each product
   - Show any errors (if found)
   - Import all valid products

---

### **Step 3: Review Results**

After import:
- ✅ You'll see a success message with the number of products imported
- ⚠️ If there are errors, you'll be shown which rows had issues
- 📦 All imported products will appear in your products list

---

## 📝 Required Fields

**MUST have:**
- ✅ **Barcode** - Product barcode (ONLY REQUIRED FIELD)

**Optional fields:**
- ⚠️ Name (default: "Product [barcode]" if not provided)
- ⚠️ Category
- ⚠️ Cost Price (default: 0)
- ⚠️ Selling Price (default: 0)
- ⚠️ Stock (default: 0)
- ⚠️ Reorder Level (default: 10)
- ⚠️ Supplier

---

## ✅ Supported File Formats

- ✅ **Excel:** `.xlsx`, `.xls`
- ✅ **CSV:** `.csv`

---

## 💡 Tips

1. **Save as CSV if having issues** - CSV is more compatible
2. **Use the template** - Check `EXCEL_IMPORT_TEMPLATE.csv` for reference
3. **Start with a few products** - Test with 2-3 products first
4. **Check column headers** - Make sure first row has column names
5. **Required fields** - Don't forget Name and Selling Price

---

## ❌ Common Errors

### "No data found in the file!"
- Make sure your file has data rows (not just headers)
- Check that the file format is correct (.xlsx, .xls, or .csv)

### "Barcode is required"
- Make sure every row has a barcode
- Check for empty cells in the Barcode column
- Barcode must be unique (cannot duplicate existing products)

### "Product with barcode [xxx] already exists"
- This barcode is already in your system
- Either update the existing product manually or use a different barcode

---

## 📥 Sample Template File

A sample CSV template file (`EXCEL_IMPORT_TEMPLATE.csv`) is included with the system. You can:
1. Open it in Excel
2. Modify it with your products
3. Save it
4. Import it!

---

**Happy importing!** 🎉

