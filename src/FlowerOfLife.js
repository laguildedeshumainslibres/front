import React, { Component } from 'react';

const pi = Math.PI;
const twopi = 2 * pi;
const pibythree = pi / 3;

function polarToCarthesian(theta, rho) {
  return {
    x: rho * Math.sin(theta),
    y: rho * Math.cos(theta),
  };
}

// https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
// x1,y1 is the center of the first circle, with radius r1
// x2,y2 is the center of the second ricle, with radius r2
function intersectTwoCircles({ x: x1, y: y1 }, r1, {x: x2, y: y2}, r2) {
  const centerdx = x1 - x2;
  const centerdy = y1 - y2;
  const R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);

  // no intersection
  if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) return [];

  // intersection(s) should exist
  const R2 = R * R;
  const R4 = R2 * R2;
  const a = (r1 * r1 - r2 * r2) / (2 * R2);
  const r2r2 = (r1 * r1 - r2 * r2);
  const c = Math.sqrt(2 * (r1 * r1 + r2 * r2) / R2 - (r2r2 * r2r2) / R4 - 1);

  const fx = (x1 + x2) / 2 + a * (x2 - x1);
  const gx = c * (y2 - y1) / 2;
  const ix1 = fx + gx;
  const ix2 = fx - gx;

  const fy = (y1 + y2) / 2 + a * (y2 - y1);
  const gy = c * (x1 - x2) / 2;
  const iy1 = fy + gy;
  const iy2 = fy - gy;

  // note if gy == 0 and gx == 0 then the circles are tangent and there is only one solution
  // but that one solution will just be duplicated as the code is currently written
  return [{ x: ix1, y: iy1 }, { x: ix2, y: iy2 }];
}



class FlowerOfLife extends Component {

  get seedOfLifePoints() {
    const { r } = this.props;
    const points = [];

    for (let theta = pibythree; theta < twopi; theta += pibythree) {
      points.push(polarToCarthesian(theta, r));
    }

    return points;
  }

  renderCircle(x, y, r, key) {
    const { fill, stroke, strokeWidth } = this.props;

    return React.createElement('circle', {
      fill,
      stroke,
      strokeWidth,
      r,
      key,
      cx: x + 50,
      cy: y + 50,
    });
  }

  renderFirstCircle() {
    return this.renderCircle(0, 0, this.props.r);
  }

  renderSeedOfLife() {
    const { r } = this.props;

    return this.seedOfLifePoints.map(({ x, y }, i) => this.renderCircle(x, y, r, `seed${i}`));
  }

  renderFlowerOfLife() {
    const { r } = this.props;
    const centers = this.seedOfLifePoints;
    const n = centers.length;

    const newCenters = [];

    const circles = centers.map((center, i) => {
      const secondCenterIndex = i + 1 === n ? 0 : i + 1;

      const c = intersectTwoCircles(center, r, centers[secondCenterIndex], r)[1];

      newCenters.push(c);

      return this.renderCircle(c.x, c.y, r, `flower_1_${i}`);
    });

    newCenters.forEach((center, i) => {
      const secondCenterIndex = i + 1 === n ? 0 : i + 1;

      const c = intersectTwoCircles(center, r, newCenters[secondCenterIndex], r)[1];

      // newCenters.push(c);

      circles.push(this.renderCircle(c.x, c.y, r, `flower_2_${i}`));
    });

    return circles;
  }

  render() {
    const { size } = this.props;

    // this.renderFlowerOfLife();

    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        {this.renderFirstCircle()}
        {this.renderSeedOfLife()}
        {this.renderFlowerOfLife()}
      </svg>
    );
  }
}

FlowerOfLife.defaultProps = {
  r: 10,
  size: 800,
  stroke: 'white',
  strokeWidth: 0.5,
  fill: 'transparent',
};

export default FlowerOfLife;
