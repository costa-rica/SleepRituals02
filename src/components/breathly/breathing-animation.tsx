/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Adapted from: https://github.com/mmazzarolo/breathly-app
 * Original author: Matteo Mazzarolo
 */

import React, { FC, useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { animate, times, getShortestDeviceDimension } from "./utils";

const shortestDeviceDimension = getShortestDeviceDimension();
const circleWidth = shortestDeviceDimension / 2;
const MOUNT_ANIMATION_DURATION = 300;

interface Props {
  animationValue: Animated.Value;
  color?: string;
}

export const BreathingAnimation: FC<Props> = ({ animationValue, color = '#8B7FB8' }) => {
  const mountAnimationValue = useRef(new Animated.Value(0)).current;
  const innerOpacity = animationValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0.1, 0, 0],
  });
  const innerScale = animationValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [1.02, 0.9, 0.9],
  });

  useEffect(() => {
    animate(mountAnimationValue, { toValue: 1, duration: MOUNT_ANIMATION_DURATION }).start();
  }, []);

  return (
    <Animated.View
      style={{
        minWidth: shortestDeviceDimension,
        minHeight: shortestDeviceDimension,
        opacity: mountAnimationValue,
      }}
    >
      <View style={styles.innerCircleContainer}>
        <Animated.View
          style={[
            styles.innerCircle,
            {
              width: circleWidth,
              height: circleWidth,
              borderRadius: circleWidth / 2,
              backgroundColor: color,
              opacity: innerOpacity,
              transform: [{ scale: innerScale }],
            },
          ]}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: shortestDeviceDimension / 4,
          top: shortestDeviceDimension / 4,
        }}
      >
        {times(8).map((index) => (
          <RotatingCircle
            key={`circle-${index}`}
            color={color}
            opacity={0.2}
            animationValue={animationValue}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );
};

interface RotatingCircleProps {
  animationValue: Animated.Value;
  opacity: number;
  index: number;
  color: string;
}

const RotatingCircle: FC<RotatingCircleProps> = ({ animationValue, opacity, index, color }) => {
  const rotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [`${index * 45}deg`, `${index * 45 + 180}deg`],
  });
  const translate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, circleWidth / 6],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        backgroundColor: color,
        width: circleWidth,
        height: circleWidth,
        borderRadius: circleWidth / 2,
        transform: [
          { rotateZ: rotation },
          { translateX: translate },
          { translateY: translate },
        ],
      }}
    />
  );
};

const styles = StyleSheet.create({
  innerCircleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    position: 'absolute',
    zIndex: 0,
  },
});
