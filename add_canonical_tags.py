#!/usr/bin/env python3
import os
import re
from pathlib import Path

def get_canonical_url(file_path):
    """Generate the canonical URL for a given file path."""
    # Get relative path from project root
    rel_path = os.path.relpath(file_path, '/Users/daniellong/Documents/Projects/guitar-learner')
    
    # Convert to URL path
    url_path = rel_path.replace(os.sep, '/')
    
    # Handle index.html files
    if url_path == 'index.html':
        return 'https://learn-chords.com/'
    elif url_path.endswith('/index.html'):
        # Remove index.html and keep the directory path
        return f"https://learn-chords.com/{url_path[:-11]}/"
    else:
        # For other HTML files
        return f"https://learn-chords.com/{url_path}"

def add_canonical_tag(file_path):
    """Add canonical tag to an HTML file if it doesn't already have one."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if canonical tag already exists
    if '<link rel="canonical"' in content:
        print(f"✓ Canonical tag already exists in: {file_path}")
        return False
    
    # Generate canonical URL
    canonical_url = get_canonical_url(file_path)
    
    # Find the best place to insert the canonical tag
    # Try to insert after meta keywords or description
    patterns = [
        (r'(<meta name="keywords"[^>]*>)', r'\1\n    \n    <!-- Canonical URL -->\n    <link rel="canonical" href="' + canonical_url + '">'),
        (r'(<meta name="description"[^>]*>)', r'\1\n    \n    <!-- Canonical URL -->\n    <link rel="canonical" href="' + canonical_url + '">'),
        (r'(<meta name="viewport"[^>]*>)', r'\1\n    \n    <!-- Canonical URL -->\n    <link rel="canonical" href="' + canonical_url + '">'),
        (r'(<title>[^<]*</title>)', r'\1\n    \n    <!-- Canonical URL -->\n    <link rel="canonical" href="' + canonical_url + '">')
    ]
    
    modified = False
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            break
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Added canonical tag to: {file_path}")
        print(f"  URL: {canonical_url}")
        return True
    else:
        print(f"⚠ Could not add canonical tag to: {file_path}")
        return False

def main():
    """Process all HTML files in the project."""
    project_root = Path('/Users/daniellong/Documents/Projects/guitar-learner')
    
    # Find all HTML files
    html_files = list(project_root.glob('**/*.html'))
    
    # Filter out node_modules and other directories we don't want to modify
    html_files = [f for f in html_files if 'node_modules' not in str(f) and '.git' not in str(f)]
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    updated = 0
    skipped = 0
    failed = 0
    
    for file_path in sorted(html_files):
        result = add_canonical_tag(str(file_path))
        if result is True:
            updated += 1
        elif result is False:
            skipped += 1
        else:
            failed += 1
    
    print(f"\n--- Summary ---")
    print(f"Updated: {updated} files")
    print(f"Skipped: {skipped} files (already had canonical tags)")
    print(f"Failed: {failed} files")

if __name__ == "__main__":
    main()