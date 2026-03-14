const plank = document.getElementById("plank");

const objects = [];

function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

plank.addEventListener("click", (event) => {
  const plankRect = plank.getBoundingClientRect();
  const clickX = event.clientX - plankRect.left;
  const centerX = plankRect.width / 2;
  const distanceFromCenter = Math.round(clickX - centerX);

  let side;

  if (distanceFromCenter < 0) {
    side = "left";
  } else if (distanceFromCenter > 0) {
    side = "right";
  } else {
    side = "center";
  }

  const weight = getRandomWeight();

  const newObject = {
    weight: weight,
    position: distanceFromCenter
  };

  objects.push(newObject);

  function calculateTorques(objects){
    let leftTorque = 0;
    let rightTorque = 0;

    objects.forEach((object) => {
      if (object.position < 0) {
        leftTorque += object.weight * Math.abs(object.position);
      } else if (object.position > 0) {
        rightTorque += object.weight * object.position;
      }
    });
    return {leftTorque, rightTorque};
  }

  const { leftTorque, rightTorque } = calculateTorques(objects);


  console.log("Left torque:", leftTorque);
  console.log("Right torque:", rightTorque);
  console.log("Clicked side:", side);
  console.log("Distance from center:", distanceFromCenter);
  console.log("New object:", newObject);
  console.log("All objects:", objects);
});
