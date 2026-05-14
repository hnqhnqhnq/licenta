import io
import base64
import json
import numpy as np
import torch
from torchvision import transforms
from pytorch_grad_cam import HiResCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
from PIL import Image

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

with open("/app/app/classes.json") as f:
    CLASS_NAMES: list[str] = json.load(f)


def _parse_class(raw: str) -> tuple[str, str]:
    """Returns (plant, disease) from 'Plant___Disease' format."""
    parts = raw.split("___", 1)
    plant = parts[0].replace("_", " ").replace("(", "").replace(")", "").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    return plant, disease


def _severity_from_heatmap(heatmap: np.ndarray, is_healthy: bool) -> str:
    if is_healthy:
        return "Healthy"
    active = np.sum(heatmap > 0.3) / heatmap.size * 100
    if active < 20:
        return "Mild"
    elif active < 50:
        return "Moderate"
    return "Severe"


def _overlay_to_base64(original_rgb: np.ndarray, heatmap: np.ndarray) -> str:
    overlay = show_cam_on_image(original_rgb, heatmap, use_rgb=True)
    img = Image.fromarray(overlay)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return base64.b64encode(buf.getvalue()).decode()


def _run_model(model, target_layer, image_tensor: torch.Tensor, device: torch.device, original_rgb: np.ndarray) -> dict:
    input_batch = image_tensor.unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_batch)
        probs = torch.softmax(output, dim=1)
        pred_idx = output.argmax(dim=1).item()
        confidence = float(probs[0, pred_idx].item())

    cam = HiResCAM(model=model, target_layers=target_layer)
    heatmap = cam(input_tensor=input_batch, targets=[ClassifierOutputTarget(pred_idx)])[0]

    raw_class = CLASS_NAMES[pred_idx]
    _, disease = _parse_class(raw_class)
    is_healthy = "healthy" in raw_class.lower()
    severity = _severity_from_heatmap(heatmap, is_healthy)
    gradcam_b64 = _overlay_to_base64(original_rgb, heatmap)

    return {
        "disease": disease,
        "severity": severity,
        "confidence": round(confidence, 4),
        "gradcam": gradcam_b64,
    }


def predict(image_bytes: bytes, cnn_model, eff_model, device: torch.device) -> dict:
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pil_resized = pil_img.resize((224, 224))
    original_rgb = np.array(pil_resized).astype(np.float32) / 255.0

    image_tensor = _transform(pil_img)

    cnn_result = _run_model(cnn_model, [cnn_model.conv4], image_tensor, device, original_rgb)
    eff_result = _run_model(eff_model, [eff_model.features[-1]], image_tensor, device, original_rgb)

    return {"cnn": cnn_result, "efficient": eff_result}
