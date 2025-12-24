# 🖨️ Receipt Printing Troubleshooting Guide

## Issue: Receipt Not Printing

If the "Print Receipt" button doesn't work, try these solutions:

---

## ✅ Quick Fixes

### 1. **Use Browser Print (Ctrl+P)**
- After completing a sale, the receipt modal will appear
- Press **Ctrl+P** (Windows) or **Cmd+P** (Mac)
- The print dialog will open
- Select your printer and click "Print"

### 2. **Check Browser Permissions**
- Some browsers block automatic printing
- Go to browser settings → Privacy/Security
- Allow pop-ups and printing for this site

### 3. **Check Printer Connection**
- Ensure your printer is:
  - ✅ Connected to your computer (USB or Network)
  - ✅ Turned on
  - ✅ Has paper loaded
  - ✅ Not showing any error lights

### 4. **Try Different Browser**
- Chrome: Usually works best
- Firefox: May require manual Ctrl+P
- Edge: Should work with Ctrl+P
- Safari: May need to allow printing permissions

---

## 🔧 Advanced Solutions

### Solution 1: Manual Print Dialog
1. Complete a sale
2. When receipt modal appears, press **Ctrl+P** (or **Cmd+P** on Mac)
3. Select your printer
4. Choose paper size: **80mm** (if using thermal printer)
5. Click "Print"

### Solution 2: Print to PDF
1. Complete a sale
2. Press **Ctrl+P**
3. Select "Save as PDF" as printer
4. Save the PDF
5. Print the PDF file later

### Solution 3: Copy Receipt Text
1. Right-click on the receipt
2. Select "Print" or "Save as PDF"
3. Or copy text and paste into a document

---

## 📋 Print Settings for Thermal Printers (80mm)

When printing receipts, use these settings:

- **Paper Size**: 80mm (or Custom: 80mm x 297mm)
- **Margins**: None (0mm)
- **Scale**: 100%
- **Background Graphics**: ON (to show borders and formatting)
- **Headers/Footers**: OFF

---

## 🖥️ System Requirements

For printing to work:
- ✅ Modern browser (Chrome, Firefox, Edge, Safari)
- ✅ JavaScript enabled
- ✅ Printer installed and connected
- ✅ Printer drivers installed

---

## 🆘 Still Not Working?

### Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to "Console" tab
3. Click "Print Receipt" button
4. Look for any error messages
5. Share the error message if you need help

### Alternative: Print Screen
1. Complete a sale
2. When receipt appears, press **PrtScn** (Print Screen)
3. Paste into Paint or Word
4. Print the image

### Contact Support
If none of these work, the issue might be:
- Browser compatibility
- Printer driver issues
- System permissions

---

## 💡 Tips

- **Best Browser**: Chrome usually works best for printing
- **Thermal Printers**: Use 80mm paper size setting
- **Regular Printers**: Use A4 or Letter size, adjust margins to 0
- **Save as PDF**: Great for emailing receipts to customers

---

## ✅ What Works

The receipt printing system supports:
- ✅ Thermal printers (80mm paper)
- ✅ Regular printers (A4/Letter paper)
- ✅ PDF export
- ✅ Print preview
- ✅ Multiple print formats

---

**Note**: The "Print Receipt" button uses `window.print()` which opens your browser's print dialog. If the button doesn't work, use **Ctrl+P** (or **Cmd+P**) manually - it does the same thing!

