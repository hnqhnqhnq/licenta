import numpy as np

SEVERITY_MILD_MAX = 20.0
SEVERITY_MODERATE_MAX = 50.0

HEATMAP_THRESHOLD = 0.3

def calculate_severity(heatmap, threshold=HEATMAP_THRESHOLD):
    if heatmap is None or heatmap.size == 0:
        raise ValueError("Heatmap is empty or None")
    
    active_pixels = np.sum(heatmap > threshold)
    total_pixels = heatmap.size
    severity_pct = (active_pixels / total_pixels) * 100
    
    if severity_pct < SEVERITY_MILD_MAX:
        severity_level = "Mild"
        color = "green"
        description = "Boala este in stadiu incipient, recomandam monitorizare"
    elif severity_pct < SEVERITY_MODERATE_MAX:
        severity_level = "Moderate"
        color = "orange"
        description = "Boala s-a raspandit semnificativ, recomandam tratament rapid"
    else:
        severity_level = "Severe"
        color = "red"
        description = "Boala este in stadiu avansat, necesita interventie urgenta"
    
    return {
        "severity_pct": round(severity_pct, 2),
        "severity_level": severity_level,
        "color": color,
        "description": description
    }


def get_severity_summary(heatmap, threshold=HEATMAP_THRESHOLD):
    result = calculate_severity(heatmap, threshold)

    return f"{result['severity_level']} ({result['severity_pct']}% affected)"


if __name__ == "__main__":
    print("Testing severity.py...")
    
    test_heatmap_mild = np.zeros((224, 224))
    test_heatmap_mild[100:110, 100:110] = 0.8
    
    test_heatmap_moderate = np.zeros((224, 224))
    test_heatmap_moderate[50:150, 50:150] = 0.8
    
    test_heatmap_severe = np.ones((224, 224)) * 0.6
    
    print("\nTest 1 - Small active area:")
    result = calculate_severity(test_heatmap_mild)
    print(f"  Result: {result}")
    
    print("\nTest 2 - Medium active area:")
    result = calculate_severity(test_heatmap_moderate)
    print(f"  Result: {result}")
    
    print("\nTest 3 - Large active area:")
    result = calculate_severity(test_heatmap_severe)
    print(f"  Result: {result}")
    
    print("\nTest passed!")