from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/diseases", tags=["diseases"])

DISCLAIMER = (
    "This result comes from an image-based model and is not a definitive diagnosis. "
    "Confirm with a local agricultural extension officer or plant pathologist before "
    "taking action, and follow local guidance and product labels for any treatment."
)

HEALTHY_MANAGEMENT = ["No treatment is needed. Keep monitoring the plants regularly."]
HEALTHY_PREVENTION = [
    "Water at the base of the plant and avoid wetting the leaves.",
    "Give plants enough space for air circulation.",
    "Remove plant debris and rotate crops each season.",
]

DISEASES = {
    "Pepper,_bell___Bacterial_spot": {
        "plant": "Bell pepper",
        "disease": "Bacterial spot",
        "health_status": "Diseased",
        "description": "A bacterial disease that causes spots on leaves and fruit. It spreads in warm, wet weather.",
        "symptoms": [
            "Small, water-soaked spots on leaves that turn dark brown",
            "Spots may have a yellow halo, and badly affected leaves can drop",
            "Raised, rough spots on fruit",
        ],
        "management": [
            "Remove and destroy badly infected plants and plant debris.",
            "Avoid working among wet plants, which spreads the bacteria.",
            "Ask a local extension service which treatments are approved in your area.",
        ],
        "prevention": [
            "Use certified disease-free seed and transplants.",
            "Rotate crops and avoid overhead watering.",
        ],
    },
    "Pepper,_bell___healthy": {
        "plant": "Bell pepper",
        "disease": "Healthy",
        "health_status": "Healthy",
        "description": "No visible signs of disease were detected on the leaf.",
        "symptoms": [],
        "management": HEALTHY_MANAGEMENT,
        "prevention": HEALTHY_PREVENTION,
    },
    "Potato___Early_blight": {
        "plant": "Potato",
        "disease": "Early blight",
        "health_status": "Diseased",
        "description": "A fungal disease that usually appears first on older leaves and can reduce yield.",
        "symptoms": [
            "Dark brown spots with ring-like (target) patterns",
            "Yellowing around the spots",
            "Older, lower leaves are usually affected first",
        ],
        "management": [
            "Remove heavily affected leaves and plant debris.",
            "Ask a local extension service about approved fungicides and timing.",
        ],
        "prevention": [
            "Use certified seed tubers and rotate crops.",
            "Keep plants well fed and watered, since stressed plants are more affected.",
        ],
    },
    "Potato___Late_blight": {
        "plant": "Potato",
        "disease": "Late blight",
        "health_status": "Diseased",
        "description": "A serious disease caused by a water mold. It spreads fast in cool, wet weather and can also rot tubers.",
        "symptoms": [
            "Dark, water-soaked patches on leaves",
            "White fuzzy growth on the underside of leaves in humid conditions",
            "Rapid browning of leaves and stems",
        ],
        "management": [
            "Act quickly: remove and destroy infected plants so the disease does not spread.",
            "Ask a local extension service for current recommendations.",
        ],
        "prevention": [
            "Use certified seed tubers.",
            "Destroy volunteer plants and discarded tubers.",
            "Avoid overhead irrigation and improve air flow.",
        ],
    },
    "Potato___healthy": {
        "plant": "Potato",
        "disease": "Healthy",
        "health_status": "Healthy",
        "description": "No visible signs of disease were detected on the leaf.",
        "symptoms": [],
        "management": HEALTHY_MANAGEMENT,
        "prevention": HEALTHY_PREVENTION,
    },
    "Tomato___Early_blight": {
        "plant": "Tomato",
        "disease": "Early blight",
        "health_status": "Diseased",
        "description": "A fungal disease that usually starts on lower leaves and can spread to stems and fruit.",
        "symptoms": [
            "Brown spots with ring-like (target) patterns on lower leaves",
            "Yellowing of the leaf around the spots",
            "Dark sunken lesions on stems or near the fruit stem",
        ],
        "management": [
            "Remove affected lower leaves and plant debris.",
            "Ask a local extension service about approved fungicides and timing.",
        ],
        "prevention": [
            "Rotate crops and use mulch to reduce soil splash.",
            "Water at the base and give plants space for air flow.",
        ],
    },
    "Tomato___Late_blight": {
        "plant": "Tomato",
        "disease": "Late blight",
        "health_status": "Diseased",
        "description": "A serious disease caused by a water mold. It spreads fast in cool, wet weather and can destroy plants.",
        "symptoms": [
            "Large, greasy-looking gray-green or brown blotches on leaves",
            "White fuzzy growth on the underside of leaves in humid conditions",
            "Firm, brown patches on fruit",
        ],
        "management": [
            "Act quickly: remove and destroy infected plants so the disease does not spread.",
            "Ask a local extension service for current recommendations.",
        ],
        "prevention": [
            "Use healthy transplants and avoid overhead watering.",
            "Improve air flow and remove plant debris at the end of the season.",
        ],
    },
    "Tomato___healthy": {
        "plant": "Tomato",
        "disease": "Healthy",
        "health_status": "Healthy",
        "description": "No visible signs of disease were detected on the leaf.",
        "symptoms": [],
        "management": HEALTHY_MANAGEMENT,
        "prevention": HEALTHY_PREVENTION,
    },
}


@router.get("")
def list_diseases():
    return [
        {
            "class": name,
            "plant": d["plant"],
            "disease": d["disease"],
            "health_status": d["health_status"],
        }
        for name, d in DISEASES.items()
    ]


@router.get("/{class_name}")
def disease_info(class_name: str):
    info = DISEASES.get(class_name)
    if info is None:
        raise HTTPException(status_code=404, detail="Unknown class name.")
    return {"class": class_name, **info, "disclaimer": DISCLAIMER}