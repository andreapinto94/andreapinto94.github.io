import json
import os

# Your exact Google Scholar ID
AUTHOR_ID = 'cM30-0YAAAAJ'

def fetch_data():
    from scholarly import scholarly
    print(f"Fetching Google Scholar profile for {AUTHOR_ID}...")
    
    # We only request the main profile page to avoid IP blocks from Google.
    author = scholarly.search_author_id(AUTHOR_ID)
    author = scholarly.fill(author, sections=['basics', 'indices', 'publications'])
    
    profile = {
        "name": author.get("name"),
        "affiliation": author.get("affiliation"),
        "citedby": author.get("citedby"),
        "hindex": author.get("hindex"),
        "i10index": author.get("i10index"),
        "publications": []
    }
    
    print(f"Found {len(author.get('publications', []))} publications. Processing...")
    
    for pub in author.get('publications', []):
        pub_id = pub.get('author_pub_id')
        
        profile["publications"].append({
            "title": pub.get("bib", {}).get("title", "Untitled"),
            "year": pub.get("bib", {}).get("pub_year", "N/A"),
            "citations": pub.get("num_citations", 0),
            # Construct direct URL using the raw Scholar format
            "url": f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user={AUTHOR_ID}&citation_for_view={pub_id}"
        })
        
    # Ensure the Astro data directory exists
    os.makedirs('src/data', exist_ok=True)
    with open('src/data/scholar.json', 'w') as f:
        json.dump(profile, f, indent=2)
        
    print("Successfully saved data to src/data/scholar.json")

if __name__ == '__main__':
    try:
        fetch_data()
    except Exception as e:
        print(f"WARNING: Failed to fetch fresh data from Google Scholar: {e}")
        print("Using the existing committed src/data/scholar.json data to preserve build stability.")
        import sys
        sys.exit(0)