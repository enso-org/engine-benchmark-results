import os
import sys
from pathlib import Path
from typing import Dict
import json

def find_repo_root() -> Path:
    current_dir = Path.cwd()
    while current_dir != Path("/"):
        if (current_dir / ".git").exists():
            return current_dir
        current_dir = current_dir.parent
    raise Exception("Not in a git repo")

if __name__ == "__main__":
    repo_root = find_repo_root()
    cache_dir = repo_root / "cache"
    if not cache_dir.exists():
        print("Cache dir does not exist")
        sys.exit(1)
    bench_id_timestamp_map: Dict[str, str] = {}
    for cache_file in os.listdir(cache_dir):
        if cache_file == "index.json":
          continue
        cache_file_abs = cache_dir / cache_file
        with open(cache_file_abs, "r") as f:
            cache = json.load(f)
            ts = cache["bench_run"]["head_commit"]["timestamp"]
            id = cache["bench_run"]["id"]
            fname = "cache/" + id + ".json"
            bench_id_timestamp_map[fname] = ts
    index_file = cache_dir / "index.json"
    with open(index_file, "w") as f:
        json.dump(bench_id_timestamp_map, f)
    print("done - index.json created")