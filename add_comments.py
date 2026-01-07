import os
import glob

# Find all .js and .jsx files in src directory
src_path = r"d:\office\novotion-erp\erp-1\src"
comment = "// Updated: 2025-12-27\n"

# Get all JS and JSX files
js_files = glob.glob(os.path.join(src_path, "**", "*.js"), recursive=True)
jsx_files = glob.glob(os.path.join(src_path, "**", "*.jsx"), recursive=True)
all_files = js_files + jsx_files

print(f"Found {len(all_files)} files to update")

for file_path in all_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Only add comment if it doesn't already exist
        if "// Updated: 2025-12-27" not in content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(comment + content)
            print(f"Updated: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

print("Done!")
