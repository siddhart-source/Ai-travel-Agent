import json

def load_json(filepath):
    """Load and return JSON data from a file."""
    with open(filepath, "r") as f:
        return json.load(f)

def explore_dataset(name, data):
    """Print basic info about a dataset."""
    print(f"\n{'='*40}")
    print(f"Dataset: {name}")
    print(f"Total records: {len(data)}")
    print(f"Sample record:")
    print(json.dumps(data[0], indent=2))

# Load datasets
flights = load_json("data/flights.json")
hotels  = load_json("data/hotels.json")
places  = load_json("data/places.json")

# Explore each
explore_dataset("Flights", flights)
explore_dataset("Hotels", hotels)
explore_dataset("Places", places)