# ASL Lingo

Web app for practicing ASL letters A–Z. You sign in front of the camera; a CNN predicts the letter. If the letter you’re supposed to sign is in the model’s top 3 guesses, it counts as correct.

**Where things are:**

- **`app/`** — Next.js pages (home, practice, progress, leaderboard) and the API route that forwards images to the Python backend.
- **`components/`** — UI pieces: camera feed (with MediaPipe hand detection + crop), prediction card, timer, modals, etc.
- **`lib/`** — Helpers (e.g. user progress, XP).
- **`python-api/`** — Backend and model:
  - **`app.py`** — Flask server. Loads `model.pt`, runs the CNN on the cropped hand image, returns letter + top 3 with confidence.
  - **`model.py`** — CNN definition (3 conv layers 32→64→128, 2 FC with dropout, 26 classes, 180×180 input).
  - **`train.py`** — Trains on SignSense data (80/10/10 train/val/test split), saves `model.pt`.
  - **`model.pt`** — Trained weights (you get this by running `train.py`; SignSense data goes in `python-api/SignSense/asl_alphabet_train/` with one folder per letter).  
    **Note:** the SignSense dataset itself is **not** included in this repo because it is too large.
- **`report/`** — Project report and analysis. **`report/report.ipynb`** is the main notebook with the write-up, figures, and any experiments.

**Train the model:**

```bash
cd python-api
pip install -r requirements.txt
python train.py --data (DataFolderName) --epochs (Num) --out model.pt
```

Frontend is Next.js + React + MediaPipe Hands in the browser (for hand crop). Backend is Python + Flask + PyTorch.
