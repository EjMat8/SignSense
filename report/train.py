"""
Train ASL A–Z CNN on SignSense data.
Uses only asl_alphabet_train/; splits randomly into 80% train, 10% validation, 10% test.
Expects: SignSense/asl_alphabet_train/ (A/, B/, ..., Z/)
"""
import argparse
from pathlib import Path

import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader, random_split
from torchvision import transforms, datasets

from model import ASLCNN, IMG_SIZE, LETTERS, NUM_CLASSES


def get_transforms():
    train_transforms = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomRotation(10),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
    ])
    test_transforms = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
    ])
    return train_transforms, test_transforms


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data",
        type=str,
        default="SignSense",
        help="Root folder containing asl_alphabet_train/ and optionally asl_alphabet_test/",
    )
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--lr", type=float, default=0.01)
    parser.add_argument("--momentum", type=float, default=0.9)
    parser.add_argument("--out", type=str, default="model.pt", help="Output path for saved model")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for train/val/test split")
    args = parser.parse_args()

    data_root = Path(args.data)
    train_dir = data_root / "asl_alphabet_train"

    if not train_dir.is_dir():
        raise SystemExit(
            f"Missing {train_dir}. Put SignSense with asl_alphabet_train (A/, B/, ..., Z/) in the project."
        )

    train_transforms, eval_transforms = get_transforms()

    full_dataset = datasets.ImageFolder(root=str(train_dir))
    n = len(full_dataset)
    train_size = int(0.8 * n)
    test_size = int(0.1 * n)
    val_size = n - train_size - test_size

    generator = torch.Generator().manual_seed(args.seed)
    train_subset, val_subset, test_subset = random_split(
        full_dataset, [train_size, val_size, test_size], generator=generator
    )

    # Subsets reference the same dataset; we need separate ImageFolders with the right transform per split
    train_dataset = torch.utils.data.Subset(
        datasets.ImageFolder(root=str(train_dir), transform=train_transforms),
        train_subset.indices,
    )
    validation_dataset = torch.utils.data.Subset(
        datasets.ImageFolder(root=str(train_dir), transform=eval_transforms),
        val_subset.indices,
    )
    test_dataset = torch.utils.data.Subset(
        datasets.ImageFolder(root=str(train_dir), transform=eval_transforms),
        test_subset.indices,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=0,
        pin_memory=False,
    )
    validation_loader = DataLoader(
        validation_dataset,
        batch_size=args.batch_size,
        shuffle=False,
    )
    test_loader = DataLoader(
        test_dataset,
        batch_size=args.batch_size,
        shuffle=False,
    )

    classes = full_dataset.classes
    print("Classes:", classes)
    print(
        "Train:", len(train_dataset),
        "| Validation:", len(validation_dataset),
        "| Test:", len(test_dataset),
    )

    device = torch.device(
        "mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available()
        else "cuda" if torch.cuda.is_available()
        else "cpu"
    )
    print("Using device:", device)

    model = ASLCNN(num_classes=len(classes)).to(device)
    optimizer = torch.optim.SGD(model.parameters(), lr=args.lr, momentum=args.momentum)

    best_val_acc = 0.0
    best_state = None

    for epoch in range(args.epochs):
        model.train()
        total_correct = 0
        total_samples = 0
        for i, (images, labels) in enumerate(train_loader):
            images = images.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            prediction = model(images)
            loss = F.cross_entropy(prediction, labels)
            loss.backward()
            optimizer.step()
            pred = prediction.argmax(dim=1)
            total_correct += (pred == labels).sum().item()
            total_samples += labels.size(0)
            if i % 200 == 0:
                print(f"Epoch {epoch+1}/{args.epochs} | Batch {i+1}/{len(train_loader)}", flush=True)

        train_acc = 100.0 * total_correct / total_samples
        print(f"Epoch {epoch + 1}/{args.epochs} - Training Accuracy: {train_acc:.2f}%", flush=True)

        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in validation_loader:
                images = images.to(device)
                labels = labels.to(device)
                prediction = model(images)
                pred = prediction.argmax(dim=1)
                correct += (pred == labels).sum().item()
                total += labels.size(0)
        val_acc = 100.0 * correct / total
        print(f"  Validation Accuracy: {val_acc:.2f}%")
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_state = {k: v.cpu().clone() for k, v in model.state_dict().items()}

    if best_state is not None:
        model.load_state_dict(best_state)

    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)
            prediction = model(images)
            pred = prediction.argmax(dim=1)
            correct += (pred == labels).sum().item()
            total += labels.size(0)
    test_acc = 100.0 * correct / total
    print(f"Test Accuracy: {test_acc:.2f}%")

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    torch.save({
        "state_dict": model.state_dict(),
        "classes": classes,
        "img_size": IMG_SIZE,
    }, args.out)
    print(f"Saved model to {args.out} (best val_acc={best_val_acc:.2f}%, test_acc={test_acc:.2f}%)")


if __name__ == "__main__":
    main()
