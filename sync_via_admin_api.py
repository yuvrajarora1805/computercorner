import openpyxl
import os
import re
import requests
import sys

BASE_URL = "https://thecomputercorner.org"
ADMIN_USER = "thecomputercorner@gmail.com"
ADMIN_PASS = "Thecomputercorner@2457"
EXCEL_FILE = "finalpc_build_catalogue_copy(1).xlsx"
IMGDATA_DIR = "imgdata"

session = requests.Session()

print("=" * 60)
print("🚀 STARTING FULL CATALOGUE & HIGH-RES IMAGE UPDATE")
print("=" * 60)

# -------------------------------------------------------------------
# 1. Map High-Resolution Images from imgdata/
# -------------------------------------------------------------------
print("\n📁 Indexing high-resolution images in imgdata/ folder...")
high_res_images = {}
for root, dirs, files in os.walk(IMGDATA_DIR):
    for f in files:
        base, ext = os.path.splitext(f)
        if ext.lower() in [".jpg", ".webp", ".png", ".jpeg"]:
            if base.lower() not in high_res_images:
                high_res_images[base.lower()] = f

print(f"Indexed {len(high_res_images)} unique high-res image files.")

# -------------------------------------------------------------------
# 2. Authenticate as Admin
# -------------------------------------------------------------------
print("\n🔑 Logging into https://thecomputercorner.org as Admin...")
csrf_res = session.get(f"{BASE_URL}/api/auth/csrf")
if csrf_res.status_code != 200:
    print(f"❌ Failed to fetch CSRF token: {csrf_res.status_code}")
    sys.exit(1)

csrf_token = csrf_res.json().get("csrfToken")

login_res = session.post(
    f"{BASE_URL}/api/auth/callback/credentials",
    data={
        "username": ADMIN_USER,
        "password": ADMIN_PASS,
        "csrfToken": csrf_token,
        "redirect": "false",
        "callbackUrl": f"{BASE_URL}/"
    },
    headers={"X-Auth-Return-Redirect": "1"}
)

session_check = session.get(f"{BASE_URL}/api/auth/session").json()
if not session_check.get("user") or session_check.get("user", {}).get("role") != "admin":
    print(f"❌ Authentication failed! Session response: {session_check}")
    sys.exit(1)

print(f"✅ Authenticated as: {session_check['user']['name']} ({session_check['user']['email']})")

# -------------------------------------------------------------------
# 3. Check and Delete All Existing Products
# -------------------------------------------------------------------
print("\n🔍 Checking existing products currently in the database...")
existing_res = session.get(f"{BASE_URL}/api/products")
existing_products = existing_res.json().get("data", [])

print(f"Found {len(existing_products)} existing products.")
if len(existing_products) > 0:
    print("🗑️ Deleting existing items now...")
    deleted_count = 0
    for prod in existing_products:
        pid = prod.get("_id")
        del_res = session.delete(f"{BASE_URL}/api/products/{pid}")
        if del_res.status_code == 200:
            deleted_count += 1
        sys.stdout.write(f"\rDeleted: {deleted_count}/{len(existing_products)}")
        sys.stdout.flush()
    print(f"\n✅ All {deleted_count} old products deleted successfully.")
else:
    print("Database already clean.")

# -------------------------------------------------------------------
# 4. Read Excel Text Data & Upload With High-Res Images
# -------------------------------------------------------------------
if not os.path.exists(EXCEL_FILE):
    print(f"❌ Excel file not found: {EXCEL_FILE}")
    sys.exit(1)

print(f"\n📖 Reading text data from Excel: {EXCEL_FILE}...")
wb = openpyxl.load_workbook(EXCEL_FILE, data_only=True)
ws = wb["All Products"]
rows = list(ws.iter_rows(values_only=True))[1:]

print(f"Loaded {len(rows)} products from Excel.")
print("Uploading new products with High-Resolution image links...\n")

uploaded_count = 0
failed_count = 0

for i, row in enumerate(rows, 1):
    pid = str(row[1]).strip() if row[1] else ""
    name = str(row[2]).strip() if row[2] else ""
    cat = str(row[3]).strip() if row[3] else "processor"
    raw_p = row[4]
    specs = str(row[6]).strip() if len(row) > 6 and row[6] else ""
    desc = str(row[8]).strip() if len(row) > 8 and row[8] else ""

    clean_p = re.sub(r"[^\d.]", "", str(raw_p)) if raw_p is not None else "0"
    price = int(float(clean_p)) if clean_p else 0

    # Match exact high-res filename from imgdata/
    actual_img_file = high_res_images.get(pid.lower())
    if actual_img_file:
        img_url = f"/uploads/products/{actual_img_file}"
    else:
        img_url = f"/uploads/products/{pid}.webp"

    payload = {
        "name": name,
        "category": cat.lower(),
        "price": price,
        "img": img_url,
        "status": "In Stock",
        "rating": "4.8",
        "description": desc,
        "keyFeature": specs,
        "individualRating": "5"
    }

    res = session.post(f"{BASE_URL}/api/products", json=payload)
    if res.status_code in [200, 201]:
        uploaded_count += 1
    else:
        failed_count += 1

    sys.stdout.write(f"\rProgress: {i}/{len(rows)} | Uploaded: {uploaded_count} | Failed: {failed_count}")
    sys.stdout.flush()

print("\n" + "=" * 60)
print(f"🎉 COMPLETED! {uploaded_count} products live on https://thecomputercorner.org/")
print("=" * 60)

