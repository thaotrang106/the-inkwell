# Chuyển tiếp thực thi sang backend/batch/recompute_popular.py
import sys
from pathlib import Path

# Thêm thư mục backend vào sys.path
backend_batch = Path(__file__).resolve().parent.parent / "backend" / "batch"
sys.path.insert(0, str(backend_batch))

from recompute_popular import run

if __name__ == "__main__":
    run()
