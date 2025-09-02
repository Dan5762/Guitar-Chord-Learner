#!/usr/bin/env python3
import os
import re
from pathlib import Path

def update_canonical_url(file_path):
    """Update canonical URLs to use www.learn-chords.com."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has canonical tag
    if '<link rel="canonical"' not in content:
        print(f"⚠ No canonical tag found in: {file_path}")
        return False
    
    # Update canonical URL from non-www to www
    original_content = content
    content = re.sub(
        r'<link rel="canonical" href="https://learn-chords\.com',
        '<link rel="canonical" href="https://www.learn-chords.com',
        content
    )
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated canonical URL to www in: {file_path}")
        return True
    else:
        print(f"✓ Already using www in: {file_path}")
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
    already_correct = 0
    no_canonical = 0
    
    for file_path in sorted(html_files):
        result = update_canonical_url(str(file_path))
        if result is True:
            updated += 1
        elif result is False:
            already_correct += 1
        else:
            no_canonical += 1
    
    print(f"\n--- Summary ---")
    print(f"Updated: {updated} files")
    print(f"Already correct: {already_correct} files")
    print(f"No canonical tag: {no_canonical} files")

if __name__ == "__main__":
    main()