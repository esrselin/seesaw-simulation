const plank = document.getElementById("plank");
const objectsLayer = document.getElementById("objects-layer");

const leftWeightElement = document.getElementById("left-weight");
const rightWeightElement = document.getElementById("right-weight");
const nextWeightElement = document.getElementById("next-weight");
const tiltAngleElement = document.getElementById("tilt-angle");

const objects = [];
let nextWeight = getRandomWeight();
let tiltTimeout;

function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function getColor(weight) {
  if (weight <= 3)
    return "#4CAF50";
  if (weight <= 6)
    return "#FF69B4";
  if (weight <= 9)
    return "#2196F3";
  return "#E53935";
}

function calculateTorques(objects) {
  let leftTorque = 0;
  let rightTorque = 0;

  objects.forEach((object) => {
    if (object.position < 0) {
      leftTorque += object.weight * Math.abs(object.position);
    } else if (object.position > 0) {
      rightTorque += object.weight * object.position;
    }
  });

  return { leftTorque, rightTorque };
}

function calculateWeightTotals(objects) {
  let leftWeight = 0;
  let rightWeight = 0;

  objects.forEach((object) => {
    if (object.position < 0) {
      leftWeight += object.weight;
    } else if (object.position > 0) {
      rightWeight += object.weight;
    }
  });

  return { leftWeight, rightWeight };
}

function calculateAngle(leftTorque, rightTorque) {
  const rawAngle = (rightTorque - leftTorque) / 10;
  return Math.max(-30, Math.min(30, rawAngle));
}

function updateInfoPanel(leftWeight, rightWeight, angle) {
  leftWeightElement.textContent = `${leftWeight} kg`;
  rightWeightElement.textContent = `${rightWeight} kg`;
  nextWeightElement.textContent = `${nextWeight} kg`;
  tiltAngleElement.textContent = `${angle}°`;
}

function renderObjects() {
  objectsLayer.innerHTML = "";

  const plankWidth = plank.clientWidth;
  const plankCenter = plankWidth / 2;

  objects.forEach((object, index) => {
    const el = document.createElement("div");
    el.classList.add("object");

    if (index === objects.length - 1) {
      el.classList.add("is-new");
    }

    const x = plankCenter + object.position;
    el.style.left = `${x}px`;

    const size = 10 + object.weight * 3;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;

    el.style.backgroundColor = getColor(object.weight);
    el.textContent = object.weight;

    objectsLayer.appendChild(el);
  });
}

plank.addEventListener("click", (event) => {
  const plankRect = plank.getBoundingClientRect();
  const clickX = event.clientX - plankRect.left;
  const centerX = plankRect.width / 2;
  const distanceFromCenter = Math.round(clickX - centerX);

  const weight = nextWeight;

  const newObject = {
    weight: weight,
    position: distanceFromCenter
  };

  objects.push(newObject);
  renderObjects();

  const { leftTorque, rightTorque } = calculateTorques(objects);
  const angle = calculateAngle(leftTorque, rightTorque);
  const { leftWeight, rightWeight } = calculateWeightTotals(objects);

  nextWeight = getRandomWeight();
  updateInfoPanel(leftWeight, rightWeight, angle);

  clearTimeout(tiltTimeout);
  tiltTimeout = setTimeout(() => {
    plank.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  }, 450);
});

updateInfoPanel(0, 0, 0);