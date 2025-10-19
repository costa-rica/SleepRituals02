/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Adapted from: https://github.com/mmazzarolo/breathly-app
 * Original author: Matteo Mazzarolo
 */

import React, { FC, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { animate, interpolateScale, times, useOnUpdate } from "./utils";

const dotSize = Math.floor(4);
const fadeInAnimDuration = 400;

interface Props {
  visible?: boolean;
  numberOfDots: number;
  totalDuration: number;
}

export const AnimatedDots: FC<Props> = ({ visible = false, numberOfDots, totalDuration }) => {
  const dotAnimVals = useRef(times(numberOfDots).map(() => new Animated.Value(0))).current;

  const delayDuration = Math.floor(totalDuration / numberOfDots - fadeInAnimDuration);

  const createDotAnimation = (index: number) => {
    return animate(dotAnimVals[index], {
      toValue: 1,
      duration: fadeInAnimDuration,
    });
  };
  const sequenceAnimations: Animated.CompositeAnimation[] = [];
  times(numberOfDots).forEach((index) => {
    sequenceAnimations.push(createDotAnimation(index));
    sequenceAnimations.push(Animated.delay(delayDuration));
  });
  const resetDotsAnimVals = () => dotAnimVals.forEach((val) => val.setValue(0));
  const dotsAnimation = Animated.sequence(sequenceAnimations);

  useEffect(() => {
    if (visible) {
      dotsAnimation.start(resetDotsAnimVals);
    }
    return () => {
      dotsAnimation.stop();
    };
  }, []);

  useOnUpdate((prevVisible) => {
    if (!prevVisible && visible) {
      dotsAnimation.start(resetDotsAnimVals);
    }
  }, visible);

  const dotsAnimatedStyles = dotAnimVals.map((val) => ({
    opacity: val.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      interpolateScale(val, {
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    ],
  }));

  return (
    <Animated.View style={styles.container}>
      {times(numberOfDots).map((index) => (
        <Animated.View
          key={`dot_${index}`}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              margin: dotSize * 0.7,
            },
            dotsAnimatedStyles[index],
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
