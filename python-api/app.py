
import io
import random
from pathlib import Path

import torch
from flask import Flask, request, jsonify
from PIL import Image
from torchvision import transforms

from model import ASLCNN, IMG_SIZE, LETTERS, NUM_CLASSES

app = Flask(__name__)

MODEL_PATH = Path(__file__).parent / "model.pt"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
class_names = LETTERS
img_size = IMG_SIZE

_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
])


def load_model():
    global model, class_names, img_size
    if not MODEL_PATH.is_file():
        return False
    ckpt = torch.load(MODEL_PATH, map_location=device, weights_only=False)
    class_names = ckpt.get("classes", LETTERS)
    img_size = ckpt.get("img_size", IMG_SIZE)
    model = ASLCNN(num_classes=len(class_names)).to(device)
    model.load_state_dict(ckpt["state_dict"])
    model.eval()
    return True


def predict_letter(image_bytes: bytes):
    if model is None:
        letter = random.choice(LETTERS)
        confidence = round(random.uniform(0.5, 0.98), 2)
        return {
            "letter": letter,
            "confidence": confidence,
            "top3": [{"letter": letter, "confidence": confidence}],
        }

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    x = _transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)[0]

    k = min(3, probs.shape[0])
    topk_conf, topk_idx = torch.topk(probs, k=k)
    top3: list[dict[str, float | str]] = []
    for c, i in zip(topk_conf, topk_idx):
        top3.append(
            {
                "letter": class_names[i.item()],
                "confidence": round(float(c.item()), 2),
            }
        )

    best = top3[0]
    return {
        "letter": best["letter"],
        "confidence": best["confidence"],
        "top3": top3,
    }


@app.before_request
def ensure_model():
    if model is None and MODEL_PATH.is_file():
        load_model()


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400
    file = request.files["image"]
    if not file or file.filename == "":
        return jsonify({"error": "Empty image"}), 400
    try:
        data = file.read()
        result = predict_letter(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    load_model()
    if model is None:
        print("No model.pt found — run train.py first. API will return random A–Z until then.")
    app.run(host="0.0.0.0", port=3001, debug=True)
