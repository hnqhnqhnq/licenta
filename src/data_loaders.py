import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from pathlib import Path
import json

DATA_DIR = Path("/Users/hnq/Desktop/licenta/cod_plante/data")
TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "val"
SRC_DIR = Path("/Users/hnq/Desktop/licenta/cod_plante/src")

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

BATCH_SIZE = 32
NUM_WORKERS = 4
IMAGE_SIZE = 224

def get_train_transforms():
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.5),
        transforms.RandomRotation(degrees=45),
        transforms.ColorJitter(
            brightness=0.3,
            contrast=0.3,
            saturation=0.3,
            hue=0.1
        ),
        transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 2.0)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])


def get_val_transforms():
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])

def get_datasets():
    train_dataset = datasets.ImageFolder(
        root=TRAIN_DIR,
        transform=get_train_transforms()
    )
    val_dataset = datasets.ImageFolder(
        root=VAL_DIR,
        transform=get_val_transforms()
    )
    return train_dataset, val_dataset


def get_dataloaders(batch_size=BATCH_SIZE, num_workers=NUM_WORKERS):
    train_dataset, val_dataset = get_datasets()
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=False
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=False
    )
    
    return train_loader, val_loader

def get_class_names():
    classes_path = SRC_DIR / "classes.json"
    with open(classes_path, "r") as f:
        return json.load(f)


def get_device():
    return torch.device("mps" if torch.backends.mps.is_available() else "cpu")


def denormalize(tensor):
    mean = torch.tensor(IMAGENET_MEAN).view(3, 1, 1)
    std = torch.tensor(IMAGENET_STD).view(3, 1, 1)
    return tensor * std + mean

if __name__ == "__main__":
    train_loader, val_loader = get_dataloaders()
    class_names = get_class_names()
    device = get_device()
    
    print(f"Device: {device}")
    print(f"Number of classes: {len(class_names)}")
    print(f"Train batches: {len(train_loader)}")
    print(f"Val batches: {len(val_loader)}")
    
    images, labels = next(iter(train_loader))
    print(f"Batch shape: {images.shape}")
    print(f"Labels shape: {labels.shape}")