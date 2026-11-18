#!/usr/bin/env python3
"""
Quick Search Tool for Employee Skills Collection
Allows searching across all 39 skills and querying UI/UX Pro Max intelligence.
"""
import sys
import os
import json
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SKILLS_JSON = os.path.join(BASE_DIR, "skills.json")
UIPRO_SEARCH = os.path.join(BASE_DIR, "skills", "ui-ux-pro-max", "scripts", "search.py")

def load_skills():
    if os.path.exists(SKILLS_JSON):
        with open(SKILLS_JSON, "r", encoding="utf-8") as f:
            return json.load(f).get("skills", [])
    return []

def print_help():
    print("""
Employee Skills Suite - Search CLI
====================================
Usage:
  python search.py [query]              Search skills by keyword
  python search.py --list               List all available skills by category
  python search.py --cat <category>     Filter skills by category
  python search.py --uipro <query> [options]
                                        Search UI/UX Pro Max design database
                                        (styles, colors, fonts, UX rules, stacks)

Examples:
  python search.py "animation"
  python search.py --list
  python search.py --cat "UI/UX Design & Intelligence"
  python search.py --uipro "dashboard" --domain style
  python search.py --uipro "SaaS" --domain product
""")

def list_categories(skills):
    cats = {}
    for s in skills:
        cats.setdefault(s["category"], []).append(s)
    
    print("\n========================================================")
    print("   Employee Web Application Skills - Catalog")
    print("========================================================\n")
    for cat, items in sorted(cats.items()):
        print(f"## {cat} ({len(items)} skills):")
        for item in items:
            print(f"  • {item['id']:<32} - {item['summary']}")
        print()

def search_skills(skills, query):
    query_lower = query.lower()
    matches = []
    for s in skills:
        if query_lower in s["id"].lower() or query_lower in s["summary"].lower() or query_lower in s["category"].lower():
            matches.append(s)
    
    print(f"\nFound {len(matches)} skill(s) matching '{query}':\n")
    for m in matches:
        print(f"  • {m['id']:<32} [{m['category']}]")
        print(f"    {m['summary']}")
        print(f"    Path: {m['path']}\n")

def run_uipro(args):
    if not os.path.exists(UIPRO_SEARCH):
        print(f"UI/UX Pro Max search script not found at {UIPRO_SEARCH}")
        return
    cmd = [sys.executable, UIPRO_SEARCH] + args
    subprocess.run(cmd)

def main():
    if len(sys.argv) < 2:
        print_help()
        return

    arg1 = sys.argv[1]
    skills = load_skills()

    if arg1 in ("-h", "--help"):
        print_help()
    elif arg1 in ("-l", "--list"):
        list_categories(skills)
    elif arg1 in ("-c", "--cat") and len(sys.argv) > 2:
        cat_q = sys.argv[2].lower()
        matches = [s for s in skills if cat_q in s["category"].lower()]
        print(f"\nSkills in category matching '{sys.argv[2]}':\n")
        for m in matches:
            print(f"  • {m['id']:<32} - {m['summary']}")
        print()
    elif arg1 == "--uipro":
        run_uipro(sys.argv[2:])
    else:
        query = " ".join(sys.argv[1:])
        search_skills(skills, query)

if __name__ == "__main__":
    main()
